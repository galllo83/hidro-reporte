import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IZoneRepository } from '../../application/ports/out/zone-repository.interface';
import { Zone } from '../../domain/entities/zone.model';
import { ZoneEntity } from '../entities/zone.orm-entity';
import { ZoneMapper } from '../mappers/zone.mapper';

@Injectable()
export class ZoneRepository implements IZoneRepository {
  constructor(
    @InjectRepository(ZoneEntity)
    private readonly repository: Repository<ZoneEntity>,
  ) {}

  async createZone(zone: Zone): Promise<Zone> {
    const ormEntity = ZoneMapper.toOrm(zone);
    const savedEntity = await this.repository.save(ormEntity);
    return ZoneMapper.toDomain(savedEntity);
  }

  async findAllZones(): Promise<Zone[]> {
    const entities = await this.repository.find({ where: { is_active: true } });
    return entities.map(ZoneMapper.toDomain);
  }

  async findZoneById(id: string): Promise<Zone | null> {
    const entity = await this.repository.findOne({
      where: { id, is_active: true },
    });
    if (!entity) return null;
    return ZoneMapper.toDomain(entity);
  }

  async findZoneByName(name: string): Promise<Zone | null> {
    const entity = await this.repository.findOne({
      where: { name, is_active: true },
    });
    if (!entity) return null;
    return ZoneMapper.toDomain(entity);
  }

  async checkIntersection(polygon: any): Promise<boolean> {
    const query = this.repository
      .createQueryBuilder('zone')
      .where('zone.is_active = :isActive', { isActive: true })
      .andWhere('ST_Intersects(zone.polygon, ST_GeomFromGeoJSON(:polygon))', {
        polygon: JSON.stringify(polygon),
      });

    const count = await query.getCount();
    return count > 0;
  }

  async updateZone(id: string, zone: Partial<Zone>): Promise<Zone> {
    await this.repository.update(id, {
      ...(zone.name && { name: zone.name }),
      ...(zone.polygon && { polygon: zone.polygon as any }),
      ...(zone.status && { status: zone.status }),
      ...(zone.isActive !== undefined && { is_active: zone.isActive }),
    });
    const updatedEntity = await this.repository.findOne({ where: { id } });
    return ZoneMapper.toDomain(updatedEntity!);
  }

  async deleteZone(id: string): Promise<void> {
    // Soft delete to preserve historical data logic if needed
    await this.repository.update(id, { is_active: false });
  }
}
