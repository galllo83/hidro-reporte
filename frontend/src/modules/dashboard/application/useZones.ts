import { useState, useCallback } from 'react';
import { apiClient } from '../../../core/api/api.config';

export interface Zone {
    id: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    polygon: any; // GeoJSON Polygon
    status?: 'WATER_FLOWING' | 'NO_WATER' | string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const useZones = () => {
    const [zones, setZones] = useState<Zone[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchZones = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<Zone[]>('/zones');
            setZones(response.data);
        } catch (err: unknown) {
            const typedErr = err as { response?: { data?: { message?: string } } };
            console.error('Error fetching zones:', typedErr);
            setError(typedErr.response?.data?.message || 'Error al cargar las zonas');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createZone = async (name: string, geojson: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post<Zone>('/zones', {
                name,
                polygon: geojson
            });
            setZones(prev => [...prev, response.data]);
            return response.data;
        } catch (err: unknown) {
            const typedErr = err as { response?: { data?: { message?: string | string[] } } };
            console.error('Error creating zone:', typedErr);
            let errorMessage = 'Error al guardar la zona';
            if (typedErr.response?.data?.message) {
                errorMessage = Array.isArray(typedErr.response.data.message)
                    ? typedErr.response.data.message.join(', ')
                    : typedErr.response.data.message;
            }
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        zones,
        isLoading,
        error,
        fetchZones,
        createZone
    };
};
