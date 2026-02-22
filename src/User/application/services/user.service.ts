import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/entities/user.model';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUserRepository } from '../ports/out/user-repository.interface';
import { IUserService } from '../ports/in/user-service.interface';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { OrderParamsEnum } from '../../../helpers/enums/orderParamsEnum';
import { UserSortParamsEnum } from '../../../helpers/enums/userParamsEnum';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) { }

  async findAll(
    sortBy: UserSortParamsEnum,
    order: OrderParamsEnum,
    options: IPaginationOptions,
  ): Promise<Pagination<User>> {
    return this.userRepository.findAll(sortBy, order, options);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    return this.userRepository.create(createUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException();
    return this.userRepository.update(id, updateUserDto);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException();
    return this.userRepository.delete(id);
  }
}
