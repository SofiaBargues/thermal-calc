import { Results } from "@/types/interfaces";

const efficiencyLevels = [
  {
    rating: "A",
    range: "92+",
    color: "#22c55e",
    width: "35%",
    min: 92,
    max: 100,
  },
  {
    rating: "B",
    range: "81-91",
    color: "#16a34a",
    width: "45%",
    min: 81,
    max: 91,
  },
  {
    rating: "C",
    range: "69-80",
    color: "#84cc16",
    width: "55%",
    min: 69,
    max: 80,
  },
  {
    rating: "D",
    range: "55-68",
    color: "#eab308",
    width: "70%",
    min: 55,
    max: 68,
  },
  {
    rating: "E",
    range: "39-54",
    color: "#f97316",
    width: "80%",
    min: 39,
    max: 54,
  },
  {
    rating: "F",
    range: "21-38",
    color: "#ef4444",
    width: "90%",
    min: 21,
    max: 38,
  },
  {
    rating: "G",
    range: "1-20",
    color: "#dc2626",
    width: "100%",
    min: 1,
    max: 20,
  },
];
export function EnergyEfficiency({ results }: { results: Results }) {
  return (
    <div className="space-y-1 sm:space-y-1.5 pr-8 sm:pr-12 mb-2 sm:mb-4 flex-shrink-0">
      {(() => {
        const currentScore = results.currentEnergyScore;

        return efficiencyLevels.map((level) => {
          const isCurrentRating =
            currentScore >= level.min && currentScore <= level.max;

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
          );
        });
      })()}
    </div>
  );
}
