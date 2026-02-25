import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const CONFIG_DATABASE = () =>
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'ulises',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hidro_reporte',
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV !== 'production',
    namingStrategy: new SnakeNamingStrategy(),
  });
