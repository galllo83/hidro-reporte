import { useState, useCallback } from 'react';
import { reportRepo } from '../infra/report.repo';

interface ReportFilters {
    day?: number;
    month?: number;
    year?: number;
    zoneName?: string;
}

export const useReportStats = () => {
    const [stats, setStats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async (filters?: ReportFilters) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await reportRepo.getReportStats(filters);
            setStats(data);
        } catch (err: any) {
            setError(err.message || 'Error al obtener las estadísticas de reportes');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        stats,
        isLoading,
        error,
        fetchStats
    };
};
