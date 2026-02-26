export class WaterServiceModel {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly serviceNumber: string,
    public readonly street: string,
    public readonly neighborhood: string,
    public readonly city: string,
    public readonly postalCode: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
