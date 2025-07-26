"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { RoomDimensions } from "@/types/interfaces"

interface DimensionsTabProps {
  data: RoomDimensions
  onChange: (data: Partial<RoomDimensions>) => void
}

export default function DimensionsTab({ data, onChange }: DimensionsTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="length">Length (meters)</Label>
          <Input
            id="length"
            type="number"
            min="1"
            max="20"
            step="0.1"
            value={data.length}
            onChange={(e) => onChange({ length: Number.parseFloat(e.target.value) || 0 })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="width">Width (meters)</Label>
          <Input
            id="width"
            type="number"
            min="1"
            max="20"
            step="0.1"
            value={data.width}
            onChange={(e) => onChange({ width: Number.parseFloat(e.target.value) || 0 })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="height">Height (meters)</Label>
          <Input
            id="height"
            type="number"
            min="2"
            max="5"
            step="0.1"
            value={data.height}
            onChange={(e) => onChange({ height: Number.parseFloat(e.target.value) || 0 })}
            className="mt-1"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Floor Area:</strong> {(data.length * data.width).toFixed(1)} m²
        </p>
        <p className="text-sm text-blue-700">
          <strong>Volume:</strong> {(data.length * data.width * data.height).toFixed(1)} m³
        </p>
      </div>
    </div>
  )
}
