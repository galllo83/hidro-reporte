import { IsString, IsNotEmpty, MaxLength, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateZoneDto {
    @ApiProperty({ description: 'Name of the zone (polygon/valve area)', example: 'Zona Norte - El Arbolito' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name: string;

    @ApiProperty({ description: 'GeoJSON Polygon geometry', type: Object })
    @IsObject()
    @IsNotEmpty()
    polygon: object;
}

export class UpdateZoneDto {
    @ApiProperty({ description: 'Name of the zone', example: 'Zona Norte - El Arbolito', required: false })
    @IsString()
    @MaxLength(150)
    name?: string;

    @ApiProperty({ description: 'GeoJSON Polygon geometry', type: Object, required: false })
    @IsObject()
    polygon?: object;

    @ApiProperty({ description: 'Zone status', example: 'WATER_FLOWING', required: false })
    @IsString()
    status?: string;
}
