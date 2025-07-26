import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, AlertTriangle, CheckCircle } from "lucide-react"
import type { Results, RoomData } from "@/types/interfaces"
import { insulationMaterials } from "@/data/materials"

interface RecommendationsProps {
  results: Results
  roomData: RoomData
}

export default function Recommendations({ results, roomData }: RecommendationsProps) {
  const getRecommendations = () => {
    const recommendations = []

    // U-Value recommendations
    if (results.currentUValue > 2.0) {
      recommendations.push({
        type: "warning",
        title: "Insufficient Insulation",
        description: "The U-coefficient is high. Improving thermal insulation is recommended.",
        priority: "High",
      })
    } else if (results.currentUValue > 1.0) {
      recommendations.push({
        type: "info",
        title: "Moderate Insulation",
        description: "Insulation is acceptable but can be improved for better efficiency.",
        priority: "Medium",
      })
    } else {
      recommendations.push({
        type: "success",
        title: "Excellent Insulation",
        description: "Thermal insulation meets high efficiency standards.",
        priority: "Low",
      })
    }

    // Window recommendations
    if (roomData.windows.count > 0) {
      const windowArea = roomData.windows.count * roomData.windows.width * roomData.windows.height
      const totalWallArea = 2 * (roomData.dimensions.length + roomData.dimensions.width) * roomData.dimensions.height
      const windowRatio = windowArea / totalWallArea

      if (windowRatio > 0.4) {
        recommendations.push({
          type: "warning",
          title: "Many Windows",
          description: "Window area is high. Consider better quality glass.",
          priority: "Medium",
        })
      }
    }

    // Material cost recommendations
    const currentInsulation = insulationMaterials.find((m) => m.id === roomData.walls.insulation)
    if (currentInsulation && currentInsulation.cost > 20) {
      recommendations.push({
        type: "info",
        title: "Economic Alternatives",
        description: "Consider more economical insulation materials like EPS or fiberglass.",
        priority: "Low",
      })
    }

    return recommendations
  }

  const recommendations = getRecommendations()

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Lightbulb className="h-4 w-4 text-blue-500" />
    }
  }

  const getBadgeVariant = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Recommendations
        </CardTitle>
        <CardDescription>Suggestions to improve your room's thermal efficiency</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
              {getIcon(rec.type)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                  <Badge variant={getBadgeVariant(rec.priority)} className="text-xs">
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">💡 Additional Tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Consider room orientation when planning improvements</li>
            <li>• Controlled ventilation is important to avoid humidity</li>
            <li>• Thermal bridges can reduce insulation efficiency</li>
            <li>• Consult a professional for complex installations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
