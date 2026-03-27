import { Vehicle } from '../src/models/Vehicle';

describe('Vehicle', () => {
  it('should store speed and maxWeight', () => {
    const vehicle = new Vehicle(70, 200);

    expect(vehicle.speed).toBe(70);
    expect(vehicle.maxWeight).toBe(200);
  });

  it('should track availability time starting at 0', () => {
    const vehicle = new Vehicle(70, 200);

    expect(vehicle.availableAt).toBe(0);
  });

  it('should update availability time', () => {
    const vehicle = new Vehicle(70, 200);

    vehicle.setAvailableAt(2.5);

    expect(vehicle.availableAt).toBe(2.5);
  });

  it('should calculate delivery time for a distance', () => {
    const vehicle = new Vehicle(70, 200);

    const deliveryTime = vehicle.calculateDeliveryTime(140);

    expect(deliveryTime).toBe(2); // 140 / 70 = 2
  });

  it('should calculate round trip time (2x delivery time)', () => {
    const vehicle = new Vehicle(70, 200);

    const roundTripTime = vehicle.calculateRoundTripTime(140);

    expect(roundTripTime).toBe(4); // 2 * (140 / 70) = 4
  });
});
