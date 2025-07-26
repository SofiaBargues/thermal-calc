"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { Results } from "@/types/interfaces"

interface ComparisonChartProps {
  results: Results
}

export default function ComparisonChart({ results }: ComparisonChartProps) {
  const chartData = [
    {
      category: "U-Coefficient",
      actual: results.currentUValue,
      improved: results.improvedUValue,
      unit: "W/m²·K",
    },
    {
      category: "Heat Loss",
      actual: results.currentHeatLoss / 100, // Scale down for better visualization
      improved: results.improvedHeatLoss / 100,
      unit: "W (÷100)",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visual Comparison</CardTitle>
        <CardDescription>Comparison between current state and proposed improvements</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            actual: {
              label: "Current",
              color: "hsl(var(--destructive))",
            },
            improved: {
              label: "Improved",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="actual" fill="var(--color-actual)" name="Current" />
              <Bar dataKey="improved" fill="var(--color-mejorado)" name="Improved" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
