import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserOrmEntity } from '../../../user/infrastructure/entities/user.orm-entity';
import { ZoneEntity } from '../../../zone/infrastructure/entities/zone.orm-entity';
import { ReportType } from '../../domain/entities/report.model';

@Entity('reports')
export class ReportOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  // zone_id can be null if the GPS point doesn't fall into any registered polygon
  @Column({ name: 'zone_id', nullable: true })
  zoneId: string | null;

  @ManyToOne(() => ZoneEntity, { nullable: true })
  @JoinColumn({ name: 'zone_id' })
  zone: ZoneEntity;

  @Column({ type: 'enum', enum: ReportType })
  type: ReportType;

  // PostGIS Point Geometry: SRID 4326 (WGS 84 GPS coordinates)
  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
