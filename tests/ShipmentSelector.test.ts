import { ShipmentSelector } from '../src/services/ShipmentSelector';
import { Package } from '../src/models/Package';

describe('ShipmentSelector', () => {
  let selector: ShipmentSelector;

  beforeEach(() => {
    selector = new ShipmentSelector();
  });

  describe('selectOptimalShipment', () => {
    it('selects all packages when total weight is within limit', () => {
      const packages = [
        new Package('PKG1', 50, 30, ''),
        new Package('PKG2', 75, 125, ''),
      ];

      const result = selector.selectOptimalShipment(packages, 200);

      expect(result.map(p => p.id).sort()).toEqual(['PKG1', 'PKG2']);
    });

    it('selects max packages that fit weight limit', () => {
      const packages = [
        new Package('PKG1', 50, 30, ''),
        new Package('PKG2', 75, 125, ''),
        new Package('PKG3', 175, 100, ''),
      ];

      // PKG1(50) + PKG2(75) = 125 fits
      // PKG1(50) + PKG3(175) = 225 exceeds 200
      // PKG2(75) + PKG3(175) = 250 exceeds 200
      // Best is PKG1 + PKG2 (2 packages)
      const result = selector.selectOptimalShipment(packages, 200);

      expect(result.length).toBe(2);
      expect(result.map(p => p.id).sort()).toEqual(['PKG1', 'PKG2']);
    });

    it('prefers heavier shipment when same package count', () => {
      const packages = [
        new Package('PKG1', 50, 100, ''),
        new Package('PKG2', 100, 100, ''),
        new Package('PKG3', 150, 100, ''),
      ];

      // All single packages are valid, but combinations:
      // PKG1 + PKG2 = 150
      // PKG1 + PKG3 = 200
      // PKG2 + PKG3 = 250 exceeds
      // PKG1 + PKG3 is heaviest with 2 packages
      const result = selector.selectOptimalShipment(packages, 200);

      expect(result.length).toBe(2);
      expect(result.map(p => p.id).sort()).toEqual(['PKG1', 'PKG3']);
    });

    it('prefers shorter max distance when same weight', () => {
      const packages = [
        new Package('PKG1', 100, 50, ''),
        new Package('PKG2', 100, 200, ''),
      ];

      // Both have same weight, but PKG1 has shorter distance
      // When we can only take one, prefer the one with shorter distance
      const result = selector.selectOptimalShipment(packages, 100);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('PKG1');
    });

    it('returns empty array when no packages provided', () => {
      const result = selector.selectOptimalShipment([], 200);

      expect(result).toEqual([]);
    });

    it('returns empty when all packages exceed weight limit', () => {
      const packages = [
        new Package('PKG1', 250, 100, ''),
        new Package('PKG2', 300, 100, ''),
      ];

      const result = selector.selectOptimalShipment(packages, 200);

      expect(result).toEqual([]);
    });

    it('handles sample case from problem statement', () => {
      // PKG1 50kg 30km, PKG2 75kg 125km, PKG3 175kg 100km, PKG4 110kg 60km, PKG5 155kg 95km
      // maxWeight = 200
      const packages = [
        new Package('PKG1', 50, 30, ''),
        new Package('PKG2', 75, 125, ''),
        new Package('PKG3', 175, 100, ''),
        new Package('PKG4', 110, 60, ''),
        new Package('PKG5', 155, 95, ''),
      ];

      const result = selector.selectOptimalShipment(packages, 200);

      // Max packages that fit: PKG1+PKG4=160, PKG1+PKG2=125, PKG2+PKG4=185
      // PKG2+PKG4 has 2 packages and weight 185 (heaviest 2-package combo under 200)
      // But also check PKG1+PKG5=205 exceeds, PKG1+PKG3=225 exceeds
      // Valid 2-package combos: PKG1+PKG2(125), PKG1+PKG4(160), PKG2+PKG4(185)
      // PKG2+PKG4 is heaviest
      expect(result.length).toBe(2);
      expect(result.map(p => p.id).sort()).toEqual(['PKG2', 'PKG4']);
    });
  });
});
