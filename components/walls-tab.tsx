"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { WallConfig } from "@/types/interfaces"
import { wallMaterials, insulationMaterials } from "@/data/materials"

interface WallsTabProps {
  data: WallConfig
  onChange: (data: Partial<WallConfig>) => void
}

export default function WallsTab({ data, onChange }: WallsTabProps) {
  const selectedMaterial = wallMaterials.find((m) => m.id === data.material)
  const selectedInsulation = insulationMaterials.find((m) => m.id === data.insulation)

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="wall-material">Wall Material</Label>
        <Select value={data.material} onValueChange={(value) => onChange({ material: value })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select material" />
          </SelectTrigger>
          <SelectContent>
            {wallMaterials.map((material) => (
              <SelectItem key={material.id} value={material.id}>
                {material.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedMaterial && (
          <p className="text-xs text-gray-500 mt-1">Conductivity: {selectedMaterial.thermalConductivity} W/m·K</p>
        )}
      </div>

      <div>
        <Label htmlFor="wall-thickness">Wall Thickness (meters)</Label>
        <Input
          id="wall-thickness"
          type="number"
          min="0.1"
          max="1"
          step="0.01"
          value={data.thickness}
          onChange={(e) => onChange({ thickness: Number.parseFloat(e.target.value) || 0 })}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="insulation-material">Insulation Material</Label>
        <Select value={data.insulation} onValueChange={(value) => onChange({ insulation: value })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select insulation" />
          </SelectTrigger>
          <SelectContent>
            {insulationMaterials.map((material) => (
              <SelectItem key={material.id} value={material.id}>
                {material.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedInsulation && (
          <p className="text-xs text-gray-500 mt-1">
            Conductivity: {selectedInsulation.thermalConductivity} W/m·K | Cost: ${selectedInsulation.cost}/m²
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="insulation-thickness">Insulation Thickness (meters)</Label>
        <Input
          id="insulation-thickness"
          type="number"
          min="0.01"
          max="0.3"
          step="0.01"
          value={data.insulationThickness}
          onChange={(e) => onChange({ insulationThickness: Number.parseFloat(e.target.value) || 0 })}
          className="mt-1"
        />
      </div>
    </div>
  )
}
