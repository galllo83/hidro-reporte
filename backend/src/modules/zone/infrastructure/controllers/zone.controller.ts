import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ZoneService } from '../../application/services/zone.service';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { Role } from '../../../../helpers/enums/role.enum';

@Controller('zones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ZoneController {
    constructor(private readonly zoneService: ZoneService) { }

    @Post()
    @Roles(Role.ADMIN) // Only admins can draw/save new zones
    create(@Body() createZoneDto: any) {
        return this.zoneService.create(createZoneDto);
    }

    @Get()
    // Both admins and citizens can see the zones
    findAll() {
        return this.zoneService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.zoneService.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body() updateZoneDto: any) {
        return this.zoneService.update(id, updateZoneDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.zoneService.remove(id);
    }
}
