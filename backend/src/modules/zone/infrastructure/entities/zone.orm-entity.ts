import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Polygon } from 'geojson';

@Entity('zones')
export class ZoneEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  // PostGIS spatial column for geometry
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Polygon',
    srid: 4326, // WGS84 standard coordinate system
  })
  polygon: Polygon;

  @Column({ type: 'varchar', length: 50, default: 'WATER_FLOWING' })
  status: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
