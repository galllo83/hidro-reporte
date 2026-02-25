import { Zone } from '../../../domain/entities/zone.model';

export interface IZoneRepository {
    createZone(zone: Zone): Promise<Zone>;
    findAllZones(): Promise<Zone[]>;
    findZoneById(id: string): Promise<Zone | null>;
    findZoneByName(name: string): Promise<Zone | null>;
    checkIntersection(polygon: any): Promise<boolean>;
    updateZone(id: string, zone: Partial<Zone>): Promise<Zone>;
    deleteZone(id: string): Promise<void>;
}
