export interface Zone {
    id?: string;
    name: string;
    polygon: {
        type: 'Polygon';
        coordinates: number[][][]; // GeoJSON standard for polygons
    };
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
