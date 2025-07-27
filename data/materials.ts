import type { Material, WindowType, DoorType } from "@/types/interfaces";

export const wallMaterials: Material[] = [
  {
    id: "brick",
    name: "Solid Brick",
    thermalConductivity: 0.87,
    density: 1800,
  },
  {
    id: "concrete",
    name: "Concrete",
    thermalConductivity: 1.4,
    density: 2300,
  },
  {
    id: "wood",
    name: "Wood",
    thermalConductivity: 0.15,
    density: 500,
  },
  {
    id: "hollow_brick",
    name: "Hollow Brick",
    thermalConductivity: 0.45,
    density: 1200,
  },
];

export const roofMaterials: Material[] = [
  {
    id: "concrete",
    name: "Concrete Slab",
    thermalConductivity: 1.4,
    density: 2300,
  },
  {
    id: "wood",
    name: "Wood Structure",
    thermalConductivity: 0.15,
    density: 500,
  },
  {
    id: "metal",
    name: "Metal Sheet",
    thermalConductivity: 50,
    density: 7800,
  },
];

export const floorMaterials: Material[] = [
  {
    id: "concrete",
    name: "Concrete Slab",
    thermalConductivity: 1.4,
    density: 2300,
    cost: 8,
  },
  {
    id: "wood",
    name: "Wood Flooring",
    thermalConductivity: 0.15,
    density: 500,
    cost: 25,
  },
  {
    id: "ceramic",
    name: "Ceramic Tiles",
    thermalConductivity: 1.3,
    density: 2000,
    cost: 15,
  },
  {
    id: "laminate",
    name: "Laminate Flooring",
    thermalConductivity: 0.17,
    density: 800,
    cost: 12,
  },
  {
    id: "vinyl",
    name: "Vinyl Flooring",
    thermalConductivity: 0.19,
    density: 1200,
    cost: 8,
  },
  {
    id: "stone",
    name: "Natural Stone",
    thermalConductivity: 2.3,
    density: 2600,
    cost: 35,
  },
  {
    id: "engineered_wood",
    name: "Engineered Wood",
    thermalConductivity: 0.13,
    density: 600,
    cost: 20,
  },
];

export const insulationMaterials: Material[] = [
  {
    id: "none",
    name: "No Insulation",
    thermalConductivity: 0,
    cost: 0,
  },
  {
    id: "rockwool",
    name: "Rock Wool",
    thermalConductivity: 0.04,
    cost: 15,
  },
  {
    id: "eps",
    name: "Expanded Polystyrene (EPS)",
    thermalConductivity: 0.035,
    cost: 12,
  },
  {
    id: "polyurethane",
    name: "Polyurethane",
    thermalConductivity: 0.025,
    cost: 25,
  },
  {
    id: "fiberglass",
    name: "Fiberglass",
    thermalConductivity: 0.045,
    cost: 10,
  },
  {
    id: "cellulose",
    name: "Cellulose",
    thermalConductivity: 0.042,
    cost: 8,
  },
];

export const windowTypes: WindowType[] = [
  {
    id: "single",
    name: "Single Glass",
    uValue: 5.8,
  },
  {
    id: "double",
    name: "Double Glazing",
    uValue: 2.8,
  },
  {
    id: "triple",
    name: "Triple Glazing",
    uValue: 1.6,
  },
  {
    id: "low_e",
    name: "Double with Low-E",
    uValue: 2.2,
  },
];

export const doorTypes: DoorType[] = [
  {
    id: "wood_basic",
    name: "Basic Wood Door",
    uValue: 3.0,
  },
  {
    id: "wood_insulated",
    name: "Insulated Wood Door",
    uValue: 2.0,
  },
  {
    id: "steel_basic",
    name: "Basic Steel Door",
    uValue: 2.5,
  },
  {
    id: "steel_insulated",
    name: "Insulated Steel Door",
    uValue: 1.5,
  },
  {
    id: "fiberglass",
    name: "Fiberglass Door",
    uValue: 1.8,
  },
  {
    id: "composite",
    name: "Composite Insulated Door",
    uValue: 1.2,
  },
];
