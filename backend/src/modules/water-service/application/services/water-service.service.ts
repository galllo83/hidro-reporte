import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { IWaterService } from '../ports/in/water-service.interface';
import { IWaterServiceRepository } from '../ports/out/water-service-repository.interface';
import { CreateWaterServiceDto } from '../dto/create-water-service.dto';
import { WaterServiceModel } from '../../domain/entities/water-service.model';

@Injectable()
export class WaterServiceService implements IWaterService {
    constructor(
        @Inject('IWaterServiceRepository')
        private readonly waterServiceRepository: IWaterServiceRepository,
    ) { }

    async registerService(userId: string, dto: CreateWaterServiceDto): Promise<WaterServiceModel> {
        const existingService = await this.waterServiceRepository.findByServiceNumber(dto.serviceNumber);

        if (existingService) {
            throw new ConflictException(`El Número de Servicio ${dto.serviceNumber} ya se encuentra registrado en el sistema.`);
        }

        return this.waterServiceRepository.create(userId, dto);
    }

    async getUserServices(userId: string): Promise<WaterServiceModel[]> {
        return this.waterServiceRepository.findByUserId(userId);
    }

    async removeService(id: string, userId: string): Promise<void> {
        const deleted = await this.waterServiceRepository.delete(id, userId);

        if (!deleted) {
            throw new NotFoundException(`No se encontró el servicio con ID ${id} o no tienes permiso para eliminarlo.`);
        }
    }
}
