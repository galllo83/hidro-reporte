import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaterServiceOrmEntity } from './infrastructure/entities/water-service.orm-entity';
import { WaterServiceController } from './infrastructure/controllers/water-service.controller';
import { WaterServiceService } from './application/services/water-service.service';
import { WaterServiceRepository } from './infrastructure/repositories/water-service.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WaterServiceOrmEntity])],
  controllers: [WaterServiceController],
  providers: [
    {
      provide: 'IWaterService',
      useClass: WaterServiceService,
    },
    {
      provide: 'IWaterServiceRepository',
      useClass: WaterServiceRepository,
    },
  ],
  exports: ['IWaterService'],
})
export class WaterServiceModule { }
