import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZoneController } from './infrastructure/controllers/zone.controller';
import { ZoneService } from './application/services/zone.service';
import { ZoneRepository } from './infrastructure/repositories/zone.repository';
import { ZoneEntity } from './infrastructure/entities/zone.orm-entity';
import { AuthModule } from '../auth/auth.module'; // To use JwtAuthGuard and RolesGuard

@Module({
    imports: [
        TypeOrmModule.forFeature([ZoneEntity]),
        AuthModule,
    ],
    controllers: [ZoneController],
    providers: [
        ZoneService,
        {
            provide: 'IZoneRepository',
            useClass: ZoneRepository,
        },
    ],
    exports: [ZoneService],
})
export class ZoneModule { }
