import { InputParser } from './InputParser';
import { OfferRegistry } from '../offers/OfferRegistry';
import { OFR001 } from '../offers/OFR001';
import { OFR002 } from '../offers/OFR002';
import { OFR003 } from '../offers/OFR003';
import { OfferService } from '../services/OfferService';
import { DeliveryScheduler } from '../services/DeliveryScheduler';
import { Vehicle } from '../models/Vehicle';

export interface CourierResult {
  packageId: string;
  discount: number;
  totalCost: number;
  deliveryTime?: number;
}

export class CourierApp {
  private readonly parser: InputParser;
  private readonly offerRegistry: OfferRegistry;
  private readonly offerService: OfferService;
  private readonly scheduler: DeliveryScheduler;

  constructor() {
    this.parser = new InputParser();
    this.offerRegistry = this.createOfferRegistry();
    this.offerService = new OfferService(this.offerRegistry);
    this.scheduler = new DeliveryScheduler();
  }

  private createOfferRegistry(): OfferRegistry {
    const registry = new OfferRegistry();
    registry.register(new OFR001());
    registry.register(new OFR002());
    registry.register(new OFR003());
    return registry;
  }

  process(input: string): CourierResult[] {
    const parsedInput = this.parser.parse(input);

    if (parsedInput.packages.length === 0) {
      return [];
    }

    const costResults = parsedInput.packages.map((pkg) =>
      this.offerService.calculateDeliveryCost(parsedInput.baseCost, pkg)
    );

    const hasVehicleInfo =
      parsedInput.vehicleCount !== undefined &&
      parsedInput.vehicleSpeed !== undefined &&
      parsedInput.vehicleMaxWeight !== undefined;

    if (!hasVehicleInfo) {
      return costResults.map((r) => ({
        packageId: r.packageId,
        discount: r.discount,
        totalCost: r.totalCost,
      }));
    }

    const vehicles = this.createVehicles(
      parsedInput.vehicleCount!,
      parsedInput.vehicleSpeed!,
      parsedInput.vehicleMaxWeight!
    );

    const deliveryResults = this.scheduler.scheduleDeliveries(
      parsedInput.packages,
      vehicles
    );

    const deliveryTimeMap = new Map(
      deliveryResults.map((r) => [r.packageId, r.estimatedDeliveryTime])
    );

    return costResults.map((r) => ({
      packageId: r.packageId,
      discount: r.discount,
      totalCost: r.totalCost,
      deliveryTime: deliveryTimeMap.get(r.packageId),
    }));
  }

  private createVehicles(count: number, speed: number, maxWeight: number): Vehicle[] {
    const vehicles: Vehicle[] = [];
    for (let i = 0; i < count; i++) {
      vehicles.push(new Vehicle(speed, maxWeight));
    }
    return vehicles;
  }

  formatOutput(result: CourierResult): string {
    if (result.deliveryTime !== undefined) {
      return `${result.packageId} ${result.discount} ${result.totalCost} ${result.deliveryTime.toFixed(2)}`;
    }
    return `${result.packageId} ${result.discount} ${result.totalCost}`;
  }

  processAndFormat(input: string): string[] {
    const results = this.process(input);
    return results.map((r) => this.formatOutput(r));
  }
}
