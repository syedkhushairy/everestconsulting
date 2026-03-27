import { Package } from '../models/Package';

interface ShipmentCandidate {
  packages: Package[];
  totalWeight: number;
  maxDistance: number;
}

export class ShipmentSelector {
  selectOptimalShipment(packages: Package[], maxWeight: number): Package[] {
    if (packages.length === 0) {
      return [];
    }

    const validCandidates = this.generateValidCombinations(packages, maxWeight);

    if (validCandidates.length === 0) {
      return [];
    }

    const optimal = this.findOptimalCandidate(validCandidates);
    return optimal.packages;
  }

  private generateValidCombinations(
    packages: Package[],
    maxWeight: number
  ): ShipmentCandidate[] {
    const candidates: ShipmentCandidate[] = [];
    const n = packages.length;

    for (let mask = 1; mask < (1 << n); mask++) {
      const selected: Package[] = [];
      let totalWeight = 0;
      let maxDistance = 0;

      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) {
          selected.push(packages[i]);
          totalWeight += packages[i].weight;
          maxDistance = Math.max(maxDistance, packages[i].distance);
        }
      }

      if (totalWeight <= maxWeight) {
        candidates.push({ packages: selected, totalWeight, maxDistance });
      }
    }

    return candidates;
  }

  private findOptimalCandidate(candidates: ShipmentCandidate[]): ShipmentCandidate {
    return candidates.reduce((best, current) => {
      if (current.packages.length > best.packages.length) {
        return current;
      }
      if (current.packages.length < best.packages.length) {
        return best;
      }

      if (current.totalWeight > best.totalWeight) {
        return current;
      }
      if (current.totalWeight < best.totalWeight) {
        return best;
      }

      if (current.maxDistance < best.maxDistance) {
        return current;
      }

      return best;
    });
  }
}
