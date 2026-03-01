import { ReportModel } from '../../../domain/entities/report.model';
import { CreateReportDto } from '../../dto/create-report.dto';

export interface IReportService {
  createReport(userId: string, dto: CreateReportDto): Promise<ReportModel>;
  getReportsByZone(zoneId: string): Promise<ReportModel[]>;
  getAllReports(): Promise<ReportModel[]>;
  getUserReports(userId: string, filters?: { day?: number, month?: number, year?: number }): Promise<ReportModel[]>;
  markAsAttended(reportId: string): Promise<ReportModel>;
  getReportStatsByZone(): Promise<any[]>;
}

