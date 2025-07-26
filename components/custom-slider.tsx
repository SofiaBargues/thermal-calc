"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export default function CustomSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  className = "",
  disabled = false,
  displayValue,
  description,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
  description?: string;
  displayValue?: string;
  showValue?: boolean;
  unit?: string;
  formatValue?: (value: number) => string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <Label className="text-xs text-gray-600">{label}</Label>
        {displayValue && (
          <Badge variant="outline" className="text-xs">
            {displayValue}
          </Badge>
        )}
      </div>

      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="h-1"
      />

      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
}
