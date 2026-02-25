import { useState, useCallback } from 'react';
import type { WaterService, CreateWaterServicePayload } from '../domain/water-service.types';
import { waterServiceRepository } from '../infra/water-service.repo';

export const useWaterServices = () => {
    const [services, setServices] = useState<WaterService[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getToken = () => localStorage.getItem('auth_token');

    const loadServices = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) throw new Error('No estás autenticado.');

            const data = await waterServiceRepository.getMyServices(token);
            setServices(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addService = async (payload: CreateWaterServicePayload): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) throw new Error('No estás autenticado.');

            const newService = await waterServiceRepository.registerService(token, payload);
            setServices(prev => [...prev, newService]);
            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const removeService = async (id: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) throw new Error('No estás autenticado.');

            await waterServiceRepository.deleteService(token, id);
            setServices(prev => prev.filter(service => service.id !== id));
            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        services,
        isLoading,
        error,
        loadServices,
        addService,
        removeService,
    };
};
