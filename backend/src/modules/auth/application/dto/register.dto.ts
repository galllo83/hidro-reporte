import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Ulises', description: 'User name' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'ulisesnm@gmail.com', description: 'User email' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'MyP@ss123',
    description: 'User password (min 6 characters)',
  })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
