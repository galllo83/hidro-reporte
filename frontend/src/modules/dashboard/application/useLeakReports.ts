import { useState, useCallback } from 'react';
import { apiClient } from '../../../core/api/api.config';
import type { ReportResponse } from '../../report/domain/report.types';

export const useLeakReports = () => {
    const [leakReports, setLeakReports] = useState<ReportResponse[]>([]);
    const [isLoadingLeaks, setIsLoadingLeaks] = useState<boolean>(false);
    const [errorLeaks, setErrorLeaks] = useState<string | null>(null);

    const fetchLeakReports = useCallback(async () => {
        setIsLoadingLeaks(true);
        setErrorLeaks(null);
        try {
            // Reusing getAllReports, filtering in frontend for now to keep it simple,
            // or the backend already returns all.
            const response = await apiClient.get<ReportResponse[]>('/reports');
            const leaks = response.data.filter(r => r.type === 'LEAK_REPORTED');
            setLeakReports(leaks);
        } catch (err: unknown) {
            const typedErr = err as { response?: { data?: { message?: string } } };
            console.error('Error fetching leak reports:', typedErr);
            setErrorLeaks(typedErr.response?.data?.message || 'Error al cargar los reportes de fugas');
        } finally {
            setIsLoadingLeaks(false);
        }
    }, []);

    const markLeakAsAttended = async (id: string) => {
        try {
            const response = await apiClient.patch<ReportResponse>(`/reports/${id}/attend`);
            // Update the local state to reflect the change immediately
            setLeakReports(prev => prev.map(report => report.id === id ? response.data : report));
            return response.data;
        } catch (err: unknown) {
            const typedErr = err as { response?: { data?: { message?: string } } };
            console.error('Error marking leak as attended:', typedErr);
            throw new Error(typedErr.response?.data?.message || 'Error al actualizar el reporte de fuga');
        }
    };

    return {
        leakReports,
        isLoadingLeaks,
        errorLeaks,
        fetchLeakReports,
        markLeakAsAttended
    };
};
