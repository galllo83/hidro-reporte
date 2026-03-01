import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  Inject,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { Role } from '../../../../helpers/enums/role.enum';
import { IReportService } from '../../application/ports/in/report.interface';
import { CreateReportDto } from '../../application/dto/create-report.dto';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportController {
  constructor(
    @Inject('IReportService')
    private readonly reportService: IReportService,
  ) { }

  @Post()
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Submit a new Citizen Report (e.g. Water Arrived)' })
  @ApiResponse({
    status: 201,
    description: 'Report successfully created and spatially matched.',
  })
  async createReport(@Request() req, @Body() dto: CreateReportDto) {
    return this.reportService.createReport(req.user.id, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all reports (Admin spatial overview)' })
  @ApiResponse({ status: 200, description: 'Returns an array of all reports.' })
  async getAllReports() {
    return this.reportService.getAllReports();
  }

  @Get('stats')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get aggregated report stats grouped by zone/neighborhood for charts' })
  @ApiResponse({ status: 200, description: 'Returns an array of stats suitable for Recharts API.' })
  async getReportStats(
    @Query('day') day?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const filters = {
      day: day ? parseInt(day, 10) : undefined,
      month: month ? parseInt(month, 10) : undefined,
      year: year ? parseInt(year, 10) : undefined,
    };
    return this.reportService.getReportStatsByZone(filters);
  }

  @Get('history')
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Get personal reports history for current user' })
  @ApiResponse({ status: 200, description: 'Returns an array of user reports.' })
  async getUserReports(
    @Request() req,
    @Query('day') day?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const filters = {
      day: day ? parseInt(day, 10) : undefined,
      month: month ? parseInt(month, 10) : undefined,
      year: year ? parseInt(year, 10) : undefined,
    };
    return this.reportService.getUserReports(req.user.id, filters);
  }

  @Get('zone/:zoneId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get reports for a specific zone' })
  @ApiResponse({
    status: 200,
    description: 'Returns reports matched to the given zone.',
  })
  async getReportsByZone(@Param('zoneId') zoneId: string) {
    return this.reportService.getReportsByZone(zoneId);
  }

  @Patch(':id/attend')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mark a leak report as attended' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated report.',
  })
  async markAsAttended(@Param('id') id: string) {
    return this.reportService.markAsAttended(id);
  }
}

