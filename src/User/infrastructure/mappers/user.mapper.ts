import { User } from '../../domain/entities/user.model';
import { Address } from '../../domain/value-objects/address.value-object';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { Role } from '../../../helpers/enums/role.enum';

export class UserMapper {
  static toDomain(entity: UserOrmEntity): User {
    const user = new User();
    user.id = entity.id;
    user.name = entity.name;
    user.email = entity.email;
    user.role = entity.role as Role;

    if (entity.address) {
      const address = new Address();
      const addr = entity.address;
      address.street = addr.street;
      address.number = addr.number;
      address.city = addr.city;
      address.state = addr.state;
      address.zipCode = addr.zipCode;
      user.address = address;
    }

    user.createdAt = entity.createdAt;
    user.updatedAt = entity.updatedAt;
    user.deletedAt = entity.deletedAt;
    return user;
  }

  static toOrm(user: User): UserOrmEntity {
    const entity = new UserOrmEntity();
    if (user.id) entity.id = user.id;
    entity.name = user.name;
    entity.email = user.email;
    entity.address = user.address as unknown as Record<string, string>;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    entity.deletedAt = user.deletedAt;
    return entity;
  }
}
