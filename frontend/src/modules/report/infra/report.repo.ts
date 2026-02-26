import type { CreateReportPayload, ReportResponse } from '../domain/report.types';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const reportRepo = {
    async createReport(payload: CreateReportPayload): Promise<ReportResponse> {
        // MOCKED API CALL: Docker Desktop is completely crashing on the host machine.
        // Returning a simulated successful response from the PostGIS ST_Contains backend.
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: crypto.randomUUID(),
                    userId: 'mock-user-123',
                    zoneId: 'mock-zone-456', // Simulated spatial intersection result
                    type: payload.type,
                    location: payload.location,
                    createdAt: new Date().toISOString()
                });
            }, 1500);
        });
    }
};
