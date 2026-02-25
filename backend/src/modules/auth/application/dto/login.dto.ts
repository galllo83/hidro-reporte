import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'ulisesnm@gmail.com', description: 'User email' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'MyP@ss123', description: 'User password' })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
