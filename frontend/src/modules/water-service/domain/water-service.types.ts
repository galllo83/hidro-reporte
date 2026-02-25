export interface WaterService {
    id: string;
    userId: string;
    serviceNumber: string;
    street: string;
    neighborhood: string;
    city: string;
    postalCode: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateWaterServicePayload {
    serviceNumber: string;
    street: string;
    neighborhood: string;
    city: string;
    postalCode: string;
}
