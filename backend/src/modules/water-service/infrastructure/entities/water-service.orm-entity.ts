import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../../user/infrastructure/entities/user.orm-entity';

@Entity('water_services')
export class WaterServiceOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ unique: true, name: 'service_number' })
    serviceNumber: string;

    @Column()
    street: string;

    @Column()
    neighborhood: string;

    @Column()
    city: string;

    @Column({ name: 'postal_code' })
    postalCode: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => UserOrmEntity, (user) => user.waterServices, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserOrmEntity;
}
