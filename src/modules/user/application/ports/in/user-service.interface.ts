import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { User } from '../../../domain/entities/user.model';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { UserSortParamsEnum } from '../../../../../helpers/enums/userParamsEnum';
import { OrderParamsEnum } from '../../../../../helpers/enums/orderParamsEnum';

export interface IUserService {
  findAll(
    sortBy: UserSortParamsEnum,
    order: OrderParamsEnum,
    options: IPaginationOptions,
  ): Promise<Pagination<User>>;
  findById(id: string): Promise<User>;
  create(user: CreateUserDto): Promise<void>;
  update(id: string, user: UpdateUserDto): Promise<void>;
  delete(id: string): Promise<void>;
}
