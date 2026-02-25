import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { Role } from '../../../../helpers/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { WaterServicesSeed } from '../../../../database/seeds/water-services.seed';

@Injectable()
export class DatabaseSeeder implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
    private readonly dataSource: DataSource,
  ) { }

  async onModuleInit() {
    await this.seedUsers();
    await WaterServicesSeed.run(this.dataSource);
  }

  private async seedUsers() {
    const count = await this.userRepository.count();
    if (count > 0) {
      this.logger.log('Users already exist, skipping seed.');
      return;
    }

    const salt = await bcrypt.genSalt(10);

    const admin = this.userRepository.create({
      name: 'Admin',
      email: 'admin@admin.com',
      password: await bcrypt.hash('admin123', salt),
      role: Role.ADMIN,
      address: {
        street: 'Main St',
        number: '1',
        city: 'CDMX',
        state: 'CDMX',
        zipCode: '06600',
      } as any,
    });

    const user = this.userRepository.create({
      name: 'User',
      email: 'user@user.com',
      password: await bcrypt.hash('user1234', salt),
      role: Role.USER,
      address: {
        street: 'Second St',
        number: '2',
        city: 'CDMX',
        state: 'CDMX',
        zipCode: '06600',
      } as any,
    });

    await this.userRepository.save([admin, user]);
    this.logger.log('Default users seeded successfully:');
    this.logger.log('  Admin → admin@admin.com / admin123');
    this.logger.log('  User  → user@user.com / user1234');
  }
}
