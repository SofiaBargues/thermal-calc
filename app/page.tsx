"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Thermometer } from "lucide-react"
import ControlSidebar from "@/components/control-sidebar"
import Room3DVisualization from "@/components/room-3d-visualization"
import type { RoomData } from "@/types/interfaces"
import { calculateThermalPerformance } from "@/utils/thermal-calculations"
import BottomResultsPanel from "@/components/bottom-results-panel"

const initialRoomData: RoomData = {
  dimensions: { length: 4, width: 4, height: 2.5 },
  walls: {
    material: "brick",
    thickness: 0.2,
    insulation: "rockwool",
    insulationThickness: 0.05,
  },
  windows: {
    count: 2,
    width: 1.2,
    height: 1.5,
    type: "double",
  },
  door: {
    width: 0.9,
    height: 2.1,
    type: "wood_basic",
  },
  roof: {
    material: "concrete",
    thickness: 0.15,
    insulation: "eps",
    insulationThickness: 0.08,
  },
  adjacentAreas: {
    front: false,
    left: false,
    right: false,
    back: false,
    ceiling: false,
    floor: false,
  },
}

export default function ThermalCalculator() {
  const [roomData, setRoomData] = useState<RoomData>(initialRoomData)

  // Calculate results in real-time
  const results = useMemo(() => {
    try {
      return calculateThermalPerformance(roomData)
    } catch (error) {
      return null
    }
  }, [roomData])

  const updateRoomData = (section: keyof RoomData, data: any) => {
    setRoomData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Responsive */}
      <header className="bg-white border-b border-gray-200 px-2 sm:px-4 py-2 flex-shrink-0">
        <div className="flex items-center">
          <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
          <span className="text-base sm:text-lg font-bold text-gray-900 ml-2">ThermalCalc</span>
        </div>
      </header>

      {/* Main Content - Fully Responsive Layout */}
      <div className="flex-1 flex flex-col xl:flex-row min-h-0">
        {/* Left Section: Energy Label + 3D Visualization */}
        <div className="flex-1 flex flex-col p-1 sm:p-2 min-h-0">
          <div className="flex flex-col lg:flex-row gap-2 flex-1 min-h-0">
            {/* Energy Efficiency Label - Responsive Design */}
            <div className="w-full lg:w-64 xl:w-72 bg-gray-50 rounded-lg p-1 sm:p-2 flex-shrink-0 min-h-[220px] lg:min-h-0">
              {results ? (
                <div className="bg-white rounded-lg border-2 border-gray-300 overflow-hidden h-full flex flex-col">
                  {/* Header */}
                  <div className="bg-blue-600 text-white p-2 sm:p-4 text-center flex flex-col justify-center min-h-[50px] sm:min-h-[60px] flex-shrink-0">
                    <div className="text-xs sm:text-sm font-bold">ENERGY EFFICIENCY</div>
                    <div className="text-xs">Thermal Performance</div>
                  </div>

                  {/* Efficiency Scale - Responsive Bars */}
                  <div className="flex-1 flex flex-col p-2 sm:p-3 min-h-0">
                    <div className="space-y-1 sm:space-y-1.5 pr-8 sm:pr-12 mb-2 sm:mb-4 flex-shrink-0">
                      {(() => {
                        const currentScore = results.currentEnergyScore

                        const efficiencyLevels = [
                          { rating: "A", range: "92+", color: "#22c55e", width: "35%", min: 92, max: 100 },
                          { rating: "B", range: "81-91", color: "#16a34a", width: "45%", min: 81, max: 91 },
                          { rating: "C", range: "69-80", color: "#84cc16", width: "55%", min: 69, max: 80 },
                          { rating: "D", range: "55-68", color: "#eab308", width: "70%", min: 55, max: 68 },
                          { rating: "E", range: "39-54", color: "#f97316", width: "80%", min: 39, max: 54 },
                          { rating: "F", range: "21-38", color: "#ef4444", width: "90%", min: 21, max: 38 },
                          { rating: "G", range: "1-20", color: "#dc2626", width: "100%", min: 1, max: 20 },
                        ]

                        return efficiencyLevels.map((level) => {
                          const isCurrentRating = currentScore >= level.min && currentScore <= level.max

                          return (
                            <div key={level.rating} className="flex items-center relative">
                              {/* Rating Letter */}
                              <div
                                className="w-6 h-5 sm:w-8 sm:h-7 flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0"
                                style={{ backgroundColor: level.color }}
                              >
                                {level.rating}
                              </div>

                              {/* Horizontal Bar */}
                              <div className="flex-1 ml-1 relative">
                                <div
                                  className="h-5 sm:h-7 flex items-center justify-start px-1 sm:px-2 text-xs font-bold text-white transition-opacity duration-300"
                                  style={{
                                    backgroundColor: level.color,
                                    width: level.width,
                                    opacity: isCurrentRating ? 1 : 0.4,
                                  }}
                                >
                                  <span className="text-xs">{level.range}</span>
                                </div>
                              </div>

                              {/* Current Score Arrow - Responsive */}
                              {isCurrentRating && (
                                <div className="absolute right-0 top-0 h-5 sm:h-7 flex items-center transform translate-x-8 sm:translate-x-10">
                                  <div className="flex items-center">
                                    {/* Arrow pointing left */}
                                    <div className="w-0 h-0 border-t-[4px] sm:border-t-[6px] border-b-[4px] sm:border-b-[6px] border-r-[6px] sm:border-r-[8px] border-t-transparent border-b-transparent border-r-black"></div>
                                    {/* Score display */}
                                    <div className="bg-black text-white px-1 sm:px-2 py-0.5 sm:py-1 text-xs font-bold">
                                      {currentScore}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })
                      })()}
                    </div>

                    {/* Performance Summary - Responsive */}
                    <div className="mt-auto pt-2 sm:pt-3 border-t border-gray-200 flex-shrink-0">
                      <div className="flex justify-between items-center gap-2">
                        {/* Energy Rating Display */}
                        <div className="text-center flex-1">
                          <div
                            className={`w-8 h-6 sm:w-10 sm:h-8 flex items-center justify-center text-white text-xs sm:text-sm font-bold mx-auto mb-1 sm:mb-2 ${(() => {
                              const currentScore = results.currentEnergyScore
                              if (currentScore >= 92) return "bg-green-500"
                              if (currentScore >= 81) return "bg-green-600"
                              if (currentScore >= 69) return "bg-lime-500"
                              if (currentScore >= 55) return "bg-yellow-500"
                              if (currentScore >= 39) return "bg-orange-500"
                              if (currentScore >= 21) return "bg-red-500"
                              return "bg-red-700"
                            })()}`}
                          >
                            {(() => {
                              const currentScore = results.currentEnergyScore
                              if (currentScore >= 92) return "A"
                              if (currentScore >= 81) return "B"
                              if (currentScore >= 69) return "C"
                              if (currentScore >= 55) return "D"
                              if (currentScore >= 39) return "E"
                              if (currentScore >= 21) return "F"
                              return "G"
                            })()}
                          </div>
                          <div className="text-xs font-medium text-gray-700">Energy Rating</div>
                          <div className="text-xs text-gray-500">Score: {results.currentEnergyScore}</div>
                        </div>

                        {/* U-Value Display */}
                        <div className="text-center flex-1">
                          <div className="text-lg sm:text-2xl font-bold text-blue-600 mb-1 sm:mb-2">
                            {results.currentUValue.toFixed(2)}
                          </div>
                          <div className="text-xs font-medium text-gray-700">U-Value</div>
                          <div className="text-xs text-gray-500">W/m²·K</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border-2 border-gray-300 p-4 h-full flex items-center justify-center">
                  <div className="text-center text-gray-500 text-sm">Calculating...</div>
                </div>
              )}
            </div>

            {/* 3D Visualization - Width-constrained square on mobile */}
            <div className="flex-1 w-full lg:min-h-0">
              <div className="w-full aspect-square lg:aspect-auto lg:h-full">
                <Card className="h-full">
                  <CardContent className="p-0 h-full">
                    <Room3DVisualization roomData={roomData} results={results} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Control Sidebar - Fully Responsive */}
        <div className="w-full xl:w-80 bg-white border-t xl:border-t-0 xl:border-l border-gray-200 flex-shrink-0 min-h-[300px] xl:min-h-0">
          <ControlSidebar roomData={roomData} results={results} onUpdateRoomData={updateRoomData} />
        </div>
      </div>

      {/* Bottom: Compact Results Panel - Responsive Height */}
      <div className="flex-shrink-0 min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]">
        <BottomResultsPanel results={results} roomData={roomData} />
      </div>
    </div>
  )
}
