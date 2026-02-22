import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AddressDto } from './address.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'Ulises', description: 'User name' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'ulisesnm@gmail.com', description: 'User email' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'MyP@ss123', description: 'User password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiProperty({ example: AddressDto, description: 'User address' })
  readonly address: AddressDto;
}
