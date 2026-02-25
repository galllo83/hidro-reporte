import { useState, useCallback } from 'react';
import { apiClient } from '../../../core/api/api.config';

export interface Zone {
    id: string;
    name: string;
    polygon: any; // GeoJSON Polygon
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
        } catch (err: any) {
            console.error('Error fetching zones:', err);
            setError(err.response?.data?.message || 'Error al cargar las zonas');
        } finally {
            setIsLoading(false);
        }
    }, []);

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
        } catch (err: any) {
            console.error('Error creating zone:', err);
            let errorMessage = 'Error al guardar la zona';
            if (err.response?.data?.message) {
                errorMessage = Array.isArray(err.response.data.message)
                    ? err.response.data.message.join(', ')
                    : err.response.data.message;
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
