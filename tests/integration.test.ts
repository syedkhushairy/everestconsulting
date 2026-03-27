import { InputParser } from '../src/cli/InputParser';
import { OfferRegistry } from '../src/offers/OfferRegistry';
import { OFR001 } from '../src/offers/OFR001';
import { OFR002 } from '../src/offers/OFR002';
import { OFR003 } from '../src/offers/OFR003';
import { OfferService } from '../src/services/OfferService';
import { DeliveryScheduler } from '../src/services/DeliveryScheduler';
import { Vehicle } from '../src/models/Vehicle';

describe('Integration Tests', () => {
  let parser: InputParser;
  let offerRegistry: OfferRegistry;
  let offerService: OfferService;

  beforeEach(() => {
    parser = new InputParser();
    offerRegistry = new OfferRegistry();
    offerRegistry.register(new OFR001());
    offerRegistry.register(new OFR002());
    offerRegistry.register(new OFR003());
    offerService = new OfferService(offerRegistry);
  });

  describe('Problem 1: Cost Calculation', () => {
    it('calculates correct costs for sample input', () => {
      const input = `100 3
PKG1 5 5 OFR001
PKG2 15 5 OFR002
PKG3 10 100 OFR003`;

      const parsedInput = parser.parse(input);
      const results = parsedInput.packages.map((pkg) =>
        offerService.calculateDeliveryCost(parsedInput.baseCost, pkg)
      );

      // PKG1: weight=5 (not in 70-200 for OFR001), no discount
      // Cost = 100 + 50 + 25 = 175
      expect(results[0]).toEqual({
        packageId: 'PKG1',
        discount: 0,
        totalCost: 175,
      });

      // PKG2: weight=15, distance=5 (distance not in 50-150 for OFR002), no discount
      // Cost = 100 + 150 + 25 = 275
      expect(results[1]).toEqual({
        packageId: 'PKG2',
        discount: 0,
        totalCost: 275,
      });

      // PKG3: weight=10 (10-150), distance=100 (50-250) -> OFR003 applies (5%)
      // Cost = 100 + 100 + 500 = 700
      // Discount = 700 * 5% = 35
      // Total = 700 - 35 = 665
      expect(results[2]).toEqual({
        packageId: 'PKG3',
        discount: 35,
        totalCost: 665,
      });
    });
  });

  describe('Problem 2: Delivery Time Estimation', () => {
    it('calculates correct delivery times for sample input', () => {
      const input = `100 5
PKG1 50 30 OFR001
PKG2 75 125 OFR002
PKG3 175 100 OFR003
PKG4 110 60 OFR002
PKG5 155 95 NA
2 70 200`;

      const parsedInput = parser.parse(input);

      expect(parsedInput.packages.length).toBe(5);
      expect(parsedInput.vehicleCount).toBe(2);
      expect(parsedInput.vehicleSpeed).toBe(70);
      expect(parsedInput.vehicleMaxWeight).toBe(200);

      const vehicles = [
        new Vehicle(parsedInput.vehicleSpeed!, parsedInput.vehicleMaxWeight!),
        new Vehicle(parsedInput.vehicleSpeed!, parsedInput.vehicleMaxWeight!),
      ];

      const scheduler = new DeliveryScheduler();
      const deliveryResults = scheduler.scheduleDeliveries(parsedInput.packages, vehicles);

      const getTime = (id: string) =>
        deliveryResults.find((r) => r.packageId === id)?.estimatedDeliveryTime;

      // All packages should be scheduled
      expect(deliveryResults.length).toBe(5);

      // First shipment: PKG2+PKG4 (heaviest valid combo: 185kg)
      expect(getTime('PKG4')).toBe(0.85); // 60/70 truncated
      expect(getTime('PKG2')).toBe(1.78); // 125/70 truncated

      // Second vehicle takes PKG3 (175kg)
      expect(getTime('PKG3')).toBe(1.42); // 100/70 truncated
    });

    it('calculates cost and discount correctly with delivery times', () => {
      const input = `100 5
PKG1 50 30 OFR001
PKG2 75 125 OFR002
PKG3 175 100 OFR003
PKG4 110 60 OFR002
PKG5 155 95 NA
2 70 200`;

      const parsedInput = parser.parse(input);
      const costResults = parsedInput.packages.map((pkg) =>
        offerService.calculateDeliveryCost(parsedInput.baseCost, pkg)
      );

      // PKG1: 50kg, 30km, OFR001 (needs 70-200kg) -> no discount
      // Cost = 100 + 500 + 150 = 750
      expect(costResults[0].totalCost).toBe(750);
      expect(costResults[0].discount).toBe(0);

      // PKG2: 75kg, 125km, OFR002 (needs 100-250kg, 50-150km) -> no discount (weight too low)
      // Cost = 100 + 750 + 625 = 1475
      expect(costResults[1].totalCost).toBe(1475);
      expect(costResults[1].discount).toBe(0);

      // PKG3: 175kg, 100km, OFR003 (needs 10-150kg) -> no discount (weight too high)
      // Cost = 100 + 1750 + 500 = 2350
      expect(costResults[2].totalCost).toBe(2350);
      expect(costResults[2].discount).toBe(0);

      // PKG4: 110kg, 60km, OFR002 (100-250kg, 50-150km) -> 7% discount
      // Cost = 100 + 1100 + 300 = 1500
      // Discount = 1500 * 7% = 105
      // Total = 1500 - 105 = 1395
      expect(costResults[3].discount).toBe(105);
      expect(costResults[3].totalCost).toBe(1395);

      // PKG5: 155kg, 95km, NA -> no discount
      // Cost = 100 + 1550 + 475 = 2125
      expect(costResults[4].totalCost).toBe(2125);
      expect(costResults[4].discount).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles single package', () => {
      const input = `100 1
PKG1 100 100 OFR001`;

      const parsedInput = parser.parse(input);
      const results = parsedInput.packages.map((pkg) =>
        offerService.calculateDeliveryCost(parsedInput.baseCost, pkg)
      );

      // OFR001: 70-200kg, <200km -> applies (10%)
      // Cost = 100 + 1000 + 500 = 1600
      // Discount = 1600 * 10% = 160
      expect(results[0].discount).toBe(160);
      expect(results[0].totalCost).toBe(1440);
    });

    it('handles package with no applicable offer', () => {
      const input = `50 1
HEAVY 300 50 OFR001`;

      const parsedInput = parser.parse(input);
      const results = parsedInput.packages.map((pkg) =>
        offerService.calculateDeliveryCost(parsedInput.baseCost, pkg)
      );

      // 300kg exceeds OFR001's 200kg limit
      // Cost = 50 + 3000 + 250 = 3300
      expect(results[0].discount).toBe(0);
      expect(results[0].totalCost).toBe(3300);
    });
  });
});
