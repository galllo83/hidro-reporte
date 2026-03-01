import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ZoneService } from '../../application/services/zone.service';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { Role } from '../../../../helpers/enums/role.enum';
import { CreateZoneDto, UpdateZoneDto } from '../../application/dto/zone.dto';

@ApiTags('Zones')
@ApiBearerAuth()
@Controller('zones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) { }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new zone polygon (Admin only)' })
  create(@Body() createZoneDto: CreateZoneDto) {
    return this.zoneService.create(createZoneDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all zones (Admins and Citizens)' })
  findAll() {
    return this.zoneService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a zone by ID' })
  findOne(@Param('id') id: string) {
    return this.zoneService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a zone (Admin only)' })
  update(@Param('id') id: string, @Body() updateZoneDto: UpdateZoneDto) {
    return this.zoneService.update(id, updateZoneDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a zone (Admin only)' })
  remove(@Param('id') id: string) {
    return this.zoneService.remove(id);
  }
}
