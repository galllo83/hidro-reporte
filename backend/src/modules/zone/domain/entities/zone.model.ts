export enum ZoneStatus {
  WATER_FLOWING = 'WATER_FLOWING',
  NO_WATER = 'NO_WATER',
}

export interface Zone {
  id?: string;
  name: string;
  polygon: {
    type: 'Polygon';
    coordinates: number[][][]; // GeoJSON standard for polygons
  };
  status?: ZoneStatus;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
