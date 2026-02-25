import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddressDto {
  @ApiProperty({
    example: 'North Garfield Ave',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    example: '100',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    example: 'Pasadena',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: 'California',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    example: '91101',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  zipCode: string;
}
