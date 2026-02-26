import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportOrmEntity } from './infrastructure/entities/report.orm-entity';
import { ReportController } from './infrastructure/controllers/report.controller';
import { ReportService } from './application/services/report.service';
import { ReportRepository } from './infrastructure/repositories/report.repository';
import { ZoneModule } from '../zone/zone.module';
import { InferenceService } from './application/services/inference.service';

@Module({
    imports: [TypeOrmModule.forFeature([ReportOrmEntity]), ZoneModule],
    controllers: [ReportController],
    providers: [
        {
            provide: 'IReportService',
            useClass: ReportService,
        },
        {
            provide: 'IReportRepository',
            useClass: ReportRepository,
        },
        InferenceService,
    ],
    exports: ['IReportService'],
})
export class ReportModule { }
