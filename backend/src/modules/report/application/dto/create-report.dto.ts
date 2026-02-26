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

export class CreateReportDto {
    @ApiProperty({ enum: ReportType, example: ReportType.SUPPLY_RESTORED })
    @IsEnum(ReportType)
    @IsNotEmpty()
    type: ReportType;

    @ApiProperty({ type: LocationDto })
    @ValidateNested()
    @Type(() => LocationDto)
    @IsNotEmpty()
    location: LocationDto;
}
