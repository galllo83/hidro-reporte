import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ZoneModule } from './modules/zone/zone.module';
import { CONFIG_DATABASE } from './helpers/config-database';
import { ConfigModule } from '@nestjs/config';
import { WaterServiceModule } from './modules/water-service/water-service.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [ConfigModule.forRoot(), CONFIG_DATABASE(), UserModule, AuthModule, ZoneModule, WaterServiceModule, ReportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
