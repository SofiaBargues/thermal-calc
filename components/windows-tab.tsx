"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { WindowConfig } from "@/types/interfaces"
import { windowTypes } from "@/data/materials"

interface WindowsTabProps {
  data: WindowConfig
  onChange: (data: Partial<WindowConfig>) => void
}

export default function WindowsTab({ data, onChange }: WindowsTabProps) {
  const selectedWindow = windowTypes.find((w) => w.id === data.type)
  const totalWindowArea = data.count * data.width * data.height

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="window-count">Number of Windows</Label>
        <Input
          id="window-count"
          type="number"
          min="0"
          max="10"
          value={data.count}
          onChange={(e) => onChange({ count: Number.parseInt(e.target.value) || 0 })}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="window-width">Width (meters)</Label>
          <Input
            id="window-width"
            type="number"
            min="0.5"
            max="3"
            step="0.1"
            value={data.width}
            onChange={(e) => onChange({ width: Number.parseFloat(e.target.value) || 0 })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="window-height">Height (meters)</Label>
          <Input
            id="window-height"
            type="number"
            min="0.5"
            max="3"
            step="0.1"
            value={data.height}
            onChange={(e) => onChange({ height: Number.parseFloat(e.target.value) || 0 })}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="window-type">Glass Type</Label>
        <Select value={data.type} onValueChange={(value) => onChange({ type: value })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {windowTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedWindow && <p className="text-xs text-gray-500 mt-1">U-Coefficient: {selectedWindow.uValue} W/m²·K</p>}
      </div>

      <div className="bg-green-50 p-3 rounded-lg">
        <p className="text-sm text-green-700">
          <strong>Total window area:</strong> {totalWindowArea.toFixed(2)} m²
        </p>
      </div>
    </div>
  )
}
