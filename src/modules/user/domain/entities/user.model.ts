import { Address } from '../value-objects/address.value-object';
import { Role } from '../../../../helpers/enums/role.enum';

export class User {
  id: string;
  name: string;
  email: string;
  role: Role;
  address: Address;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
