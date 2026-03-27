import { CostCalculator } from '../src/services/CostCalculator';
import { Package } from '../src/models/Package';

describe('CostCalculator', () => {
  let calculator: CostCalculator;

  beforeEach(() => {
    calculator = new CostCalculator();
  });

  it('calculates cost as base + weight*10 + distance*5', () => {
    const pkg = new Package('PKG1', 5, 5, '');

    const result = calculator.calculate(100, pkg);

    expect(result.deliveryCost).toBe(175); // 100 + 50 + 25
  });

  it('calculates cost for heavier package', () => {
    const pkg = new Package('PKG2', 15, 5, '');

    const result = calculator.calculate(100, pkg);

    expect(result.deliveryCost).toBe(275); // 100 + 150 + 25
  });

  it('calculates cost for longer distance', () => {
    const pkg = new Package('PKG3', 10, 100, '');

    const result = calculator.calculate(100, pkg);

    expect(result.deliveryCost).toBe(700); // 100 + 100 + 500
  });
});
