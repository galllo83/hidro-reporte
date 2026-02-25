import { CreateWaterServiceDto } from '../../dto/create-water-service.dto';
import { WaterServiceModel } from '../../../domain/entities/water-service.model';

export interface IWaterService {
    registerService(userId: string, dto: CreateWaterServiceDto): Promise<WaterServiceModel>;
    getUserServices(userId: string): Promise<WaterServiceModel[]>;
    removeService(id: string, userId: string): Promise<void>;
}
