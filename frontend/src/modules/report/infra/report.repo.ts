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
    }
};
