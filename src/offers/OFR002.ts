import { Package } from '../models/Package';
import { Offer } from './Offer';

export class OFR002 implements Offer {
  readonly code = 'OFR002';
  readonly discountPercent = 7;

  isApplicable(pkg: Package): boolean {
    const weightInRange = pkg.weight >= 100 && pkg.weight <= 250;
    const distanceInRange = pkg.distance >= 50 && pkg.distance <= 150;
    return weightInRange && distanceInRange;
  }
}
