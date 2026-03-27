import { Package } from '../src/models/Package';

describe('Package', () => {
  it('should store id, weight, distance, and offerCode', () => {
    const pkg = new Package('PKG1', 5, 10, 'OFR001');

    expect(pkg.id).toBe('PKG1');
    expect(pkg.weight).toBe(5);
    expect(pkg.distance).toBe(10);
    expect(pkg.offerCode).toBe('OFR001');
  });

  it('should allow empty offerCode', () => {
    const pkg = new Package('PKG2', 15, 5, '');

    expect(pkg.id).toBe('PKG2');
    expect(pkg.offerCode).toBe('');
  });
});
