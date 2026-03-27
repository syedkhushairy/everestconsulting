import { Package } from '../models/Package';
import { Offer } from './Offer';

export class OFR003 implements Offer {
  readonly code = 'OFR003';
  readonly discountPercent = 5;

  isApplicable(pkg: Package): boolean {
    const weightInRange = pkg.weight >= 10 && pkg.weight <= 150;
    const distanceInRange = pkg.distance >= 50 && pkg.distance <= 250;
    return weightInRange && distanceInRange;
  }
}
