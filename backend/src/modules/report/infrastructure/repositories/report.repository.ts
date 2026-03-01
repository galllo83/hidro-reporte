import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IReportRepository } from '../../application/ports/out/report-repository.interface';
import { ReportModel } from '../../domain/entities/report.model';
import { ReportOrmEntity } from '../entities/report.orm-entity';

@Injectable()
export class ReportRepository implements IReportRepository {
  constructor(
    @InjectRepository(ReportOrmEntity)
    private readonly reportRepository: Repository<ReportOrmEntity>,
  ) { }

  private mapToDomain(entity: ReportOrmEntity): ReportModel {
    return new ReportModel(
      entity.id,
      entity.userId,
      entity.zoneId,
      entity.type,
      entity.location
        ? {
          lat: entity.location.coordinates[1],
          lng: entity.location.coordinates[0],
        }
        : { lat: 0, lng: 0 },
      entity.createdAt,
      entity.isAttended,
      entity.street
        ? {
          street: entity.street,
          neighborhood: entity.neighborhood,
          postalCode: entity.postalCode,
        }
        : undefined,
    );
  }

  async create(
    report: Omit<ReportModel, 'id' | 'createdAt'>,
  ): Promise<ReportModel> {
    const point = {
      type: 'Point',
      coordinates: [report.location.lng, report.location.lat], // GeoJSON format: [longitude, latitude]
    };

    const entity = this.reportRepository.create({
      userId: report.userId,
      zoneId: report.zoneId,
      type: report.type,
      location: point,
      street: report.address?.street,
      neighborhood: report.address?.neighborhood,
      postalCode: report.address?.postalCode,
      isAttended: report.isAttended || false,
    });

    const saved = await this.reportRepository.save(entity);
    return this.mapToDomain(saved);
  }

  async findAll(): Promise<ReportModel[]> {
    const entities = await this.reportRepository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map((e) => this.mapToDomain(e));
  }

  async findByUserId(
    userId: string,
    filters?: { day?: number; month?: number; year?: number },
  ): Promise<ReportModel[]> {
    const qb = this.reportRepository.createQueryBuilder('report');
    qb.where('report.userId = :userId', { userId });

    if (filters?.year) {
      qb.andWhere("EXTRACT(YEAR FROM report.createdAt AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') = :year", { year: filters.year });
    }
    if (filters?.month) {
      qb.andWhere("EXTRACT(MONTH FROM report.createdAt AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') = :month", { month: filters.month });
    }
    if (filters?.day) {
      qb.andWhere("EXTRACT(DAY FROM report.createdAt AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') = :day", { day: filters.day });
    }

    qb.orderBy('report.createdAt', 'DESC');

    const entities = await qb.getMany();
    return entities.map((e) => this.mapToDomain(e));
  }

  async findByZone(zoneId: string, filters?: { day?: number, month?: number, year?: number }): Promise<ReportModel[]> {
    const queryBuilder = this.reportRepository.createQueryBuilder('report')
      .where('report.zoneId = :zoneId', { zoneId })
      .orderBy('report.createdAt', 'DESC');

    if (filters?.year) {
      queryBuilder.andWhere("EXTRACT(YEAR FROM report.createdAt AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') = :year", { year: filters.year });
    }
    if (filters?.month) {
      queryBuilder.andWhere("EXTRACT(MONTH FROM report.createdAt AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') = :month", { month: filters.month });
    }
    if (filters?.day) {
      queryBuilder.andWhere("EXTRACT(DAY FROM report.createdAt AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') = :day", { day: filters.day });
    }

    const entities = await queryBuilder.getMany();
    return entities.map((e) => this.mapToDomain(e));
  }

  async findById(id: string): Promise<ReportModel | null> {
    const entity = await this.reportRepository.findOne({ where: { id } });
    if (!entity) return null;
    return this.mapToDomain(entity);
  }

  async update(
    id: string,
    data: Partial<ReportModel>,
  ): Promise<ReportModel> {
    const updateData: any = { ...data };

    // Flatten address if provided
    if (data.address) {
      updateData.street = data.address.street;
      updateData.neighborhood = data.address.neighborhood;
      updateData.postalCode = data.address.postalCode;
      delete updateData.address;
    }

    // Convert location if provided
    if (data.location) {
      updateData.location = {
        type: 'Point',
        coordinates: [data.location.lng, data.location.lat],
      };
    }

    await this.reportRepository.update(id, updateData);
    const updatedEntity = await this.reportRepository.findOne({ where: { id } });
    return this.mapToDomain(updatedEntity!);
  }

  async getReportStatsByZone(filters?: { day?: number, month?: number, year?: number, zoneName?: string }): Promise<any[]> {
    // TypeORM query to count reports grouped by polygon (zone) and type
    const qb = this.reportRepository
      .createQueryBuilder('report')
      .leftJoin('report.zone', 'zone')
      .select('zone.name', 'neighborhood') // Map zone name to 'neighborhood' to keep frontend intact
      .addSelect('report.type', 'type')
      .addSelect('COUNT(report.id)', 'count');

    if (filters?.year) {
      qb.andWhere("EXTRACT(YEAR FROM report.createdAt AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') = :year", { year: filters.year });
    }
    if (filters?.month) {
      qb.andWhere("EXTRACT(MONTH FROM report.createdAt AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') = :month", { month: filters.month });
    }
    if (filters?.day) {
      qb.andWhere("EXTRACT(DAY FROM report.createdAt AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') = :day", { day: filters.day });
    }
    if (filters?.zoneName) {
      qb.andWhere("COALESCE(zone.name, 'Desconocido') ILIKE :zoneName", { zoneName: `%${filters.zoneName}%` });
    }

    const stats = await qb
      .groupBy('zone.name')
      .addGroupBy('report.type')
      .getRawMany();

    // The raw result is flat: [{ neighborhood: 'Centro', type: 'LEAK_REPORTED', count: '5' }, ...]
    // We need to pivot this for Recharts: [{ neighborhood: 'Centro', SUPPLY_RESTORED: 10, LEAK_REPORTED: 5, ... }]
    const pivotedStats: Record<string, any> = {};

    for (const stat of stats) {
      const { neighborhood, type, count } = stat;
      // If a zone has no name, fallback to 'Desconocido'
      const zoneName = neighborhood || 'Desconocido';

      if (!pivotedStats[zoneName]) {
        pivotedStats[zoneName] = { neighborhood: zoneName };
      }
      // PostgreSQL COUNT returns a string, so we parse it to a number
      pivotedStats[zoneName][type] = parseInt(count, 10);
    }

    return Object.values(pivotedStats);
  }
}

