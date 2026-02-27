import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReportType } from '../../domain/entities/report.model';

class LocationDto {
  @ApiProperty({ example: 20.0818, description: 'Latitude' })
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @ApiProperty({ example: -98.7189, description: 'Longitude' })
  @IsNumber()
  @IsNotEmpty()
  lng: number;
}

export class AddressDto {
  @ApiProperty({ example: 'Calle 5 de Mayo', description: 'Street name' })
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'Centro', description: 'Neighborhood' })
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({ example: '42000', description: 'Postal Code' })
  @IsNotEmpty()
  postalCode: string;
}


export class CreateReportDto {
  @ApiProperty({
    enum: ReportType,
    example: ReportType.SUPPLY_RESTORED,
    description:
      'SUPPLY_RESTORED = Llegó el agua, LEAK_REPORTED = Fuga de agua, SUPPLY_ENDED = Se fue el agua',
  })
  @IsEnum(ReportType)
  @IsNotEmpty()
  type: ReportType;

  @ApiProperty({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmpty()
  location: LocationDto;

  @ApiProperty({ type: AddressDto, required: false })
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}

