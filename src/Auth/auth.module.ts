import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './application/services/auth.service';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { UserModule } from '../User/user.module';

@Module({
    imports: [
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET', 'default-secret-change-me'),
                signOptions: {
                    expiresIn: configService.get<number>('JWT_EXPIRATION', 86400),
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: 'IAuthService',
            useClass: AuthService,
        },
        JwtStrategy,
    ],
    exports: [JwtStrategy, PassportModule],
})
export class AuthModule { }
