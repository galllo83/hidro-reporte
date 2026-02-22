import { RegisterDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';

export interface IAuthService {
    register(dto: RegisterDto): Promise<{ accessToken: string }>;
    login(dto: LoginDto): Promise<{ accessToken: string }>;
}
