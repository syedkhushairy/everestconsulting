import { CourierApp, CourierResult } from '../src/cli/CourierApp';

describe('CourierApp', () => {
  let app: CourierApp;

  beforeEach(() => {
    app = new CourierApp();
  });

  describe('process', () => {
    it('calculates cost for single package without offer', () => {
      const input = `100 1
PKG1 5 5 OFR001`;

      const results = app.process(input);

      expect(results).toHaveLength(1);
      expect(results[0].packageId).toBe('PKG1');
      expect(results[0].discount).toBe(0);
      expect(results[0].totalCost).toBe(175);
      expect(results[0].deliveryTime).toBeUndefined();
    });

    it('calculates cost for multiple packages with discounts', () => {
      const input = `100 3
PKG1 5 5 OFR001
PKG2 15 5 OFR002
PKG3 10 100 OFR003`;

      const results = app.process(input);

      expect(results).toHaveLength(3);
      expect(results[0]).toEqual({ packageId: 'PKG1', discount: 0, totalCost: 175 });
      expect(results[1]).toEqual({ packageId: 'PKG2', discount: 0, totalCost: 275 });
      expect(results[2]).toEqual({ packageId: 'PKG3', discount: 35, totalCost: 665 });
    });

    it('calculates delivery times when vehicle info provided', () => {
      const input = `100 2
PKG1 50 30 OFR001
PKG2 75 125 OFR002
2 70 200`;

      const results = app.process(input);

      expect(results).toHaveLength(2);
      expect(results[0].deliveryTime).toBeDefined();
      expect(results[1].deliveryTime).toBeDefined();
    });

    it('returns empty array for empty input', () => {
      const input = `100 0`;

      const results = app.process(input);

      expect(results).toEqual([]);
    });
  });

  describe('formatOutput', () => {
    it('formats result without delivery time', () => {
      const result: CourierResult = {
        packageId: 'PKG1',
        discount: 0,
        totalCost: 175,
      };

      const output = app.formatOutput(result);

      expect(output).toBe('PKG1 0 175');
    });

    it('formats result with delivery time', () => {
      const result: CourierResult = {
        packageId: 'PKG1',
        discount: 35,
        totalCost: 665,
        deliveryTime: 1.78,
      };

      const output = app.formatOutput(result);

      expect(output).toBe('PKG1 35 665 1.78');
    });
  });

  describe('processAndFormat', () => {
    it('returns formatted output lines', () => {
      const input = `100 3
PKG1 5 5 OFR001
PKG2 15 5 OFR002
PKG3 10 100 OFR003`;

      const output = app.processAndFormat(input);

      expect(output).toEqual([
        'PKG1 0 175',
        'PKG2 0 275',
        'PKG3 35 665',
      ]);
    });
  });
});
