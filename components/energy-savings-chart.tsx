"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Results } from "@/types/interfaces"

interface EnergySavingsChartProps {
  results: Results
}

export default function EnergySavingsChart({ results }: EnergySavingsChartProps) {
  // Calculate efficiency rating
  const getEfficiencyRating = (uValue: number) => {
    if (uValue < 0.5) return { rating: "A++", color: "#22c55e", score: 95 }
    if (uValue < 1.0) return { rating: "A+", color: "#16a34a", score: 85 }
    if (uValue < 1.5) return { rating: "A", color: "#65a30d", score: 75 }
    if (uValue < 2.0) return { rating: "B", color: "#ca8a04", score: 65 }
    if (uValue < 2.5) return { rating: "C", color: "#ea580c", score: 55 }
    if (uValue < 3.0) return { rating: "D", color: "#dc2626", score: 45 }
    if (uValue < 4.0) return { rating: "E", color: "#b91c1c", score: 35 }
    return { rating: "F", color: "#991b1b", score: 25 }
  }

  const currentRating = getEfficiencyRating(results.currentUValue)
  const improvedRating = getEfficiencyRating(results.improvedUValue)

  const co2Savings = (results.energySaving * 0.4).toFixed(0) // Approximate CO2 factor
  const improvementPercentage = (
    ((results.currentHeatLoss - results.improvedHeatLoss) / results.currentHeatLoss) *
    100
  ).toFixed(0)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Energy Performance Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Energy Efficiency Scale */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Energy Efficiency Rating</h3>
            <div className="flex items-center space-x-2">
              {/* Current Rating */}
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-600 mb-1">Current</div>
                <div
                  className="w-12 h-8 flex items-center justify-center text-white font-bold text-sm rounded"
                  style={{ backgroundColor: currentRating.color }}
                >
                  {currentRating.rating}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-1 flex items-center justify-center">
                <svg width="40" height="20" viewBox="0 0 40 20" className="text-green-600">
                  <path
                    d="M5 10 L30 10 M25 5 L30 10 L25 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Improved Rating */}
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-600 mb-1">Improved</div>
                <div
                  className="w-12 h-8 flex items-center justify-center text-white font-bold text-sm rounded"
                  style={{ backgroundColor: improvedRating.color }}
                >
                  {improvedRating.rating}
                </div>
              </div>
            </div>
          </div>

          {/* Energy Efficiency Bar Chart */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Efficiency Scale</h3>
            <div className="space-y-1">
              {[
                { rating: "A++", color: "#22c55e", range: "< 0.5" },
                { rating: "A+", color: "#16a34a", range: "0.5-1.0" },
                { rating: "A", color: "#65a30d", range: "1.0-1.5" },
                { rating: "B", color: "#ca8a04", range: "1.5-2.0" },
                { rating: "C", color: "#ea580c", range: "2.0-2.5" },
                { rating: "D", color: "#dc2626", range: "2.5-3.0" },
                { rating: "E", color: "#b91c1c", range: "3.0-4.0" },
                { rating: "F", color: "#991b1b", range: "> 4.0" },
              ].map((item) => (
                <div key={item.rating} className="flex items-center space-x-2">
                  <div
                    className="w-8 h-6 flex items-center justify-center text-white text-xs font-bold rounded"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.rating}
                  </div>
                  <div className="flex-1 h-6 bg-gray-200 rounded relative overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-500"
                      style={{
                        backgroundColor: item.color,
                        width: item.rating === currentRating.rating ? "100%" : "20%",
                        opacity:
                          item.rating === currentRating.rating || item.rating === improvedRating.rating ? 1 : 0.3,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 w-16">{item.range}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{co2Savings}kg</div>
                <div className="text-sm text-gray-600">CO₂ Saved/Year</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{improvementPercentage}%</div>
                <div className="text-sm text-gray-600">Heat Loss Reduction</div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-3xl font-bold text-purple-600">${results.costSaving.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Annual Energy Savings</div>
            </div>
          </div>

          {/* Performance Curve Visualization */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Performance Improvement</h3>
            <div className="relative h-20 bg-gray-100 rounded-lg overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 300 80" className="absolute inset-0">
                {/* Current performance curve */}
                <path
                  d="M20 60 Q80 50 140 45 Q200 40 280 35"
                  stroke="#ef4444"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                />
                {/* Improved performance curve */}
                <path d="M20 60 Q80 35 140 25 Q200 20 280 15" stroke="#22c55e" strokeWidth="3" fill="none" />
                {/* Labels */}
                <text x="20" y="75" fontSize="10" fill="#666">
                  Start
                </text>
                <text x="260" y="75" fontSize="10" fill="#666">
                  Optimized
                </text>
              </svg>

              <div className="absolute top-2 right-2 space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-red-500 opacity-60" style={{ borderStyle: "dashed" }}></div>
                  <span className="text-xs text-gray-600">Current</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-green-500"></div>
                  <span className="text-xs text-gray-600">Improved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
