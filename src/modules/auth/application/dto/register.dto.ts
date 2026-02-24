import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from '../../../User/application/dto/address.dto';

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

  @ApiProperty({ example: AddressDto, description: 'User address' })
  @ValidateNested()
  @Type(() => AddressDto)
  readonly address: AddressDto;
}
