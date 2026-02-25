import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';

export class UpdateUserDto {
  @ApiProperty({ example: 'Ulises', description: 'User name' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ example: 'ulisesnm@gmail.com', description: 'User email' })
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiProperty({ example: AddressDto, description: 'User address' })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  readonly address?: AddressDto;
}
