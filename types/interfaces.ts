export interface RoomDimensions {
  length: number;
  width: number;
  height: number;
}

export interface WallConfig {
  material: string;
  thickness: number;
  insulation: string;
  insulationThickness: number;
}

export interface WindowConfig {
  count: number;
  width: number;
  height: number;
  type: string;
}

export interface DoorConfig {
  width: number;
  height: number;
  type: string;
}

export interface RoofConfig {
  material: string;
  thickness: number;
  insulation: string;
  insulationThickness: number;
}
export interface FloorConfig {
  material: string;
  thickness: number;
  insulation: string;
  insulationThickness: number;
}
export interface AdjacentAreas {
  front?: boolean;
  left?: boolean;
  right?: boolean;
  back?: boolean;
  ceiling?: boolean;
  floor?: boolean;
}

export interface RoomData {
  dimensions: RoomDimensions;
  walls: WallConfig;
  windows: WindowConfig;
  door: DoorConfig;
  roof: RoofConfig;
  floor: FloorConfig;
  adjacentAreas?: AdjacentAreas;
}

export interface Results {
  uValue: number;
  heatLoss: number;
  energyScore: number;
  energyConsumptionPerYear: number; // kWh/year
}

export interface Material {
  id: string;
  name: string;
  thermalConductivity: number;
  density?: number;
  cost?: number;
}

export interface WindowType {
  id: string;
  name: string;
  uValue: number;
}

export interface DoorType {
  id: string;
  name: string;
  uValue: number;
}
