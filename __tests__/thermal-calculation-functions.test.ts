import { expect, test, describe } from "vitest";
import {
  calculateThermalResistance,
  calculateFabricHeatLoss,
  calculateUValue,
  adjustWindowUValueForCurtains,
  calculateFabricHeatLossElements,
  calculateThermalBridgingLoss,
  calculateEnergyScoreFromConsumption,
} from "../utils/thermal-calculation-functions";

import {
  RSI_INTERNAL,
  RSO_EXTERNAL,
  THERMAL_BRIDGE_FACTORS,
} from "../utils/calculation-constants";

describe("Thermal Calculation Functions", () => {
  test("calculateThermalResistance - known values", () => {
    // Test Case: 200mm solid brick wall + 100mm rockwool insulation
    // R_total = Rsi + d1/λ1 + d2/λ2 + Rso
    // R_total = 0.13 + (0.2/0.87) + (0.1/0.04) + 0.04
    // R_total = 0.13 + 0.230 + 2.5 + 0.04 = 2.9 m²K/W

    const result = calculateThermalResistance({
      baseThickness: 0.2,
      baseConductivity: 0.87,
      rsiInternal: RSI_INTERNAL,
      rsoExternal: RSO_EXTERNAL,
      insulationThickness: 0.1,
      insulationConductivity: 0.04,
    });

    const expectedR = 0.13 + 0.2 / 0.87 + 0.1 / 0.04 + 0.04;
    expect(result).toBeCloseTo(expectedR, 3);
    expect(result).toBeCloseTo(2.9, 1);
  });

  test("calculateThermalResistance - without insulation", () => {
    // Test Case: 200mm solid brick wall only
    const result = calculateThermalResistance({
      baseThickness: 0.2,
      baseConductivity: 0.87,
      rsiInternal: RSI_INTERNAL,
      rsoExternal: RSO_EXTERNAL,
    });

    const expectedR = 0.13 + 0.2 / 0.87 + 0.04;
    expect(result).toBeCloseTo(expectedR, 3);
  });

  test("calculateUValue - from thermal resistance", () => {
    // U = 1/R
    const thermalResistance = 2.9;
    const result = calculateUValue(thermalResistance);

    expect(result).toBeCloseTo(0.345, 3);
  });

  test("adjustWindowUValueForCurtains", () => {
    // U_adjusted = 1/(1/U_original + 0.04)
    const originalUValues = [5.8, 2.8, 1.6]; // Single, double, triple glazing

    originalUValues.forEach((originalU) => {
      const adjustedU = adjustWindowUValueForCurtains(originalU);

      // Adjusted U-value should always be lower (better) than original
      expect(adjustedU).toBeLessThan(originalU);

      // Check specific calculation for double glazing (2.8 W/m²K)
      if (originalU === 2.8) {
        const expected = 1 / (1 / 2.8 + 0.04); // = 1 / (0.357 + 0.04) = 1 / 0.397 = 2.52
        expect(adjustedU).toBeCloseTo(expected, 2);
      }
    });
  });

  test("calculateFabricHeatLossElements - area weighted U-values", () => {
    // Test ΣAi × Ui calculation
    const elements = [
      { area: 40, uValue: 0.3 }, // Walls: 40m² × 0.3 W/m²K = 12 W/K
      { area: 4, uValue: 2.8 }, // Windows: 4m² × 2.8 W/m²K = 11.2 W/K
      { area: 2, uValue: 2.0 }, // Door: 2m² × 2.0 W/m²K = 4 W/K
      { area: 20, uValue: 0.25 }, // Roof: 20m² × 0.25 W/m²K = 5 W/K
    ];

    const result = calculateFabricHeatLossElements(elements);

    // 12 + 11.2 + 4 + 5 = 32.2 W/K
    expect(result).toBeCloseTo(32.2, 1);
  });

  test("calculateThermalBridgingLoss", () => {
    // HTB = y × A_ext
    const externalArea = 100;

    const pre2002Loss = calculateThermalBridgingLoss({
      totalExternalArea: externalArea,
      thermalBridgeFactor: THERMAL_BRIDGE_FACTORS.pre2002,
    });

    const year2002Loss = calculateThermalBridgingLoss({
      totalExternalArea: externalArea,
      thermalBridgeFactor: THERMAL_BRIDGE_FACTORS.year2002,
    });

    const post2006Loss = calculateThermalBridgingLoss({
      totalExternalArea: externalArea,
      thermalBridgeFactor: THERMAL_BRIDGE_FACTORS.post2006,
    });

    expect(pre2002Loss).toBe(15); // 0.15 × 100
    expect(year2002Loss).toBe(11); // 0.11 × 100
    expect(post2006Loss).toBe(8); // 0.08 × 100

    // Newer construction should have lower thermal bridging
    expect(post2006Loss).toBeLessThan(year2002Loss);
    expect(year2002Loss).toBeLessThan(pre2002Loss);
  });

  test("calculateFabricHeatLoss - total coefficient", () => {
    // HF = (ΣAi × Ui) + HTB
    const fabricHeatLossElements = 32.2; // W/K
    const thermalBridgingLoss = 8; // W/K

    const result = calculateFabricHeatLoss(
      fabricHeatLossElements,
      thermalBridgingLoss
    );

    expect(result).toBeCloseTo(40.2, 1);
  });

  test("calculateEnergyScoreFromConsumption - EPC bands", () => {
    // Test energy score conversion for official UK EPC bands
    const testCases = [
      { energyPerM2: 30, expectedScoreRange: [92, 100] }, // A rating: <50 kWh/m²/year
      { energyPerM2: 70, expectedScoreRange: [81, 91] }, // B rating: 50-90 kWh/m²/year
      { energyPerM2: 120, expectedScoreRange: [69, 80] }, // C rating: 91-150 kWh/m²/year
      { energyPerM2: 190, expectedScoreRange: [55, 68] }, // D rating: 151-230 kWh/m²/year
      { energyPerM2: 280, expectedScoreRange: [39, 54] }, // E rating: 231-330 kWh/m²/year
      { energyPerM2: 390, expectedScoreRange: [21, 38] }, // F rating: 331-450 kWh/m²/year
      { energyPerM2: 500, expectedScoreRange: [1, 20] }, // G rating: >450 kWh/m²/year
    ];

    testCases.forEach(({ energyPerM2, expectedScoreRange }) => {
      const score = calculateEnergyScoreFromConsumption(energyPerM2);

      expect(score).toBeGreaterThanOrEqual(expectedScoreRange[0]);
      expect(score).toBeLessThanOrEqual(expectedScoreRange[1]);
    });
  });
});
