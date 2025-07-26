"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingDown, TrendingUp, DollarSign, Zap } from "lucide-react"
import type { Results, RoomData } from "@/types/interfaces"
import ComparisonChart from "@/components/comparison-chart"
import Recommendations from "@/components/recommendations"
import EnergySavingsChart from "@/components/energy-savings-chart"

interface ResultsPanelProps {
  results: Results
  roomData: RoomData
}

export default function ResultsPanel({ results, roomData }: ResultsPanelProps) {
  const improvementPercentage = ((results.currentHeatLoss - results.improvedHeatLoss) / results.currentHeatLoss) * 100

  return (
    <div className="space-y-6">
      {/* Energy Savings Chart - Featured prominently */}
      <EnergySavingsChart results={results} />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{results.currentUValue.toFixed(2)}</div>
            <p className="text-xs text-gray-500">W/m²·K U-Coefficient</p>
            <p className="text-sm text-gray-600 mt-1">{results.currentHeatLoss.toFixed(0)}W heat loss</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">With Improvements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{results.improvedUValue.toFixed(2)}</div>
            <p className="text-xs text-gray-500">W/m²·K U-Coefficient</p>
            <p className="text-sm text-gray-600 mt-1">{results.improvedHeatLoss.toFixed(0)}W heat loss</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Results Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-green-600" />
            Thermal Analysis Results
          </CardTitle>
          <CardDescription>Performance comparison before and after improvements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Heat Loss Comparison */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Heat Loss</span>
              <Badge variant={improvementPercentage > 0 ? "default" : "secondary"}>
                {improvementPercentage > 0 ? "-" : "+"}
                {Math.abs(improvementPercentage).toFixed(1)}%
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-red-500" />
                <span>Current: {results.currentHeatLoss.toFixed(0)} W</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-green-500" />
                <span>Improved: {results.improvedHeatLoss.toFixed(0)} W</span>
              </div>
            </div>
            <Progress value={100 - improvementPercentage} className="h-2" />
          </div>

          {/* Energy Savings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Energy Savings</p>
                <p className="text-lg font-bold text-green-600">{results.energySaving.toFixed(0)} kWh/year</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Cost Savings</p>
                <p className="text-lg font-bold text-green-600">${results.costSaving.toFixed(0)}/year</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <ComparisonChart results={results} />

      {/* Recommendations */}
      <Recommendations results={results} roomData={roomData} />
    </div>
  )
}
