/**
 * Thermal Calculation Functions
 * 
 * Core mathematical functions for thermal performance calculations.
 * These functions implement standard building physics formulas
 * per BS EN ISO 6946 and UK building regulations.
 */


/**
 * Calculate thermal resistance (R-value) including surface resistances
 * Formula: R = Rsi + Σ(thickness/thermal_conductivity) + Rso
 * 
 * @param params - Object containing thermal resistance calculation parameters
 * @param params.baseThickness - d1: Thickness of base material layer (m)
 * @param params.baseConductivity - λ1: Thermal conductivity of base material (W/mK)
 * @param params.rsiInternal - Rsi: Internal surface resistance (m²K/W)
 * @param params.rsoExternal - Rso: External surface resistance (m²K/W)
 * @param params.insulationThickness - d2: Thickness of insulation layer (m), optional
 * @param params.insulationConductivity - λ2: Thermal conductivity of insulation (W/mK), optional
 * @returns R_total: Total thermal resistance (m²K/W)
 */
export function calculateThermalResistance({
  baseThickness,
  baseConductivity,
  rsiInternal,
  rsoExternal,
  insulationThickness,
  insulationConductivity
}: {
  baseThickness: number
  baseConductivity: number
  rsiInternal: number
  rsoExternal: number
  insulationThickness?: number
  insulationConductivity?: number
}): number {
  // R1 = d1/λ1 - Base material thermal resistance
  const baseResistance = baseThickness / baseConductivity
  
  // R2 = d2/λ2 - Insulation thermal resistance (if present)
  const insulationResistance = insulationThickness && insulationConductivity 
    ? insulationThickness / insulationConductivity 
    : 0
  
  // R_total = Rsi + R1 + R2 + Rso
  return rsiInternal + baseResistance + insulationResistance + rsoExternal
}

/**
 * Calculate total fabric heat loss coefficient
 * Formula: HF = (ΣAi × Ui) + HTB
 * 
 * @param fabricHeatLossElements - ΣAi × Ui: Sum of area-weighted U-values for all elements (W/K)
 * @param thermalBridgingLoss - HTB: Heat loss through thermal bridges (W/K)
 * @returns HF: Total fabric heat loss coefficient (W/K)
 */
export function calculateFabricHeatLoss(
  fabricHeatLossElements: number,
  thermalBridgingLoss: number
): number {
  return fabricHeatLossElements + thermalBridgingLoss
}

/**
 * Calculate U-value from thermal resistance
 * Formula: U = 1/R_total
 * 
 * @param thermalResistance - R_total: Total thermal resistance (m²K/W)
 * @returns U: Thermal transmittance coefficient (W/m²K)
 */
export function calculateUValue(thermalResistance: number): number {
  return 1 / thermalResistance
}

/**
 * Apply window U-value adjustment for curtains
 * Formula: U_adjusted = 1/(1/U_unadjusted + 0.04)
 * 
 * @param uValue - U_unadjusted: Original window U-value without curtains (W/m²K)
 * @returns U_adjusted: Adjusted U-value accounting for curtain thermal resistance (W/m²K)
 */
export function adjustWindowUValueForCurtains(uValue: number): number {
  // Additional thermal resistance from curtains = 0.04 m²K/W (as per EPC methodology)
  return 1 / (1 / uValue + 0.04)
}

/**
 * Calculate fabric heat loss elements (area-weighted U-values)
 * Formula: ΣAi × Ui
 * 
 * @param elements - Array of building elements with their areas and U-values
 * @returns ΣAi × Ui: Sum of area-weighted U-values (W/K)
 */
export function calculateFabricHeatLossElements(elements: Array<{ area: number; uValue: number }>): number {
  return elements.reduce((total, element) => {
    // Ai × Ui for each element
    return total + (element.area * element.uValue)
  }, 0)
}

/**
 * Calculate thermal bridging loss
 * Formula: HTB = y × A_ext
 * 
 * @param params - Object containing thermal bridging calculation parameters
 * @param params.totalExternalArea - A_ext: Total external area (m²)
 * @param params.thermalBridgeFactor - y: Linear thermal bridging factor (W/m²K)
 * @returns HTB: Heat loss through thermal bridges (W/K)
 */
export function calculateThermalBridgingLoss({
  totalExternalArea,
  thermalBridgeFactor
}: {
  totalExternalArea: number
  thermalBridgeFactor: number
}): number {
  return thermalBridgeFactor * totalExternalArea
}

/**
 * Convert energy consumption to efficiency score (1-100 scale)
 * Formula: UK EPC rating bands
 * 
 * @param energyPerM2 - Energy consumption per square meter (kWh/m²/year)
 * @returns Energy efficiency score (1-100, where 92+ = A rating)
 */
export function calculateEnergyScoreFromConsumption(energyPerM2: number): number {
  // Official UK EPC rating bands
  if (energyPerM2 < 50) return Math.min(100, Math.max(92, 100 - energyPerM2)) // A: <50 kWh/m²/year (92-100)
  if (energyPerM2 <= 90) return Math.max(81, 92 - ((energyPerM2 - 50) / 40) * 11) // B: 50-90 kWh/m²/year (81-91)
  if (energyPerM2 <= 150) return Math.max(69, 81 - ((energyPerM2 - 90) / 60) * 12) // C: 91-150 kWh/m²/year (69-80)
  if (energyPerM2 <= 230) return Math.max(55, 69 - ((energyPerM2 - 150) / 80) * 14) // D: 151-230 kWh/m²/year (55-68)
  if (energyPerM2 <= 330) return Math.max(39, 55 - ((energyPerM2 - 230) / 100) * 16) // E: 231-330 kWh/m²/year (39-54)
  if (energyPerM2 <= 450) return Math.max(21, 39 - ((energyPerM2 - 330) / 120) * 18) // F: 331-450 kWh/m²/year (21-38)
  return Math.max(1, 21 - ((energyPerM2 - 450) / 100) * 20) // G: >450 kWh/m²/year (1-20)
} 