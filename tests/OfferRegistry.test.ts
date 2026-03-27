import { OfferRegistry } from '../src/offers/OfferRegistry';
import { OFR001 } from '../src/offers/OFR001';
import { OFR002 } from '../src/offers/OFR002';
import { OFR003 } from '../src/offers/OFR003';

describe('OfferRegistry', () => {
  let registry: OfferRegistry;

  beforeEach(() => {
    registry = new OfferRegistry();
    registry.register(new OFR001());
    registry.register(new OFR002());
    registry.register(new OFR003());
  });

  it('returns offer by code', () => {
    const offer = registry.getByCode('OFR001');
    expect(offer).not.toBeNull();
    expect(offer?.code).toBe('OFR001');
  });

  it('returns OFR002 by code', () => {
    const offer = registry.getByCode('OFR002');
    expect(offer).not.toBeNull();
    expect(offer?.discountPercent).toBe(7);
  });

  it('returns OFR003 by code', () => {
    const offer = registry.getByCode('OFR003');
    expect(offer).not.toBeNull();
    expect(offer?.discountPercent).toBe(5);
  });

  it('returns null for unknown code', () => {
    const offer = registry.getByCode('UNKNOWN');
    expect(offer).toBeNull();
  });

  it('returns null for empty code', () => {
    const offer = registry.getByCode('');
    expect(offer).toBeNull();
  });
});
