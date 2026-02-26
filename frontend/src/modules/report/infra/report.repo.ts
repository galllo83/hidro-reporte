import { apiClient } from '../../../core/api/api.config';
import type { CreateReportPayload, ReportResponse } from '../domain/report.types';

export const reportRepo = {
    async createReport(payload: CreateReportPayload): Promise<ReportResponse> {
        try {
            const response = await apiClient.post<ReportResponse>('/reports', payload);
            return response.data;
        } catch (error: any) {
            console.error('Error in API reportRepo.createReport:', error);
            const msg = error.response?.data?.message || 'Error al conectar con el servidor';
            throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
        }
    }
};
