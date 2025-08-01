"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Thermometer } from "lucide-react";
import ControlSidebar from "@/components/control-sidebar";
import Room3DVisualization from "@/components/room-3d-visualization";
import type { RoomData } from "@/types/interfaces";
import { calculateThermalPerformance } from "@/utils/thermal-calculations";
import BottomResultsPanel from "@/components/bottom-results-panel";
import { EnergyEfficiency } from "@/components/energy-efficiency";
import { Footer } from "@/components/footer";

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
  floor: {
    material: "concrete",
    thickness: 0.15,
    insulation: "eps",
    insulationThickness: 0.05,
  },
  adjacentAreas: {
    front: false,
    left: false,
    right: false,
    back: false,
    ceiling: false,
    floor: false,
  },
};

export default function ThermalCalculator() {
  const [roomData, setRoomData] = useState<RoomData>(initialRoomData);

  // Calculate results in real-time
  const results = calculateThermalPerformance(roomData);

  const updateRoomData = (section: keyof RoomData, data: any) => {
    setRoomData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Responsive */}
      <header className="bg-white border-b border-gray-200 px-2 sm:px-4 py-2 flex-shrink-0">
        <div className="flex items-center">
          <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
          <span className="text-base sm:text-lg font-bold text-gray-900 ml-2">
            ThermalCalc
          </span>
        </div>
      </header>

      {/* Main Content - Fully Responsive Layout */}
      <div
        className="flex-1 flex flex-col gap-2 xl:flex-row p-12 
       min-h-0"
      >
        {/* Left Section: Energy Label + 3D Visualization */}
        <div className="flex-1 flex lg:flex-row gap-2 flex-col  min-h-0">
          {/* <div className="flex flex-col lg:flex-row gap-2 flex-1  min-h-0"> */}
          {/* Energy Efficiency Label - Responsive Design */}
          <div className=" w-full lg:w-64 xl:w-72 bg-gray-50 rounded-lg flex-shrink-0 min-h-[220px] lg:min-h-0 ">
            {results ? (
              <div className="bg-white rounded-lg border-2 border-gray-300 overflow-hidden h-full flex flex-col">
                {/* Header */}
                <div className="bg-blue-600 text-white p-2 sm:p-4 text-center flex flex-col justify-center min-h-[50px] sm:min-h-[60px] flex-shrink-0">
                  <div className="text-xs sm:text-sm font-bold">
                    ENERGY EFFICIENCY
                  </div>
                  <div className="text-xs">Thermal Performance</div>
                </div>

                {/* Efficiency Scale - Responsive Bars */}
                <div className="flex-1 flex flex-col justify-evenly  p-2 sm:p-3 ">
                  <EnergyEfficiency results={results} />
                  {/* Performance Summary - Responsive */}
                  <div className="  sm:pt-3 flex-shrink-0">
                    <div className="flex flex-row md:flex-col justify-center items-center  gap-2 ">
                      {/* Energy Rating Display */}
                      <div className="text-center flex-1">
                        <div
                          className={`w-8 h-6 sm:w-24 sm:h-20 flex items-center justify-center text-white text-xs sm:text-5xl font-bold mx-auto mb-1 sm:mb-2 ${(() => {
                            const currentScore = results.energyScore;
                            if (currentScore >= 92) return "bg-green-500";
                            if (currentScore >= 81) return "bg-green-600";
                            if (currentScore >= 69) return "bg-lime-500";
                            if (currentScore >= 55) return "bg-yellow-500";
                            if (currentScore >= 39) return "bg-orange-500";
                            if (currentScore >= 21) return "bg-red-500";
                            return "bg-red-700";
                          })()}`}
                        >
                          {(() => {
                            const currentScore = results.energyScore;
                            if (currentScore >= 92) return "A";
                            if (currentScore >= 81) return "B";
                            if (currentScore >= 69) return "C";
                            if (currentScore >= 55) return "D";
                            if (currentScore >= 39) return "E";
                            if (currentScore >= 21) return "F";
                            return "G";
                          })()}
                        </div>
                        <div className="text-xs font-medium text-gray-700">
                          Energy Rating
                        </div>
                        <div className="text-xs text-gray-500">
                          Score: {results.energyScore}
                        </div>
                      </div>

                      {/* U-Value Display */}
                      <div className="text-center flex-1 ">
                        <div className="text-lg sm:text-5xl font-bold text-blue-600 mb-1 sm:mb-2">
                          {results.uValue.toFixed(2)}
                        </div>
                        <div className="text-xs font-medium text-gray-700">
                          U-Value
                        </div>
                        <div className="text-xs text-gray-500">W/m²·K</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border-2 border-gray-300 p-4 h-full flex items-center justify-center">
                <div className="text-center text-gray-500 text-sm">
                  Calculating...
                </div>
              </div>
            )}
          </div>
          <div className=" flex flex-col rounded-lg border-2 border-gray-300 w-full lg:min-h-0 ">
            {/* 3D Visualization - Width-constrained square on mobile */}
            <div className="w-full aspect-square lg:aspect-auto lg:h-full">
              <Card className="h-full border-none">
                <CardContent className="p-0 h-full">
                  <Room3DVisualization
                    roomData={roomData}
                    results={results ? results : undefined}
                  />
                </CardContent>
              </Card>
            </div>
            {/* Bottom: Compact Results Panel - Responsive Height */}
            <div className="flex-shrink-0 min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]">
              <BottomResultsPanel results={results} roomData={roomData} />
            </div>
          </div>
          {/* </div> */}
        </div>
        {/* Right: Control Sidebar - Fully Responsive */}
        <div className="w-full xl:w-80 rounded-lg border-2 border-gray-300 min-h-[300px] xl:min-h-0">
          <ControlSidebar
            roomData={roomData}
            onUpdateRoomData={updateRoomData}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
