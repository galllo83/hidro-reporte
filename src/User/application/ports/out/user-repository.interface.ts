import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { User } from '../../../domain/entities/user.model';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { UserSortParamsEnum } from '../../../../helpers/enums/userParamsEnum';
import { OrderParamsEnum } from '../../../../helpers/enums/orderParamsEnum';

export interface IUserRepository {
  findAll(
    sortBy: UserSortParamsEnum,
    order: OrderParamsEnum,
    options: IPaginationOptions,
  ): Promise<Pagination<User>>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findByEmailWithPassword(email: string): Promise<{ id: string; email: string; password: string; role: string } | null>;
  create(user: CreateUserDto): Promise<void>;
  update(id: string, user: UpdateUserDto): Promise<void>;
  delete(id: string): Promise<void>;
}
