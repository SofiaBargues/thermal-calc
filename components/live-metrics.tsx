"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, DollarSign, Zap, Thermometer } from "lucide-react"
import type { Results } from "@/types/interfaces"

interface LiveMetricsProps {
  results: Results
}

export default function LiveMetrics({ results }: LiveMetricsProps) {
  const improvementPercentage = ((results.currentHeatLoss - results.improvedHeatLoss) / results.currentHeatLoss) * 100

  const getEfficiencyBadge = (uValue: number) => {
    if (uValue < 1.0) return { label: "Excellent", variant: "default" as const, color: "text-green-600" }
    if (uValue < 2.0) return { label: "Good", variant: "secondary" as const, color: "text-yellow-600" }
    if (uValue < 3.0) return { label: "Fair", variant: "outline" as const, color: "text-orange-600" }
    return { label: "Poor", variant: "destructive" as const, color: "text-red-600" }
  }

  const currentEfficiency = getEfficiencyBadge(results.currentUValue)
  const improvedEfficiency = getEfficiencyBadge(results.improvedUValue)

  return (
    <div className="mb-6">
      <Card className="bg-white/80 backdrop-blur-sm border-2">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Current U-Value */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Thermometer className="h-4 w-4 text-red-500" />
                <span className="text-xs font-medium text-gray-600">Current U-Value</span>
              </div>
              <div className={`text-xl font-bold ${currentEfficiency.color}`}>{results.currentUValue.toFixed(2)}</div>
              <Badge variant={currentEfficiency.variant} className="text-xs">
                {currentEfficiency.label}
              </Badge>
            </div>

            {/* Improved U-Value */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Thermometer className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-gray-600">Improved U-Value</span>
              </div>
              <div className={`text-xl font-bold ${improvedEfficiency.color}`}>{results.improvedUValue.toFixed(2)}</div>
              <Badge variant={improvedEfficiency.variant} className="text-xs">
                {improvedEfficiency.label}
              </Badge>
            </div>

            {/* Heat Loss Reduction */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingDown className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-medium text-gray-600">Heat Loss Reduction</span>
              </div>
              <div className="text-xl font-bold text-blue-600">{improvementPercentage.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">
                {(results.currentHeatLoss - results.improvedHeatLoss).toFixed(0)}W saved
              </div>
            </div>

            {/* Energy Savings */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-xs font-medium text-gray-600">Energy Savings</span>
              </div>
              <div className="text-xl font-bold text-yellow-600">{(results.energySaving / 1000).toFixed(1)}k</div>
              <div className="text-xs text-gray-500">kWh/year</div>
            </div>

            {/* Cost Savings */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-gray-600">Annual Savings</span>
              </div>
              <div className="text-xl font-bold text-green-600">${results.costSaving.toFixed(0)}</div>
              <div className="text-xs text-gray-500">per year</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
