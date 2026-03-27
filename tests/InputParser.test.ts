import { InputParser, ParsedInput } from '../src/cli/InputParser';

describe('InputParser', () => {
  let parser: InputParser;

  beforeEach(() => {
    parser = new InputParser();
  });

  describe('parse', () => {
    it('parses base cost and package count from first line', () => {
      const input = '100 3';
      const result = parser.parse(input);

      expect(result.baseCost).toBe(100);
      expect(result.packages.length).toBe(0);
    });

    it('parses single package', () => {
      const input = `100 1
PKG1 5 5 OFR001`;
      const result = parser.parse(input);

      expect(result.packages.length).toBe(1);
      expect(result.packages[0].id).toBe('PKG1');
      expect(result.packages[0].weight).toBe(5);
      expect(result.packages[0].distance).toBe(5);
      expect(result.packages[0].offerCode).toBe('OFR001');
    });

    it('parses multiple packages', () => {
      const input = `100 3
PKG1 5 5 OFR001
PKG2 15 5 OFR002
PKG3 10 100 OFR003`;
      const result = parser.parse(input);

      expect(result.packages.length).toBe(3);
      expect(result.packages[0].id).toBe('PKG1');
      expect(result.packages[1].id).toBe('PKG2');
      expect(result.packages[2].id).toBe('PKG3');
    });

    it('handles package with no offer code', () => {
      const input = `100 1
PKG1 5 5`;
      const result = parser.parse(input);

      expect(result.packages[0].offerCode).toBe('');
    });

    it('parses vehicle info when provided', () => {
      const input = `100 5
PKG1 50 30 OFR001
PKG2 75 125 OFR002
PKG3 175 100 OFR003
PKG4 110 60 OFR002
PKG5 155 95 NA
2 70 200`;
      const result = parser.parse(input);

      expect(result.vehicleCount).toBe(2);
      expect(result.vehicleSpeed).toBe(70);
      expect(result.vehicleMaxWeight).toBe(200);
    });

    it('handles NA as empty offer code', () => {
      const input = `100 1
PKG1 5 5 NA`;
      const result = parser.parse(input);

      expect(result.packages[0].offerCode).toBe('');
    });
  });
});
