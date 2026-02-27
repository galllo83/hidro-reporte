import { ReportModel } from '../../../domain/entities/report.model';

export interface IReportRepository {
  create(report: Omit<ReportModel, 'id' | 'createdAt'>): Promise<ReportModel>;
  findAll(): Promise<ReportModel[]>;
  findByZone(zoneId: string): Promise<ReportModel[]>;
  findById(id: string): Promise<ReportModel | null>;
  update(id: string, data: Partial<ReportModel>): Promise<ReportModel>;
}
