import { OfferService, DeliveryCostResult } from '../src/services/OfferService';
import { OfferRegistry } from '../src/offers/OfferRegistry';
import { OFR001 } from '../src/offers/OFR001';
import { OFR002 } from '../src/offers/OFR002';
import { OFR003 } from '../src/offers/OFR003';
import { Package } from '../src/models/Package';

describe('OfferService', () => {
  let service: OfferService;
  let registry: OfferRegistry;

  beforeEach(() => {
    registry = new OfferRegistry();
    registry.register(new OFR001());
    registry.register(new OFR002());
    registry.register(new OFR003());
    service = new OfferService(registry);
  });

  describe('calculateDeliveryCost', () => {
    it('calculates cost without discount when offer criteria not met', () => {
      // PKG1: weight=5, distance=5, OFR001 requires weight 70-200
      const pkg = new Package('PKG1', 5, 5, 'OFR001');
      const result = service.calculateDeliveryCost(100, pkg);

      expect(result.packageId).toBe('PKG1');
      expect(result.discount).toBe(0);
      expect(result.totalCost).toBe(175); // 100 + 50 + 25
    });

    it('calculates cost without discount when offer code is empty', () => {
      const pkg = new Package('PKG2', 15, 5, '');
      const result = service.calculateDeliveryCost(100, pkg);

      expect(result.packageId).toBe('PKG2');
      expect(result.discount).toBe(0);
      expect(result.totalCost).toBe(275); // 100 + 150 + 25
    });

    it('calculates cost without discount when offer code is unknown', () => {
      const pkg = new Package('PKG1', 15, 5, 'INVALID');
      const result = service.calculateDeliveryCost(100, pkg);

      expect(result.discount).toBe(0);
      expect(result.totalCost).toBe(275);
    });

    it('applies 5% discount when OFR003 criteria met', () => {
      // PKG3: weight=10 (10-150), distance=100 (50-250) -> OFR003 applies
      const pkg = new Package('PKG3', 10, 100, 'OFR003');
      const result = service.calculateDeliveryCost(100, pkg);

      // Cost = 100 + (10*10) + (100*5) = 100 + 100 + 500 = 700
      // Discount = 700 * 5% = 35
      // Total = 700 - 35 = 665
      expect(result.packageId).toBe('PKG3');
      expect(result.discount).toBe(35);
      expect(result.totalCost).toBe(665);
    });

    it('applies 10% discount when OFR001 criteria met', () => {
      // weight=100 (70-200), distance=50 (<200) -> OFR001 applies
      const pkg = new Package('PKG1', 100, 50, 'OFR001');
      const result = service.calculateDeliveryCost(100, pkg);

      // Cost = 100 + (100*10) + (50*5) = 100 + 1000 + 250 = 1350
      // Discount = 1350 * 10% = 135
      // Total = 1350 - 135 = 1215
      expect(result.discount).toBe(135);
      expect(result.totalCost).toBe(1215);
    });

    it('applies 7% discount when OFR002 criteria met', () => {
      // weight=150 (100-250), distance=100 (50-150) -> OFR002 applies
      const pkg = new Package('PKG1', 150, 100, 'OFR002');
      const result = service.calculateDeliveryCost(100, pkg);

      // Cost = 100 + (150*10) + (100*5) = 100 + 1500 + 500 = 2100
      // Discount = 2100 * 7% = 147
      // Total = 2100 - 147 = 1953
      expect(result.discount).toBe(147);
      expect(result.totalCost).toBe(1953);
    });
  });

  describe('Sample test cases from problem statement', () => {
    it('PKG1: 5kg, 5km, OFR001 -> 0 discount, 175 total', () => {
      const pkg = new Package('PKG1', 5, 5, 'OFR001');
      const result = service.calculateDeliveryCost(100, pkg);

      expect(result.discount).toBe(0);
      expect(result.totalCost).toBe(175);
    });

    it('PKG2: 15kg, 5km, OFR002 -> 0 discount, 275 total', () => {
      const pkg = new Package('PKG2', 15, 5, 'OFR002');
      const result = service.calculateDeliveryCost(100, pkg);

      expect(result.discount).toBe(0);
      expect(result.totalCost).toBe(275);
    });

    it('PKG3: 10kg, 100km, OFR003 -> 35 discount, 665 total', () => {
      const pkg = new Package('PKG3', 10, 100, 'OFR003');
      const result = service.calculateDeliveryCost(100, pkg);

      expect(result.discount).toBe(35);
      expect(result.totalCost).toBe(665);
    });
  });
});
