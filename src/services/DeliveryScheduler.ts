import { Package } from '../models/Package';
import { Vehicle } from '../models/Vehicle';
import { ShipmentSelector } from './ShipmentSelector';

export interface DeliveryResult {
  packageId: string;
  estimatedDeliveryTime: number;
}

interface VehicleState {
  vehicle: Vehicle;
  availableAt: number;
}

export class DeliveryScheduler {
  private shipmentSelector: ShipmentSelector;

  constructor() {
    this.shipmentSelector = new ShipmentSelector();
  }

  scheduleDeliveries(packages: Package[], vehicles: Vehicle[]): DeliveryResult[] {
    const results: DeliveryResult[] = [];
    const remainingPackages = [...packages];
    const vehicleStates: VehicleState[] = vehicles.map(v => ({
      vehicle: v,
      availableAt: 0,
    }));

    while (remainingPackages.length > 0) {
      vehicleStates.sort((a, b) => a.availableAt - b.availableAt);
      const currentVehicle = vehicleStates[0];
      const startTime = currentVehicle.availableAt;

      const shipment = this.shipmentSelector.selectOptimalShipment(
        remainingPackages,
        currentVehicle.vehicle.maxWeight
      );

      if (shipment.length === 0) {
        break;
      }

      const maxDistance = Math.max(...shipment.map(p => p.distance));

      for (const pkg of shipment) {
        const deliveryTime = pkg.distance / currentVehicle.vehicle.speed;
        results.push({
          packageId: pkg.id,
          estimatedDeliveryTime: this.roundToTwoDecimals(startTime + deliveryTime),
        });

        const idx = remainingPackages.findIndex(p => p.id === pkg.id);
        if (idx !== -1) {
          remainingPackages.splice(idx, 1);
        }
      }

      const maxDeliveryTime = this.roundToTwoDecimals(maxDistance / currentVehicle.vehicle.speed);
      const roundTripTime = maxDeliveryTime * 2;
      currentVehicle.availableAt = startTime + roundTripTime;
    }

    return results;
  }

  private roundToTwoDecimals(value: number): number {
    return Math.floor(value * 100) / 100;
  }
}
