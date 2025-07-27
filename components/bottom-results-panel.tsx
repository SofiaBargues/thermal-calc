"use client";
import type { Results, RoomData } from "@/types/interfaces";

interface BottomResultsPanelProps {
  results: Results | null;
  roomData: RoomData;
}

export default function BottomResultsPanel({
  results,
  roomData,
}: BottomResultsPanelProps) {
  if (!results) return null;

  const floorArea = roomData.dimensions.length * roomData.dimensions.width;
  const co2Impact = (results.heatLoss * 0.0002 * 2000).toFixed(0); // Approximate CO2 per year

  // Calculate efficiency rating
  const getEfficiencyRating = (score: number) => {
    if (score >= 92) return { rating: "A", bgColor: "bg-green-500" };
    if (score >= 81) return { rating: "B", bgColor: "bg-green-600" };
    if (score >= 69) return { rating: "C", bgColor: "bg-lime-500" };
    if (score >= 55) return { rating: "D", bgColor: "bg-yellow-500" };
    if (score >= 39) return { rating: "E", bgColor: "bg-orange-500" };
    if (score >= 21) return { rating: "F", bgColor: "bg-red-500" };
    return { rating: "G", bgColor: "bg-red-700" };
  };

  const currentRating = getEfficiencyRating(results.energyScore);

  return (
    <div className="bg-white rounded-b-md h-full min-h-0">
      <div className="flex h-full min-h-0">
        {/* Main Results - Responsive grid with flexible height */}
        <div className="flex-1 p-2 sm:p-3 lg:p-4 min-h-0">
          <div className="grid max-w-3xl mx-auto grid-cols-3 gap-2 sm:gap-3 lg:gap-4 h-full items-center">
            {/* Floor Area */}
            <div className="text-center">
              <div className="text-xs text-gray-700">Floor Area</div>
              <div className="text-sm sm:text-lg lg:text-2xl font-bold text-gray-900">
                {floorArea.toFixed(0)}m²
              </div>
            </div>

            {/* Heat Loss */}
            <div className="text-center">
              <div className="text-xs text-gray-700">Heat Loss</div>
              <div className="text-sm sm:text-lg lg:text-2xl font-bold text-red-600">
                {results.heatLoss.toFixed(0)}W
              </div>
            </div>

            {/* Energy Consumption */}
            <div className="text-center">
              <div className="text-xs text-gray-700">
                Yearly energy consumption{" "}
              </div>
              <div className="text-sm sm:text-lg lg:text-2xl font-bold text-orange-600">
                {results.energyConsumptionPerYear.toFixed(0)}
                kWh
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
