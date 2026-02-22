import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddressDto {
  @ApiProperty({
    example: 'North Garfield Ave',
    required: true,
  })
  @IsString()
  street: string;

  @ApiProperty({
    example: '100',
    required: true,
  })
  @IsString()
  number: string;

  @ApiProperty({
    example: 'Pasadena',
    required: true,
  })
  @IsString()
  city: string;

  @ApiProperty({
    example: 'California',
    required: true,
  })
  @IsString()
  state: string;

  @ApiProperty({
    example: '91101',
    required: true,
  })
  @IsString()
  zipCode: string;
}
