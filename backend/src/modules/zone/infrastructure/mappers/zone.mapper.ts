import { Zone, ZoneStatus } from '../../domain/entities/zone.model';
import { ZoneEntity } from '../entities/zone.orm-entity';

export class ZoneMapper {
  static toDomain(ormEntity: ZoneEntity): Zone {
    return {
      id: ormEntity.id,
      name: ormEntity.name,
      polygon: ormEntity.polygon as any, // mapping GeoJSON polygon
      status: ormEntity.status as ZoneStatus,
      isActive: ormEntity.is_active,
      createdAt: ormEntity.created_at,
      updatedAt: ormEntity.updated_at,
    };
  }

  static toOrm(domain: Zone): ZoneEntity {
    const ormEntity = new ZoneEntity();
    if (domain.id) ormEntity.id = domain.id;
    ormEntity.name = domain.name;
    ormEntity.polygon = domain.polygon as any;
    if (domain.status) ormEntity.status = domain.status;
    if (domain.isActive !== undefined) ormEntity.is_active = domain.isActive;
    return ormEntity;
  }
}
