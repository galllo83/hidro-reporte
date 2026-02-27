export type ReportType = 'SUPPLY_RESTORED' | 'LEAK_REPORTED' | 'SUPPLY_ENDED';

export interface LocationData {
    lat: number;
    lng: number;
}

export interface AddressComponents {
    street?: string;
    neighborhood?: string;
    postalCode?: string;
}

export interface CreateReportPayload {
    type: ReportType;
    location: LocationData;
    address?: AddressComponents;
}

export interface ReportResponse {
    id: string;
    userId: string;
    zoneId: string | null;
    type: ReportType;
    location: LocationData;
    address?: AddressComponents;
    isAttended?: boolean;
    createdAt: string;
}
