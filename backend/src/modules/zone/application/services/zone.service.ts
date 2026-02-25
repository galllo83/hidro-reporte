import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IZoneRepository } from '../ports/out/zone-repository.interface';
import { Zone } from '../../domain/entities/zone.model';

@Injectable()
export class ZoneService {
    constructor(
        @Inject('IZoneRepository')
        private readonly zoneRepository: IZoneRepository,
    ) { }

    async create(createZoneDto: any): Promise<Zone> {
        const zone: Zone = {
            name: createZoneDto.name,
            polygon: createZoneDto.polygon,
            isActive: true,
        };
        return this.zoneRepository.createZone(zone);
    }

    async findAll(): Promise<Zone[]> {
        return this.zoneRepository.findAllZones();
    }

    async findOne(id: string): Promise<Zone> {
        const zone = await this.zoneRepository.findZoneById(id);
        if (!zone) {
            throw new NotFoundException(`Zone with ID ${id} not found`);
        }
        return zone;
    }

    async update(id: string, updateZoneDto: any): Promise<Zone> {
        const existingZone = await this.findOne(id);
        return this.zoneRepository.updateZone(existingZone.id!, updateZoneDto);
    }

    async remove(id: string): Promise<void> {
        const existingZone = await this.findOne(id);
        return this.zoneRepository.deleteZone(existingZone.id!);
    }
}
