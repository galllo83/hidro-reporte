import { Body, Controller, Get, Param, Post, Request, UseGuards, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
    @ApiResponse({ status: 201, description: 'Report successfully created and spatially matched.' })
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

    @Get('zone/:zoneId')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get reports for a specific zone' })
    @ApiResponse({ status: 200, description: 'Returns reports matched to the given zone.' })
    async getReportsByZone(@Param('zoneId') zoneId: string) {
        return this.reportService.getReportsByZone(zoneId);
    }
}
