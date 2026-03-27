import { Package } from '../models/Package';

export interface ParsedInput {
  baseCost: number;
  packages: Package[];
  vehicleCount?: number;
  vehicleSpeed?: number;
  vehicleMaxWeight?: number;
}

export class InputParser {
  parse(input: string): ParsedInput {
    const lines = input.trim().split('\n');
    const [baseCost, packageCount] = lines[0].split(' ').map(Number);

    const packages: Package[] = [];
    let vehicleCount: number | undefined;
    let vehicleSpeed: number | undefined;
    let vehicleMaxWeight: number | undefined;

    for (let i = 1; i <= packageCount && i < lines.length; i++) {
      const parts = lines[i].trim().split(/\s+/);
      const id = parts[0];
      const weight = Number(parts[1]);
      const distance = Number(parts[2]);
      let offerCode = parts[3] || '';

      if (offerCode === 'NA') {
        offerCode = '';
      }

      packages.push(new Package(id, weight, distance, offerCode));
    }

    const vehicleLineIndex = packageCount + 1;
    if (vehicleLineIndex < lines.length) {
      const vehicleParts = lines[vehicleLineIndex].trim().split(/\s+/).map(Number);
      if (vehicleParts.length === 3) {
        vehicleCount = vehicleParts[0];
        vehicleSpeed = vehicleParts[1];
        vehicleMaxWeight = vehicleParts[2];
      }
    }

    return {
      baseCost,
      packages,
      vehicleCount,
      vehicleSpeed,
      vehicleMaxWeight,
    };
  }
}
