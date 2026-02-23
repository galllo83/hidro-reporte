import { Controller, Post, Body, Inject, HttpCode } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../../application/dto/login.dto';
import { RegisterDto } from '../../application/dto/register.dto';
import { IAuthService } from '../../application/ports/in/auth-service.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        @Inject('IAuthService')
        private readonly authService: IAuthService,
    ) { }

    @Post('register')
    @ApiResponse({
        status: 201,
        description: 'User registered successfully. Returns JWT access token.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid data.' })
    @ApiResponse({ status: 409, description: 'Conflict - Email already registered.' })
    async register(@Body() registerDto: RegisterDto): Promise<{ accessToken: string }> {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Login successful. Returns JWT access token.',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials.' })
    async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
        return this.authService.login(loginDto);
    }
}
