/**
 * Energy Performance Score Calculation
 *
 * NOTE: This is a simplified approximation of UK EPC ratings. Specially focused on "Heat Loss".
 * For official EPC certification, use SAP 10.2 methodology with:
 * - Regulated energy use only (heating, DHW, lighting, ventilation)
 * - Official SAP fuel cost factors
 * - Standard occupancy patterns
 * - Regional climate data
 * - Approved calculation software
 *
 * This calculation provides indicative ratings for comparison purposes.
 *
 * Reference: https://www.gov.uk/guidance/standard-assessment-procedure
 * BRE Domestic Energy Model (BREDEM): https://files.bregroup.com/bre-co-uk-file-library-copy/filelibrary/bredem/BREDEM-2012-specification.pdf
 *
 */

import type { RoomData, Results } from "@/types/interfaces";
import {
  wallMaterials,
  roofMaterials,
  floorMaterials,
  insulationMaterials,
  windowTypes,
  doorTypes,
} from "@/data/materials";
import {
  calculateThermalResistance,
  calculateFabricHeatLoss as calculateTotalFabricHeatLoss,
  calculateUValue,
  adjustWindowUValueForCurtains,
  calculateFabricHeatLossElements,
  calculateThermalBridgingLoss,
  calculateEnergyScoreFromConsumption,
} from "./thermal-calculation-functions";
import {
  RSI_INTERNAL,
  RSO_EXTERNAL,
  THERMAL_BRIDGE_FACTORS,
  TEMPERATURE_DIFFERENCE,
  HEATING_HOURS,
  SYSTEM_EFFICIENCY,
} from "./calculation-constants";

export function calculateThermalPerformance(roomData: RoomData): Results {
  const { dimensions, walls, windows, door, floor, roof } = roomData;

  // Get material properties
  const wallMaterial = wallMaterials.find((m) => m.id === walls.material);
  const wallInsulation = insulationMaterials.find(
    (m) => m.id === walls.insulation
  );
  const roofMaterial = roofMaterials.find((m) => m.id === roof.material);
  const roofInsulation = insulationMaterials.find(
    (m) => m.id === roof.insulation
  );
  const windowType = windowTypes.find((w) => w.id === windows.type);
  const doorType = doorTypes.find((d) => d.id === door.type);
  const floorMaterial = floorMaterials.find((m) => m.id === floor.material);
  const floorInsulation = insulationMaterials.find(
    (m) => m.id === floor.insulation
  );

  if (
    !wallMaterial ||
    !wallInsulation ||
    !roofMaterial ||
    !roofInsulation ||
    !floorMaterial ||
    !floorInsulation ||
    !windowType ||
    !doorType
  ) {
    throw new Error("Material not found");
  }
  // At least one non-adjacent wall available for windows?
  const hasAvailableWallForWindows =
    !roomData.adjacentAreas?.front ||
    !roomData.adjacentAreas?.back ||
    !roomData.adjacentAreas?.left ||
    !roomData.adjacentAreas?.right;

  // Window area (only on non-adjacent walls)
  const windowArea = hasAvailableWallForWindows
    ? windows.count * windows.width * windows.height
    : 0;

  // Door area (only on front wall if not adjacent)
  const doorArea = roomData.adjacentAreas?.front ? 0 : door.width * door.height;

  // PHYSICAL AREA CALCULATIONS
  // Total wall area (all four walls ignoring windows and doors)
  const totalWallArea =
    2 * (dimensions.length + dimensions.width) * dimensions.height;

  const roofArea = dimensions.length * dimensions.width;
  const floorArea = dimensions.length * dimensions.width;

  // THERMAL CALCULATIONS (only for areas exposed to exterior)
  // Determine which areas contribute to heat loss
  const externalAreas = {
    walls: 0,
    windows: 0,
    door: 0,
    roof: 0,
    floor: 0,
  };

  // Only count wall areas exposed to exterior
  if (!roomData.adjacentAreas?.front)
    externalAreas.walls += dimensions.length * dimensions.height;
  if (!roomData.adjacentAreas?.back)
    externalAreas.walls += dimensions.length * dimensions.height;
  if (!roomData.adjacentAreas?.left)
    externalAreas.walls += dimensions.width * dimensions.height;
  if (!roomData.adjacentAreas?.right)
    externalAreas.walls += dimensions.width * dimensions.height;

  // Remove openings from thermal wall area
  externalAreas.walls = Math.max(
    0,
    externalAreas.walls - windowArea - doorArea
  );

  // Windows and doors only contribute if on exterior walls
  externalAreas.windows = windowArea;
  externalAreas.door = doorArea;

  // Roof only contributes if ceiling is not adjacent to heated space
  externalAreas.roof = roomData.adjacentAreas?.ceiling ? 0 : roofArea;

  // Floor only contributes if floor is not adjacent to heated space (e.g., over unheated basement or ground)
  externalAreas.floor = roomData.adjacentAreas?.floor ? 0 : floorArea;

  // Calculate thermal resistances using surface resistance parameters
  const wallResistance = calculateThermalResistance({
    baseThickness: walls.thickness,
    baseConductivity: wallMaterial.thermalConductivity,
    rsiInternal: RSI_INTERNAL,
    rsoExternal: RSO_EXTERNAL,
    insulationThickness:
      walls.insulation === "none" ? undefined : walls.insulationThickness,
    insulationConductivity:
      walls.insulation === "none"
        ? undefined
        : wallInsulation.thermalConductivity,
  });

  const roofResistance = calculateThermalResistance({
    baseThickness: roof.thickness,
    baseConductivity: roofMaterial.thermalConductivity,
    rsiInternal: RSI_INTERNAL,
    rsoExternal: RSO_EXTERNAL,
    insulationThickness:
      roof.insulation === "none" ? undefined : roof.insulationThickness,
    insulationConductivity:
      roof.insulation === "none"
        ? undefined
        : roofInsulation.thermalConductivity,
  });

  const floorResistance = calculateThermalResistance({
    baseThickness: floor.thickness,
    baseConductivity: floorMaterial.thermalConductivity,
    rsiInternal: RSI_INTERNAL,
    rsoExternal: RSO_EXTERNAL,
    insulationThickness:
      floor.insulation === "none" ? undefined : floor.insulationThickness,
    insulationConductivity:
      floor.insulation === "none"
        ? undefined
        : floorInsulation.thermalConductivity,
  });

  // Calculate U-values
  const wallU = calculateUValue(wallResistance);
  const roofU = calculateUValue(roofResistance);
  const floorU = calculateUValue(floorResistance);
  const windowU = adjustWindowUValueForCurtains(windowType.uValue);
  const doorU = doorType.uValue;

  // Calculate total thermal area for thermal bridging (gross building envelope area exposed to exterior)
  const totalExternalArea =
    externalAreas.walls +
    externalAreas.windows +
    externalAreas.door +
    externalAreas.roof +
    externalAreas.floor;
  const bridgingExternalArea = externalAreas.door + externalAreas.windows;

  // Prevent division by zero
  if (totalExternalArea === 0) {
    return {
      uValue: 0,
      heatLoss: 0,
      energyScore: 100,
      energyConsumptionPerYear: 0, // kWh/year
    };
  }

  // SAP Fabric Heat Loss Calculation: HF = (ΣAi × Ui) + HTB
  const fabricElementsHeatLoss = calculateFabricHeatLossElements([
    { area: externalAreas.walls, uValue: wallU },
    { area: externalAreas.windows, uValue: windowU },
    { area: externalAreas.door, uValue: doorU },
    { area: externalAreas.roof, uValue: roofU },
    { area: externalAreas.floor, uValue: floorU },
  ]);

  // Use thermal bridge factor on gross building envelope area exposed to exterior
  const thermalBridgingLoss = calculateThermalBridgingLoss({
    totalExternalArea: bridgingExternalArea,
    thermalBridgeFactor: THERMAL_BRIDGE_FACTORS.post2006,
  });

  const totalHeatLoss = calculateTotalFabricHeatLoss(
    fabricElementsHeatLoss,
    thermalBridgingLoss
  );

  // Calculate weighted average U-value for comparison purposes
  // Use total building envelope area (including non-thermal areas as reference)
  const totalBuildingEnvelopeArea = totalWallArea + roofArea + floorArea;
  const currentUValue =
    totalBuildingEnvelopeArea > 0
      ? totalHeatLoss / totalBuildingEnvelopeArea
      : 0;

  // Calculate heat loss (Q = HF × ΔT) in Watts
  const currentHeatLoss = totalHeatLoss * TEMPERATURE_DIFFERENCE;

  // Calculate energy consumption (E = Q × t_heating / η_system)
  const currentEnergyConsumption =
    (currentHeatLoss * HEATING_HOURS) / (1000 * SYSTEM_EFFICIENCY); // kWh

  // Calculate Energy Efficiency Score (1-92+ scale)
  const currentEnergyPerM2 = currentEnergyConsumption / floorArea; // kWh/m²/year

  const currentEnergyScore = Math.round(
    calculateEnergyScoreFromConsumption(currentEnergyPerM2)
  );

  // For compatibility, set improved values same as current (since we're showing current config)
  return {
    uValue: currentUValue,
    heatLoss: currentHeatLoss,
    energyScore: currentEnergyScore,
    energyConsumptionPerYear: currentEnergyConsumption, // kWh/year
  };
}
