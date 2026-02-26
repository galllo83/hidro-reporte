import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  Inject,
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
import { IWaterService } from '../../application/ports/in/water-service.interface';
import { CreateWaterServiceDto } from '../../application/dto/create-water-service.dto';

@ApiTags('Water Services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('water-services')
export class WaterServiceController {
  constructor(
    @Inject('IWaterService')
    private readonly waterService: IWaterService,
  ) {}

  @Post()
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Register a new Water Service for the Citizen' })
  @ApiResponse({
    status: 201,
    description: 'Water service successfully hooked to the account.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g. invalid Hidalgo municipality).',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Service Number already registered.',
  })
  async registerService(@Request() req, @Body() dto: CreateWaterServiceDto) {
    return this.waterService.registerService(req.user.id, dto);
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({
    summary:
      'Get all Water Services registered to the currently logged in Citizen',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of WaterServiceModel objects.',
  })
  async getMyServices(@Request() req) {
    return this.waterService.getUserServices(req.user.id);
  }

  @Delete(':id')
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Remove a Water Service from the Citizen account' })
  @ApiResponse({
    status: 200,
    description: 'Successfully unhooked the service.',
  })
  @ApiResponse({ status: 404, description: 'Not found or unauthorized.' })
  async removeService(@Request() req, @Param('id') id: string) {
    return this.waterService.removeService(id, req.user.id);
  }
}
