import { Package } from '../models/Package';

export interface CostResult {
  deliveryCost: number;
}

export class CostCalculator {
  calculate(baseCost: number, pkg: Package): CostResult {
    const deliveryCost = baseCost + (pkg.weight * 10) + (pkg.distance * 5);
    return { deliveryCost };
  }
}
