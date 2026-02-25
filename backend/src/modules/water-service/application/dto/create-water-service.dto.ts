import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, IsIn } from 'class-validator';

const HIDALGO_CITIES = [
    'Pachuca de Soto',
    'Mineral de la Reforma',
    'Zempoala',
    'Tulancingo',
    'Tizayuca',
    'Ixmiquilpan',
    'Actopan',
    'Huejutla de Reyes',
    'Tepeji del Río',
    'Tula de Allende'
];

export class CreateWaterServiceDto {
    @ApiProperty({ example: '123456789', description: 'Número de Servicio de Agua' })
    @IsString()
    @IsNotEmpty()
    readonly serviceNumber: string;

    @ApiProperty({ example: 'Av. Universidad 123', description: 'Calle y Número' })
    @IsString()
    @IsNotEmpty()
    readonly street: string;

    @ApiProperty({ example: 'Villas del Álamo', description: 'Colonia / Fraccionamiento' })
    @IsString()
    @IsNotEmpty()
    readonly neighborhood: string;

    @ApiProperty({ example: 'Mineral de la Reforma', description: 'Municipio (Solo Hidalgo)' })
    @IsString()
    @IsNotEmpty()
    @IsIn(HIDALGO_CITIES, { message: 'El servicio debe pertenecer a un municipio del Estado de Hidalgo.' })
    readonly city: string;

    @ApiProperty({ example: '42184', description: 'Código Postal' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{5}$/, { message: 'El código postal debe tener 5 dígitos' })
    readonly postalCode: string;
}
