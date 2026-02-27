import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IReportService } from '../ports/in/report.interface';
import { IReportRepository } from '../ports/out/report-repository.interface';
import { CreateReportDto } from '../dto/create-report.dto';
import { ReportModel } from '../../domain/entities/report.model';
import { EntityManager } from 'typeorm';

@Injectable()
export class ReportService implements IReportService {
  constructor(
    @Inject('IReportRepository')
    private readonly reportRepository: IReportRepository,
    private readonly entityManager: EntityManager,
  ) { }

  async createReport(
    userId: string,
    dto: CreateReportDto,
  ): Promise<ReportModel> {
    // Spatial Intersect Logic (HU-06)
    // Find the zone that contains this point
    const query = `
      SELECT id 
      FROM zones
      WHERE ST_DWithin(
        polygon::geography, 
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 
        500
      )
      ORDER BY ST_Distance(
        polygon::geography, 
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      ) ASC
      LIMIT 1;
    `;

    // PostGIS MakePoint takes (longitude, latitude)
    const result = await this.entityManager.query(query, [
      dto.location.lng,
      dto.location.lat,
    ]);
    let zoneId: string | null = null;

    if (result && result.length > 0) {
      zoneId = result[0].id;
    }

    return this.reportRepository.create({
      userId,
      zoneId,
      type: dto.type,
      location: dto.location,
      address: dto.address,
      isAttended: false,
    });
  }

  async getReportsByZone(zoneId: string): Promise<ReportModel[]> {
    return this.reportRepository.findByZone(zoneId);
  }

  getAllReports(): Promise<ReportModel[]> {
    return this.reportRepository.findAll();
  }

  async markAsAttended(reportId: string): Promise<ReportModel> {
    const report = await this.reportRepository.findById(reportId);
    if (!report) {
      throw new NotFoundException(`Report with ID ${reportId} not found`);
    }
    return this.reportRepository.update(reportId, { isAttended: true });
  }
}
