import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IZoneRepository } from '../../../zone/application/ports/out/zone-repository.interface';
import { IReportRepository } from '../ports/out/report-repository.interface';
import { Inject } from '@nestjs/common';
import { ZoneStatus } from '../../../zone/domain/entities/zone.model';
import { ReportType } from '../../domain/entities/report.model';

@Injectable()
export class InferenceService {
  private readonly logger = new Logger(InferenceService.name);

  constructor(
    @Inject('IZoneRepository')
    private readonly zoneRepository: IZoneRepository,
    @Inject('IReportRepository')
    private readonly reportRepository: IReportRepository,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, { name: 'inference-cron-job' })
  async handleInferenceCron() {
    this.logger.debug('Running Inference Engine Cron Job...');

    try {
      const zones = await this.zoneRepository.findAllZones();

      // Limit to reports from the last 15 minutes
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

      for (const zone of zones) {
        if (!zone.id) continue;

        // Get reports for the zone
        const allReports = await this.reportRepository.findByZone(zone.id);

        // Filter recent SUPPLY_RESTORED reports
        const recentRestoredReports = allReports.filter(
          (r) =>
            r.type === ReportType.SUPPLY_RESTORED &&
            r.createdAt >= fifteenMinutesAgo,
        );

        // Filter recent SUPPLY_ENDED reports
        const recentEndedReports = allReports.filter(
          (r) =>
            r.type === ReportType.SUPPLY_ENDED &&
            r.createdAt >= fifteenMinutesAgo,
        );

        // Threshold logic:
        // 1. If we have 2 or more SUPPLY_RESTORED reports, status -> WATER_FLOWING
        // 2. Else if we have 2 or more SUPPLY_ENDED reports, status -> NO_WATER
        // 3. Else, keep previous state
        if (recentRestoredReports.length >= 2) {
          if (zone.status !== ZoneStatus.WATER_FLOWING) {
            this.logger.log(
              `Zone ${zone.name} (${zone.id}) status updated to WATER_FLOWING based on inference.`,
            );
            await this.zoneRepository.updateZone(zone.id, {
              status: ZoneStatus.WATER_FLOWING,
            });
          }
        } else if (recentEndedReports.length >= 2) {
          if (zone.status !== ZoneStatus.NO_WATER) {
            this.logger.log(
              `Zone ${zone.name} (${zone.id}) status updated to NO_WATER based on inference.`,
            );
            await this.zoneRepository.updateZone(zone.id, {
              status: ZoneStatus.NO_WATER,
            });
          }
        }
      }
    } catch (error) {
      this.logger.error('Error running Inference Engine', error);
    }
  }
}
