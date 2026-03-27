# Courier Service CLI

A command-line application for calculating delivery costs and estimating delivery times for a courier service.

## Features

- Calculate delivery costs based on weight and distance
- Apply discount offers based on package criteria
- Schedule deliveries across multiple vehicles
- Estimate delivery times with optimal shipment selection

## Quick Start

```bash
npm install
npm start
```

## Usage

### Input Format

**Problem 1: Cost Calculation**
```
<base_cost> <number_of_packages>
<pkg_id> <weight_kg> <distance_km> <offer_code>
...
```

**Problem 2: With Delivery Time**
```
<base_cost> <number_of_packages>
<pkg_id> <weight_kg> <distance_km> <offer_code>
...
<number_of_vehicles> <speed_kmph> <max_weight_kg>
```

### Example

```bash
echo "100 3
PKG1 5 5 OFR001
PKG2 15 5 OFR002
PKG3 10 100 OFR003" | npm start
```

Output:
```
PKG1 0 175
PKG2 0 275
PKG3 35 665
```

## Available Offers

| Code   | Discount | Weight Range | Distance Range |
|--------|----------|--------------|----------------|
| OFR001 | 10%      | 70-200 kg    | < 200 km       |
| OFR002 | 7%       | 100-250 kg   | 50-150 km      |
| OFR003 | 5%       | 10-150 kg    | 50-250 km      |

## Cost Formula

```
Delivery Cost = Base Cost + (Weight × 10) + (Distance × 5)
```

## Project Structure

```
src/
├── models/           # Data structures (Package, Vehicle)
├── services/         # Business logic
│   ├── CostCalculator.ts
│   ├── OfferService.ts
│   ├── ShipmentSelector.ts
│   └── DeliveryScheduler.ts
├── offers/           # Discount offer implementations
├── cli/              # Input parsing and CLI handling
└── index.ts          # Entry point

tests/                # Unit and integration tests
```

## Running Tests

```bash
npm test
```

## Technologies

- TypeScript
- Jest (Testing)
- Node.js
