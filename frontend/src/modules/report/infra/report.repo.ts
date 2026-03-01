import { apiClient } from '../../../core/api/api.config';
import type { CreateReportPayload, ReportResponse } from '../domain/report.types';

export const reportRepo = {
    async createReport(payload: CreateReportPayload): Promise<ReportResponse> {
        try {
            const response = await apiClient.post<ReportResponse>('/reports', payload);
            return response.data;
        } catch (error: unknown) {
            console.error('API Error in createReport:', error);
            const typedError = error as { response?: { data?: { message?: string | string[] } } };

            if (typedError.response && typedError.response.data) {
                const msgs = typedError.response.data.message;
                throw new Error(Array.isArray(msgs) ? msgs.join(', ') : msgs);
            }

            throw error;
        }
    },

    async getUserHistory(filters?: { day?: number, month?: number, year?: number }): Promise<ReportResponse[]> {
        const params = new URLSearchParams();
        if (filters?.day) params.append('day', filters.day.toString());
        if (filters?.month) params.append('month', filters.month.toString());
        if (filters?.year) params.append('year', filters.year.toString());

        const query = params.toString() ? `?${params.toString()}` : '';
        const response = await apiClient.get<ReportResponse[]>(`/reports/history${query}`);
        return response.data;
    },

    async getReportStats(): Promise<any[]> {
        const response = await apiClient.get<any[]>('/reports/stats');
        return response.data;
    }
};
