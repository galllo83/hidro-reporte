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
            entity.location ? { lat: entity.location.coordinates[1], lng: entity.location.coordinates[0] } : { lat: 0, lng: 0 },
            entity.createdAt,
        );
    }

    async create(report: Omit<ReportModel, 'id' | 'createdAt'>): Promise<ReportModel> {
        const point = {
            type: 'Point',
            coordinates: [report.location.lng, report.location.lat], // GeoJSON format: [longitude, latitude]
        };

        const entity = this.reportRepository.create({
            userId: report.userId,
            zoneId: report.zoneId,
            type: report.type,
            location: point,
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

    async findByZone(zoneId: string): Promise<ReportModel[]> {
        const entities = await this.reportRepository.find({
            where: { zoneId },
            order: { createdAt: 'DESC' },
        });
        return entities.map((e) => this.mapToDomain(e));
    }
}
