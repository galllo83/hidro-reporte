export enum ReportType {
    SUPPLY_RESTORED = 'SUPPLY_RESTORED', // Llegó el agua
    LEAK_REPORTED = 'LEAK_REPORTED',     // Fuga de agua
}

export class ReportModel {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly zoneId: string | null,
        public readonly type: ReportType,
        public readonly location: {
            lat: number;
            lng: number;
        },
        public readonly createdAt: Date,
    ) { }
}
