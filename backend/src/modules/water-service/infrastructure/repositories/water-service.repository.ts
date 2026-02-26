import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IWaterServiceRepository } from '../../application/ports/out/water-service-repository.interface';
import { WaterServiceModel } from '../../domain/entities/water-service.model';
import { WaterServiceOrmEntity } from '../entities/water-service.orm-entity';

@Injectable()
export class WaterServiceRepository implements IWaterServiceRepository {
  constructor(
    @InjectRepository(WaterServiceOrmEntity)
    private readonly ormRepository: Repository<WaterServiceOrmEntity>,
  ) {}

  private mapToDomain(ormEntity: WaterServiceOrmEntity): WaterServiceModel {
    return new WaterServiceModel(
      ormEntity.id,
      ormEntity.userId,
      ormEntity.serviceNumber,
      ormEntity.street,
      ormEntity.neighborhood,
      ormEntity.city,
      ormEntity.postalCode,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  async create(
    userId: string,
    data: Partial<WaterServiceModel>,
  ): Promise<WaterServiceModel> {
    const newService = this.ormRepository.create({
      userId,
      serviceNumber: data.serviceNumber,
      street: data.street,
      neighborhood: data.neighborhood,
      city: data.city,
      postalCode: data.postalCode,
    });

    await this.ormRepository.save(newService);
    return this.mapToDomain(newService);
  }

  async findByUserId(userId: string): Promise<WaterServiceModel[]> {
    const services = await this.ormRepository.find({ where: { userId } });
    return services.map(this.mapToDomain);
  }

  async findByServiceNumber(
    serviceNumber: string,
  ): Promise<WaterServiceModel | null> {
    const service = await this.ormRepository.findOne({
      where: { serviceNumber },
    });
    return service ? this.mapToDomain(service) : null;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.ormRepository.delete({ id, userId });
    return result.affected > 0;
  }
}
