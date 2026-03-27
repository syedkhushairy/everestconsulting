import { Package } from '../models/Package';
import { OfferRegistry } from '../offers/OfferRegistry';
import { CostCalculator } from './CostCalculator';

export interface DeliveryCostResult {
  packageId: string;
  discount: number;
  totalCost: number;
}

export class OfferService {
  private costCalculator: CostCalculator;

  constructor(private offerRegistry: OfferRegistry) {
    this.costCalculator = new CostCalculator();
  }

  calculateDeliveryCost(baseCost: number, pkg: Package): DeliveryCostResult {
    const { deliveryCost } = this.costCalculator.calculate(baseCost, pkg);

    let discount = 0;
    const offer = this.offerRegistry.getByCode(pkg.offerCode);

    if (offer && offer.isApplicable(pkg)) {
      discount = Math.floor(deliveryCost * offer.discountPercent / 100);
    }

    return {
      packageId: pkg.id,
      discount,
      totalCost: deliveryCost - discount,
    };
  }
}
