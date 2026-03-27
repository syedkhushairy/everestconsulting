export class Vehicle {
  private _availableAt: number = 0;

  constructor(
    public readonly speed: number,
    public readonly maxWeight: number
  ) {}

  get availableAt(): number {
    return this._availableAt;
  }

  setAvailableAt(time: number): void {
    this._availableAt = time;
  }

  calculateDeliveryTime(distance: number): number {
    return distance / this.speed;
  }

  calculateRoundTripTime(distance: number): number {
    return 2 * this.calculateDeliveryTime(distance);
  }
}
