/**
 * CALCULATION CONSTANTS (Assumptions)
 */
/**
 * ΔT - Temperature difference between inside and outside (K or °C)
 * Standard design condition for UK heating calculations
 * Represents typical winter heating requirement
 */
export const TEMPERATURE_DIFFERENCE = 20;
/**
 * t_heating - Annual heating hours (hours/year)
 * Typical UK residential heating operation duration
 * Used to convert power (W) to energy consumption (kWh)
 */
export const HEATING_HOURS = 2000;
/**
 * η_system - Heating system efficiency (dimensionless, 0-1)
 * Accounts for boiler/heat pump efficiency losses
 * 0.85 represents typical condensing boiler efficiency
 */
export const SYSTEM_EFFICIENCY = 0.85;



/**
 * THERMAL RESISTANCE SYMBOLS (m²K/W)
 * Surface resistances per BS EN ISO 6946
 */
/**
 * Rsi - Internal surface resistance (m²K/W)
 * Standard value for still air adjacent to internal building surfaces
 */
export const RSI_INTERNAL = 0.13;
/**
 * Rso - External surface resistance (m²K/W)
 * Standard value for moving air adjacent to external building surfaces
 */

export const RSO_EXTERNAL = 0.04;
/**
 * THERMAL BRIDGING SYMBOLS
 * Linear thermal bridge factors (y) based on construction era (W/m²K)
 */
/**
 * y - Linear thermal bridging factor (W/m²K)
 * Accounts for heat loss through structural elements that bridge insulation
 * Values based on UK construction standards and building regulation compliance
 */

export const THERMAL_BRIDGE_FACTORS = {
  pre2002: 0.15, // y = 0.15 - Most homes built before 2002 (poor thermal bridging control)
  year2002: 0.11, // y = 0.11 - Dwellings complying with 2002 building regulations  
  post2006: 0.08 // y = 0.08 - Dwellings built after 2006 (improved thermal bridging)
} as const;
