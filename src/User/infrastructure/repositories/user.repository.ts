import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { IUserRepository } from '../../application/ports/out/user-repository.interface';
import { User } from '../../domain/entities/user.model';
import { UserCredentials } from '../../domain/entities/user-credentials.model';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { UserSortParamsEnum } from '../../../helpers/enums/userParamsEnum';
import { OrderParamsEnum } from '../../../helpers/enums/orderParamsEnum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>,
  ) { }

  async findAll(
    sortBy: UserSortParamsEnum,
    order: OrderParamsEnum,
    options: IPaginationOptions,
  ): Promise<Pagination<User>> {
    const queryBuilder = this.ormRepository.createQueryBuilder('u');
    const sortField = sortBy || UserSortParamsEnum.CREATED_AT;
    const sortOrder = order || OrderParamsEnum.ASC;
    queryBuilder.orderBy(`u.${sortField}`, sortOrder);
    const paginatedResult = await paginate<UserOrmEntity>(
      queryBuilder,
      options,
    );
    return {
      ...paginatedResult,
      items: paginatedResult.items.map(UserMapper.toDomain),
    };
  }

  async findById(id: string): Promise<User> {
    const entity = await this.ormRepository.findOneBy({ id });
    if (!entity) return null;
    return UserMapper.toDomain(entity);
  }

  async findByEmail(email: string): Promise<User> {
    const entity = await this.ormRepository.findOneBy({ email });
    if (!entity) return null;
    return UserMapper.toDomain(entity);
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<UserCredentials | null> {
    const entity = await this.ormRepository.findOneBy({ email });
    if (!entity) return null;
    return {
      id: entity.id,
      email: entity.email,
      password: entity.password,
      role: entity.role,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    const entity = new UserOrmEntity();
    entity.name = createUserDto.name;
    entity.email = createUserDto.email;
    entity.address = createUserDto.address as any;

    const salt = await bcrypt.genSalt(10);
    entity.password = await bcrypt.hash(createUserDto.password, salt);

    await this.ormRepository.save(entity);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    await this.ormRepository.update(id, updateUserDto as any);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
