import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportOrmEntity } from './infrastructure/entities/report.orm-entity';
import { ReportController } from './infrastructure/controllers/report.controller';
import { ReportService } from './application/services/report.service';
import { ReportRepository } from './infrastructure/repositories/report.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ReportOrmEntity])],
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
    ],
    exports: ['IReportService'],
})
export class ReportModule { }
