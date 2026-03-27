import { Package } from '../src/models/Package';
import { Offer } from '../src/offers/Offer';
import { OFR001 } from '../src/offers/OFR001';
import { OFR002 } from '../src/offers/OFR002';
import { OFR003 } from '../src/offers/OFR003';

describe('Offers', () => {
  describe('OFR001 - 10% discount', () => {
    let offer: Offer;

    beforeEach(() => {
      offer = new OFR001();
    });

    it('has correct code and discount percentage', () => {
      expect(offer.code).toBe('OFR001');
      expect(offer.discountPercent).toBe(10);
    });

    it('applies when distance < 200 AND weight 70-200', () => {
      const pkg = new Package('PKG1', 100, 100, 'OFR001');
      expect(offer.isApplicable(pkg)).toBe(true);
    });

    it('does not apply when distance >= 200', () => {
      const pkg = new Package('PKG1', 100, 200, 'OFR001');
      expect(offer.isApplicable(pkg)).toBe(false);
    });

    it('does not apply when weight < 70', () => {
      const pkg = new Package('PKG1', 69, 100, 'OFR001');
      expect(offer.isApplicable(pkg)).toBe(false);
    });

    it('does not apply when weight > 200', () => {
      const pkg = new Package('PKG1', 201, 100, 'OFR001');
      expect(offer.isApplicable(pkg)).toBe(false);
    });

    it('applies at boundary: weight=70, distance=199', () => {
      const pkg = new Package('PKG1', 70, 199, 'OFR001');
      expect(offer.isApplicable(pkg)).toBe(true);
    });

    it('applies at boundary: weight=200, distance=0', () => {
      const pkg = new Package('PKG1', 200, 0, 'OFR001');
      expect(offer.isApplicable(pkg)).toBe(true);
    });
  });

  describe('OFR002 - 7% discount', () => {
    let offer: Offer;

    beforeEach(() => {
      offer = new OFR002();
    });

    it('has correct code and discount percentage', () => {
      expect(offer.code).toBe('OFR002');
      expect(offer.discountPercent).toBe(7);
    });

    it('applies when distance 50-150 AND weight 100-250', () => {
      const pkg = new Package('PKG1', 150, 100, 'OFR002');
      expect(offer.isApplicable(pkg)).toBe(true);
    });

    it('does not apply when distance < 50', () => {
      const pkg = new Package('PKG1', 150, 49, 'OFR002');
      expect(offer.isApplicable(pkg)).toBe(false);
    });

    it('does not apply when distance > 150', () => {
      const pkg = new Package('PKG1', 150, 151, 'OFR002');
      expect(offer.isApplicable(pkg)).toBe(false);
    });

    it('does not apply when weight < 100', () => {
      const pkg = new Package('PKG1', 99, 100, 'OFR002');
      expect(offer.isApplicable(pkg)).toBe(false);
    });

    it('does not apply when weight > 250', () => {
      const pkg = new Package('PKG1', 251, 100, 'OFR002');
      expect(offer.isApplicable(pkg)).toBe(false);
    });

    it('applies at boundaries: weight=100, distance=50', () => {
      const pkg = new Package('PKG1', 100, 50, 'OFR002');
      expect(offer.isApplicable(pkg)).toBe(true);
    });

    it('applies at boundaries: weight=250, distance=150', () => {
      const pkg = new Package('PKG1', 250, 150, 'OFR002');
      expect(offer.isApplicable(pkg)).toBe(true);
    });
  });

  describe('OFR003 - 5% discount', () => {
    let offer: Offer;

    beforeEach(() => {
      offer = new OFR003();
    });

    it('has correct code and discount percentage', () => {
      expect(offer.code).toBe('OFR003');
      expect(offer.discountPercent).toBe(5);
    });

    it('applies when distance 50-250 AND weight 10-150', () => {
      const pkg = new Package('PKG1', 100, 150, 'OFR003');
      expect(offer.isApplicable(pkg)).toBe(true);
    });

    it('does not apply when distance < 50', () => {
      const pkg = new Package('PKG1', 100, 49, 'OFR003');
      expect(offer.isApplicable(pkg)).toBe(false);
    });

    it('does not apply when distance > 250', () => {
      const pkg = new Package('PKG1', 100, 251, 'OFR003');
      expect(offer.isApplicable(pkg)).toBe(false);
    });

    it('does not apply when weight < 10', () => {
      const pkg = new Package('PKG1', 9, 100, 'OFR003');
      expect(offer.isApplicable(pkg)).toBe(false);
    });

    it('does not apply when weight > 150', () => {
      const pkg = new Package('PKG1', 151, 100, 'OFR003');
      expect(offer.isApplicable(pkg)).toBe(false);
    });

    it('applies at boundaries: weight=10, distance=50', () => {
      const pkg = new Package('PKG1', 10, 50, 'OFR003');
      expect(offer.isApplicable(pkg)).toBe(true);
    });

    it('applies at boundaries: weight=150, distance=250', () => {
      const pkg = new Package('PKG1', 150, 250, 'OFR003');
      expect(offer.isApplicable(pkg)).toBe(true);
    });
  });
});
