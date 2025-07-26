import type { RoomData, Results } from "@/types/interfaces"
import { wallMaterials, roofMaterials, insulationMaterials, windowTypes, doorTypes } from "@/data/materials"

export function calculateThermalPerformance(roomData: RoomData): Results {
  const { dimensions, walls, windows, door, roof } = roomData

  // Constants
  const TEMPERATURE_DIFFERENCE = 20 // ΔT = 20°C
  const HEATING_HOURS = 2000 // Hours per year
  const ENERGY_COST = 0.15 // USD per kWh
  const SYSTEM_EFFICIENCY = 0.85

  // Get material properties
  const wallMaterial = wallMaterials.find((m) => m.id === walls.material)
  const wallInsulation = insulationMaterials.find((m) => m.id === walls.insulation)
  const roofMaterial = roofMaterials.find((m) => m.id === roof.material)
  const roofInsulation = insulationMaterials.find((m) => m.id === roof.insulation)
  const windowType = windowTypes.find((w) => w.id === windows.type)
  const doorType = doorTypes.find((d) => d.id === door.type)

  if (!wallMaterial || !wallInsulation || !roofMaterial || !roofInsulation || !windowType || !doorType) {
    throw new Error("Material not found")
  }

  // Calculate areas - exclude adjacent walls from heat loss calculations
  const wallArea = 2 * (dimensions.length + dimensions.width) * dimensions.height

  // Count available walls for windows (non-adjacent only)
  const availableWallsForWindows = []
  if (!roomData.adjacentAreas?.front) availableWallsForWindows.push(dimensions.length)
  if (!roomData.adjacentAreas?.back) availableWallsForWindows.push(dimensions.length)
  if (!roomData.adjacentAreas?.left) availableWallsForWindows.push(dimensions.width)
  if (!roomData.adjacentAreas?.right) availableWallsForWindows.push(dimensions.width)

  // Windows can only be placed on non-adjacent walls
  const windowArea = availableWallsForWindows.length > 0 ? windows.count * windows.width * windows.height : 0

  // Door area (always on front wall)
  const doorArea = door.width * door.height

  // Only count walls that are exposed to exterior for thermal calculations
  let thermalWallArea = wallArea
  if (roomData.adjacentAreas?.front) thermalWallArea -= dimensions.length * dimensions.height
  if (roomData.adjacentAreas?.back) thermalWallArea -= dimensions.length * dimensions.height
  if (roomData.adjacentAreas?.left) thermalWallArea -= dimensions.width * dimensions.height
  if (roomData.adjacentAreas?.right) thermalWallArea -= dimensions.width * dimensions.height

  const netWallArea = Math.max(0, thermalWallArea - windowArea - doorArea)

  // Roof area calculation - only if ceiling is not adjacent to heated space
  const roofArea = roomData.adjacentAreas?.ceiling ? 0 : dimensions.length * dimensions.width

  // Calculate thermal resistance (R-values) - using current configuration with insulation
  const wallResistance =
    walls.insulation === "none"
      ? walls.thickness / wallMaterial.thermalConductivity
      : walls.thickness / wallMaterial.thermalConductivity +
        walls.insulationThickness / wallInsulation.thermalConductivity

  const roofResistance =
    roof.insulation === "none"
      ? roof.thickness / roofMaterial.thermalConductivity
      : roof.thickness / roofMaterial.thermalConductivity +
        roof.insulationThickness / roofInsulation.thermalConductivity

  // Calculate U-values (thermal transmittance)
  const wallU = 1 / wallResistance
  const roofU = 1 / roofResistance
  const windowU = windowType.uValue
  const doorU = doorType.uValue

  // Calculate weighted average U-values - only for surfaces exposed to exterior
  const totalArea = netWallArea + windowArea + doorArea + roofArea

  // Prevent division by zero
  if (totalArea === 0) {
    return {
      currentUValue: 0,
      improvedUValue: 0,
      currentHeatLoss: 0,
      improvedHeatLoss: 0,
      energySaving: 0,
      costSaving: 0,
      currentEnergyScore: 92,
      improvedEnergyScore: 92,
    }
  }

  const currentUValue = (netWallArea * wallU + windowArea * windowU + doorArea * doorU + roofArea * roofU) / totalArea

  // Calculate heat loss (Q = U × A × ΔT)
  const currentHeatLoss = currentUValue * totalArea * TEMPERATURE_DIFFERENCE

  // Calculate energy consumption
  const currentEnergyConsumption = (currentHeatLoss * HEATING_HOURS) / (1000 * SYSTEM_EFFICIENCY) // kWh

  // Calculate Energy Efficiency Score (1-92+ scale)
  const floorArea = dimensions.length * dimensions.width
  const currentEnergyPerM2 = currentEnergyConsumption / floorArea // kWh/m²/year

  // Convert energy consumption to efficiency score (1-92+ scale)
  const calculateEnergyScore = (energyPerM2: number): number => {
    if (energyPerM2 <= 15) return Math.min(92, Math.max(92, 107 - energyPerM2)) // A: 92+
    if (energyPerM2 <= 25) return Math.max(81, 96 - energyPerM2) // B: 81-91
    if (energyPerM2 <= 50) return Math.max(69, 94 - energyPerM2) // C: 69-80
    if (energyPerM2 <= 90) return Math.max(55, 90 - (energyPerM2 - 50) * 0.875) // D: 55-68
    if (energyPerM2 <= 150) return Math.max(39, 70 - (energyPerM2 - 90) * 0.517) // E: 39-54
    if (energyPerM2 <= 230) return Math.max(21, 54 - (energyPerM2 - 150) * 0.413) // F: 21-38
    return Math.max(1, 38 - (energyPerM2 - 230) * 0.185) // G: 1-20
  }

  const currentEnergyScore = Math.round(calculateEnergyScore(currentEnergyPerM2))

  // For compatibility, set improved values same as current (since we're showing current config)
  return {
    currentUValue,
    improvedUValue: currentUValue,
    currentHeatLoss,
    improvedHeatLoss: currentHeatLoss,
    energySaving: 0,
    costSaving: 0,
    currentEnergyScore,
    improvedEnergyScore: currentEnergyScore,
  }
}
