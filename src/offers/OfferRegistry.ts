import { Offer } from './Offer';

export class OfferRegistry {
  private offers: Map<string, Offer> = new Map();

  register(offer: Offer): void {
    this.offers.set(offer.code, offer);
  }

  getByCode(code: string): Offer | null {
    return this.offers.get(code) ?? null;
  }
}
