import type { CreateWaterServicePayload, WaterService } from '../domain/water-service.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const waterServiceRepository = {
    getMyServices: async (token: string): Promise<WaterService[]> => {
        const response = await fetch(`${API_URL}/water-services`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || 'Error al obtener los servicios registrados.');
        }

        return response.json();
    },

    registerService: async (token: string, payload: CreateWaterServicePayload): Promise<WaterService> => {
        const response = await fetch(`${API_URL}/water-services`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || 'Error al registrar la cuenta de agua.');
        }

        return response.json();
    },

    deleteService: async (token: string, id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/water-services/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || 'Error al eliminar la cuenta de agua.');
        }
    }
};
