import { useState, useCallback } from 'react';
import { reportRepo } from '../infra/report.repo';
import type { ReportResponse } from '../domain/report.types';

export const useUserReports = () => {
    const [reports, setReports] = useState<ReportResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReports = useCallback(async (filters?: { day?: number; month?: number; year?: number }) => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedReports = await reportRepo.getUserHistory(filters);
            setReports(fetchedReports);
        } catch (err: any) {
            console.error('Failed to fetch user reports:', err);
            setError(err.message || 'Error al obtener el historial de reportes. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        reports,
        isLoading,
        error,
        fetchReports,
    };
};
