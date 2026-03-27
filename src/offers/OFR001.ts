import { Package } from '../models/Package';
import { Offer } from './Offer';

export class OFR001 implements Offer {
  readonly code = 'OFR001';
  readonly discountPercent = 10;

  isApplicable(pkg: Package): boolean {
    const weightInRange = pkg.weight >= 70 && pkg.weight <= 200;
    const distanceInRange = pkg.distance < 200;
    return weightInRange && distanceInRange;
  }
}
