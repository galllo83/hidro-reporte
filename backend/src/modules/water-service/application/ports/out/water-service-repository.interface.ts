import { WaterServiceModel } from '../../../domain/entities/water-service.model';

export interface IWaterServiceRepository {
  create(
    userId: string,
    data: Partial<WaterServiceModel>,
  ): Promise<WaterServiceModel>;
  findByUserId(userId: string): Promise<WaterServiceModel[]>;
  findByServiceNumber(serviceNumber: string): Promise<WaterServiceModel | null>;
  delete(id: string, userId: string): Promise<boolean>;
}
