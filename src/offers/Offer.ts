import { Package } from '../models/Package';

export interface Offer {
  readonly code: string;
  readonly discountPercent: number;
  isApplicable(pkg: Package): boolean;
}
