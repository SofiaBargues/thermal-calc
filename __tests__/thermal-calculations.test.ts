import { expect, test, describe } from "vitest";
import { calculateThermalPerformance } from "../utils/thermal-calculations";
import type { RoomData } from "../types/interfaces";

describe("Thermal Calculations", () => {
  // Base room configuration for testing
  const baseRoomData: RoomData = {
    dimensions: {
      length: 5,
      width: 4,
      height: 2.5,
    },
    walls: {
      material: "brick",
      thickness: 0.2,
      insulation: "rockwool",
      insulationThickness: 0.1,
    },
    windows: {
      count: 2,
      width: 1.2,
      height: 1.5,
      type: "double",
    },
    door: {
      width: 0.8,
      height: 2.0,
      type: "wood_insulated",
    },
    roof: {
      material: "concrete",
      thickness: 0.15,
      insulation: "polyurethane",
      insulationThickness: 0.1,
    },
    floor: {
      material: "concrete",
      thickness: 0.15,
      insulation: "polyurethane",
      insulationThickness: 0.1,
    },
  };

  test("perfect isolation - all areas adjacent to heated spaces", () => {
    const perfectIsolationRoom: RoomData = {
      ...baseRoomData,
      adjacentAreas: {
        front: true,
        back: true,
        left: true,
        right: true,
        ceiling: true,
        floor: true,
      },
    };

    const result = calculateThermalPerformance(perfectIsolationRoom);

    // With perfect isolation, there should be minimal heat loss
    expect(result.heatLoss).toBe(0);
    expect(result.uValue).toBe(0);
    expect(result.energyScore).toBe(100); // Perfect score
    expect(result.energyConsumptionPerYear).toBe(0); // No energy consumption
  });

  test("maximum heat loss - no adjacent areas", () => {
    const maxHeatLossRoom: RoomData = {
      ...baseRoomData,
      adjacentAreas: {},
    };

    const result = calculateThermalPerformance(maxHeatLossRoom);

    // Should have significant heat loss with no adjacent areas
    expect(result.heatLoss).toBeGreaterThan(0);
    expect(result.uValue).toBeGreaterThan(0);
    expect(result.energyScore).toBeLessThan(92);
    expect(result.energyConsumptionPerYear).toBeGreaterThan(0);
  });

  test("partial adjacency - front and ceiling adjacent", () => {
    const partialAdjacencyRoom: RoomData = {
      ...baseRoomData,
      adjacentAreas: {
        front: true,
        ceiling: true,
      },
    };

    const noAdjacencyRoom: RoomData = {
      ...baseRoomData,
      adjacentAreas: {},
    };

    const partialResult = calculateThermalPerformance(partialAdjacencyRoom);
    const fullResult = calculateThermalPerformance(noAdjacencyRoom);

    // Partial adjacency should result in less heat loss than no adjacency
    expect(partialResult.heatLoss).toBeLessThan(fullResult.heatLoss);
    expect(partialResult.uValue).toBeLessThan(fullResult.uValue);
    expect(partialResult.energyScore).toBeGreaterThan(fullResult.energyScore);
    expect(partialResult.energyConsumptionPerYear).toBeLessThan(
      fullResult.energyConsumptionPerYear
    );
  });

  test("different insulation materials affect performance", () => {
    const polyurethaneRoom: RoomData = {
      ...baseRoomData,
      walls: {
        ...baseRoomData.walls,
        insulation: "polyurethane", // λ = 0.025 W/mK
        insulationThickness: 0.1,
      },
    };

    const rockwoolRoom: RoomData = {
      ...baseRoomData,
      walls: {
        ...baseRoomData.walls,
        insulation: "rockwool", // λ = 0.04 W/mK
        insulationThickness: 0.1,
      },
    };

    const polyResult = calculateThermalPerformance(polyurethaneRoom);
    const rockResult = calculateThermalPerformance(rockwoolRoom);

    // Polyurethane (lower conductivity) should perform better than rockwool
    expect(polyResult.heatLoss).toBeLessThan(rockResult.heatLoss);
    expect(polyResult.uValue).toBeLessThan(rockResult.uValue);
    expect(polyResult.energyScore).toBeGreaterThan(rockResult.energyScore);
    expect(polyResult.energyConsumptionPerYear).toBeLessThan(
      rockResult.energyConsumptionPerYear
    );
  });

  test("no insulation vs insulated walls", () => {
    const noInsulationRoom: RoomData = {
      ...baseRoomData,
      walls: {
        ...baseRoomData.walls,
        insulation: "none",
        insulationThickness: 0,
      },
    };

    const insulatedRoom: RoomData = {
      ...baseRoomData,
      walls: {
        ...baseRoomData.walls,
        insulation: "rockwool",
        insulationThickness: 0.1,
      },
    };

    const noInsulationResult = calculateThermalPerformance(noInsulationRoom);
    const insulatedResult = calculateThermalPerformance(insulatedRoom);

    // Insulated walls should significantly outperform non-insulated
    expect(insulatedResult.heatLoss).toBeLessThan(noInsulationResult.heatLoss);
    expect(insulatedResult.uValue).toBeLessThan(noInsulationResult.uValue);
    expect(insulatedResult.energyScore).toBeGreaterThan(
      noInsulationResult.energyScore
    );
    expect(insulatedResult.energyConsumptionPerYear).toBeLessThan(
      noInsulationResult.energyConsumptionPerYear
    );
  });

  test("window types affect performance", () => {
    const singleGlazingRoom: RoomData = {
      ...baseRoomData,
      windows: {
        ...baseRoomData.windows,
        type: "single", // U = 5.8 W/m²K
      },
    };

    const tripleGlazingRoom: RoomData = {
      ...baseRoomData,
      windows: {
        ...baseRoomData.windows,
        type: "triple", // U = 1.6 W/m²K
      },
    };

    const singleResult = calculateThermalPerformance(singleGlazingRoom);
    const tripleResult = calculateThermalPerformance(tripleGlazingRoom);

    // Triple glazing should significantly outperform single glazing
    expect(tripleResult.heatLoss).toBeLessThan(singleResult.heatLoss);
    expect(tripleResult.uValue).toBeLessThan(singleResult.uValue);
    expect(tripleResult.energyScore).toBeGreaterThan(singleResult.energyScore);
    expect(tripleResult.energyConsumptionPerYear).toBeLessThan(
      singleResult.energyConsumptionPerYear
    );
  });

  test("room size affects total heat loss but not U-value significantly", () => {
    const smallRoom: RoomData = {
      ...baseRoomData,
      dimensions: {
        length: 3,
        width: 3,
        height: 2.5,
      },
    };

    const largeRoom: RoomData = {
      ...baseRoomData,
      dimensions: {
        length: 8,
        width: 6,
        height: 2.5,
      },
    };

    const smallResult = calculateThermalPerformance(smallRoom);
    const largeResult = calculateThermalPerformance(largeRoom);

    // Larger room should have higher total heat loss
    expect(largeResult.heatLoss).toBeGreaterThan(smallResult.heatLoss);
    expect(largeResult.energyConsumptionPerYear).toBeGreaterThan(
      smallResult.energyConsumptionPerYear
    );

    // But U-values should be relatively similar (construction quality dependent)
    const uValueDifference = Math.abs(largeResult.uValue - smallResult.uValue);
    expect(uValueDifference).toBeLessThan(0.5); // Should be fairly close
  });

  test("energy score boundaries", () => {
    // Test a well-insulated room
    const efficientRoom: RoomData = {
      ...baseRoomData,
      walls: {
        ...baseRoomData.walls,
        insulation: "polyurethane",
        insulationThickness: 0.15,
      },
      roof: {
        ...baseRoomData.roof,
        insulation: "polyurethane",
        insulationThickness: 0.2,
      },
      windows: {
        ...baseRoomData.windows,
        type: "triple",
      },
      door: {
        ...baseRoomData.door,
        type: "composite",
      },
    };

    // Test a poorly insulated room
    const inefficientRoom: RoomData = {
      ...baseRoomData,
      walls: {
        ...baseRoomData.walls,
        insulation: "none",
        insulationThickness: 0,
      },
      roof: {
        ...baseRoomData.roof,
        insulation: "none",
        insulationThickness: 0,
      },
      windows: {
        ...baseRoomData.windows,
        type: "single",
      },
      door: {
        ...baseRoomData.door,
        type: "wood_basic",
      },
    };

    const efficientResult = calculateThermalPerformance(efficientRoom);
    const inefficientResult = calculateThermalPerformance(inefficientRoom);

    // Energy scores should be within valid ranges
    expect(efficientResult.energyScore).toBeGreaterThanOrEqual(1);
    expect(efficientResult.energyScore).toBeLessThanOrEqual(100);
    expect(inefficientResult.energyScore).toBeGreaterThanOrEqual(1);
    expect(inefficientResult.energyScore).toBeLessThanOrEqual(100);

    // Efficient room should score higher than inefficient
    expect(efficientResult.energyScore).toBeGreaterThan(
      inefficientResult.energyScore
    );
    expect(efficientResult.energyConsumptionPerYear).toBeLessThan(
      inefficientResult.energyConsumptionPerYear
    );
  });

  test("edge case - room with no windows or door and adjacent front wall", () => {
    const noOpeningsRoom: RoomData = {
      ...baseRoomData,
      windows: {
        count: 0,
        width: 0,
        height: 0,
        type: "double",
      },
      adjacentAreas: {
        front: true, // Door won't count toward heat loss
      },
    };

    const result = calculateThermalPerformance(noOpeningsRoom);

    // Should still have heat loss through non-adjacent walls and roof
    expect(result.heatLoss).toBeGreaterThan(0);
    expect(result.uValue).toBeGreaterThan(0);
    expect(result.energyConsumptionPerYear).toBeGreaterThan(0);
  });

  test("material not found error handling", () => {
    const invalidMaterialRoom: RoomData = {
      ...baseRoomData,
      walls: {
        ...baseRoomData.walls,
        material: "nonexistent_material",
      },
    };

    // Should throw an error for invalid material
    expect(() => calculateThermalPerformance(invalidMaterialRoom)).toThrow(
      "Material not found"
    );
  });
});
