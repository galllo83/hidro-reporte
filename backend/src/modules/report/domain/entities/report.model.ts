export enum ReportType {
  SUPPLY_RESTORED = 'SUPPLY_RESTORED', // Llegó el agua
  LEAK_REPORTED = 'LEAK_REPORTED', // Fuga de agua
  SUPPLY_ENDED = 'SUPPLY_ENDED', // Se fue el agua
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
    public readonly isAttended: boolean = false,
    public readonly address?: {
      street: string;
      neighborhood: string;
      postalCode: string;
    },
  ) { }
}
