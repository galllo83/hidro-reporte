export type ReportType = 'SUPPLY_RESTORED' | 'LEAK_REPORTED';

export interface LocationData {
    lat: number;
    lng: number;
}

export interface CreateReportPayload {
    type: ReportType;
    location: LocationData;
}

export interface ReportResponse {
    id: string;
    userId: string;
    zoneId: string | null;
    type: ReportType;
    location: LocationData;
    createdAt: string;
}
