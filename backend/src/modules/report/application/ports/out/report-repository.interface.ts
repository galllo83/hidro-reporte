import { ReportModel } from '../../../domain/entities/report.model';

export interface IReportRepository {
    create(report: Omit<ReportModel, 'id' | 'createdAt'>): Promise<ReportModel>;
    findAll(): Promise<ReportModel[]>;
    findByZone(zoneId: string): Promise<ReportModel[]>;
}
