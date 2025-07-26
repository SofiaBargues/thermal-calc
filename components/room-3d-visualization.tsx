"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Box, Plane } from "@react-three/drei"
import type * as THREE from "three"
import type { RoomData, Results } from "@/types/interfaces"

interface Room3DVisualizationProps {
  roomData: RoomData
  results?: Results
}

function Room3D({ roomData, results }: { roomData: RoomData; results?: Results }) {
  const groupRef = useRef<THREE.Group>(null)
  const { dimensions, walls, windows, door, roof, adjacentAreas } = roomData

  // Calculate thermal efficiency colors
  const getEfficiencyColor = (uValue: number) => {
    if (uValue < 1.0) return "#22c55e" // Green - Excellent
    if (uValue < 2.0) return "#eab308" // Yellow - Good
    if (uValue < 3.0) return "#f97316" // Orange - Fair
    return "#ef4444" // Red - Poor
  }

  const wallColor = results ? getEfficiencyColor(results.currentUValue) : "#f97316"
  const improvedWallColor = results ? getEfficiencyColor(results.improvedUValue) : "#22c55e"
  const adjacentColor = "#94a3b8" // Gray for adjacent areas

  // Limited rotation to maintain isometric perspective
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.15
    }
  })

  // Add validation for dimensions
  if (dimensions.length <= 0 || dimensions.width <= 0 || dimensions.height <= 0) {
    return null
  }

  // Door configuration
  const doorXPosition = 0 // Center of the front wall
  const doorZPosition = -dimensions.width / 2 - walls.thickness / 2 - 0.01

  // Get available walls for windows (non-adjacent walls)
  const getAvailableWalls = () => {
    const availableWalls = []

    // Front wall (only if not adjacent) - always has door
    if (!adjacentAreas?.front) {
      availableWalls.push({
        id: "front",
        length: dimensions.length,
        hasDoor: true,
        doorPosition: doorXPosition,
        doorWidth: door.width,
        getPosition: (x: number) => [x, 0.9 + windows.height / 2, doorZPosition],
        getRotation: () => [0, 0, 0],
      })
    }

    // Back wall (only if not adjacent)
    if (!adjacentAreas?.back) {
      availableWalls.push({
        id: "back",
        length: dimensions.length,
        hasDoor: false,
        doorPosition: 0,
        doorWidth: 0,
        getPosition: (x: number) => [x, 0.9 + windows.height / 2, dimensions.width / 2 + walls.thickness / 2 + 0.01],
        getRotation: () => [0, Math.PI, 0],
      })
    }

    // Left wall (only if not adjacent)
    if (!adjacentAreas?.left) {
      availableWalls.push({
        id: "left",
        length: dimensions.width,
        hasDoor: false,
        doorPosition: 0,
        doorWidth: 0,
        getPosition: (z: number) => [-dimensions.length / 2 - walls.thickness / 2 - 0.01, 0.9 + windows.height / 2, z],
        getRotation: () => [0, Math.PI / 2, 0],
      })
    }

    // Right wall (only if not adjacent)
    if (!adjacentAreas?.right) {
      availableWalls.push({
        id: "right",
        length: dimensions.width,
        hasDoor: false,
        doorPosition: 0,
        doorWidth: 0,
        getPosition: (z: number) => [dimensions.length / 2 + walls.thickness / 2 + 0.01, 0.9 + windows.height / 2, z],
        getRotation: () => [0, -Math.PI / 2, 0],
      })
    }

    return availableWalls
  }

  // Calculate window positions across all available walls
  const getWindowPositions = () => {
    if (windows.count === 0) return []

    const availableWalls = getAvailableWalls()
    const windowPositions = []

    // Calculate total available space across all walls
    let totalAvailableSpace = 0
    const wallSpaces = availableWalls.map((wall) => {
      let availableSpace = wall.length - 0.4 // 20cm margin on each side

      if (wall.hasDoor) {
        // Subtract door space and margins
        availableSpace -= wall.doorWidth + 0.4 // Door + 20cm margin on each side
      }

      totalAvailableSpace += Math.max(0, availableSpace)
      return {
        ...wall,
        availableSpace: Math.max(0, availableSpace),
        maxWindows: Math.floor(Math.max(0, availableSpace) / (windows.width + 0.2)), // Minimum 20cm between windows
      }
    })

    // Distribute windows proportionally across walls
    let remainingWindows = windows.count
    let wallIndex = 0

    for (const wall of wallSpaces) {
      if (remainingWindows <= 0 || wall.maxWindows <= 0) continue

      // Calculate how many windows to place on this wall
      const windowsOnThisWall = Math.min(
        remainingWindows,
        Math.max(1, Math.floor((wall.availableSpace / totalAvailableSpace) * windows.count)),
        wall.maxWindows,
      )

      // Calculate positions on this wall
      if (wall.hasDoor) {
        // Front wall with door - distribute around door
        const doorLeftEdge = wall.doorPosition - wall.doorWidth / 2 - 0.2
        const doorRightEdge = wall.doorPosition + wall.doorWidth / 2 + 0.2
        const wallStart = -wall.length / 2
        const wallEnd = wall.length / 2

        const leftSpace = doorLeftEdge - wallStart - 0.2
        const rightSpace = wallEnd - doorRightEdge - 0.2

        const leftWindows = Math.floor((leftSpace / (leftSpace + rightSpace)) * windowsOnThisWall)
        const rightWindows = windowsOnThisWall - leftWindows

        // Place windows on left side of door
        if (leftWindows > 0 && leftSpace >= windows.width) {
          const spacing = leftSpace / (leftWindows + 1)
          for (let i = 0; i < leftWindows; i++) {
            const x = wallStart + 0.2 + spacing * (i + 1)
            windowPositions.push({
              position: wall.getPosition(x),
              rotation: wall.getRotation(),
              wall: wall.id,
            })
          }
        }

        // Place windows on right side of door
        if (rightWindows > 0 && rightSpace >= windows.width) {
          const spacing = rightSpace / (rightWindows + 1)
          for (let i = 0; i < rightWindows; i++) {
            const x = doorRightEdge + spacing * (i + 1)
            windowPositions.push({
              position: wall.getPosition(x),
              rotation: wall.getRotation(),
              wall: wall.id,
            })
          }
        }
      } else {
        // Regular wall without door
        const wallStart = -wall.length / 2
        const spacing = wall.length / (windowsOnThisWall + 1)

        for (let i = 0; i < windowsOnThisWall; i++) {
          const pos = wallStart + spacing * (i + 1)
          windowPositions.push({
            position: wall.getPosition(pos),
            rotation: wall.getRotation(),
            wall: wall.id,
          })
        }
      }

      remainingWindows -= windowsOnThisWall
      wallIndex++
    }

    return windowPositions
  }

  const windowPositions = getWindowPositions()

  return (
    <group ref={groupRef}>
      {/* Cast Shadow */}
      <Plane
        args={[dimensions.length * 2, dimensions.width * 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[dimensions.length * 0.3, -0.01, dimensions.width * 0.3]}
      >
        <meshStandardMaterial color="#000000" opacity={0.1} transparent />
      </Plane>

      {/* Floor */}
      <Plane args={[dimensions.length, dimensions.width]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color={adjacentAreas?.floor ? adjacentColor : "#e5e7eb"} opacity={0.8} transparent />
      </Plane>

      {/* Walls */}
      {/* Front Wall */}
      <Box
        args={[dimensions.length, dimensions.height, walls.thickness]}
        position={[0, dimensions.height / 2, -dimensions.width / 2]}
      >
        <meshStandardMaterial color={adjacentAreas?.front ? adjacentColor : wallColor} opacity={0.9} transparent />
      </Box>

      {/* Back Wall */}
      <Box
        args={[dimensions.length, dimensions.height, walls.thickness]}
        position={[0, dimensions.height / 2, dimensions.width / 2]}
      >
        <meshStandardMaterial color={adjacentAreas?.back ? adjacentColor : wallColor} opacity={0.9} transparent />
      </Box>

      {/* Left Wall */}
      <Box
        args={[walls.thickness, dimensions.height, dimensions.width]}
        position={[-dimensions.length / 2, dimensions.height / 2, 0]}
      >
        <meshStandardMaterial color={adjacentAreas?.left ? adjacentColor : wallColor} opacity={0.9} transparent />
      </Box>

      {/* Right Wall */}
      <Box
        args={[walls.thickness, dimensions.height, dimensions.width]}
        position={[dimensions.length / 2, dimensions.height / 2, 0]}
      >
        <meshStandardMaterial color={adjacentAreas?.right ? adjacentColor : wallColor} opacity={0.9} transparent />
      </Box>

      {/* Roof */}
      <Box
        args={[dimensions.length, roof.thickness, dimensions.width]}
        position={[0, dimensions.height + roof.thickness / 2, 0]}
      >
        <meshStandardMaterial color={adjacentAreas?.ceiling ? adjacentColor : wallColor} opacity={0.9} transparent />
      </Box>

      {/* Windows - Distributed across available walls */}
      {windowPositions.map((windowData, index) => (
        <Box
          key={index}
          args={[windows.width, windows.height, 0.1]}
          position={windowData.position as [number, number, number]}
          rotation={windowData.rotation as [number, number, number]}
        >
          <meshStandardMaterial color="#3b82f6" />
        </Box>
      ))}

      {/* Door - Always present on front wall */}
      <Box args={[door.width, door.height, 0.1]} position={[doorXPosition, door.height / 2, doorZPosition]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>

      {/* Insulation Layer (if improved) */}
      {walls.insulation !== "none" && walls.insulationThickness > 0 && (
        <>
          {/* Front Wall Insulation */}
          <Box
            args={[dimensions.length, dimensions.height, walls.insulationThickness]}
            position={[
              0,
              dimensions.height / 2,
              -dimensions.width / 2 - walls.thickness / 2 - walls.insulationThickness / 2,
            ]}
          >
            <meshStandardMaterial color={improvedWallColor} opacity={0.3} transparent />
          </Box>

          {/* Back Wall Insulation */}
          <Box
            args={[dimensions.length, dimensions.height, walls.insulationThickness]}
            position={[
              0,
              dimensions.height / 2,
              dimensions.width / 2 + walls.thickness / 2 + walls.insulationThickness / 2,
            ]}
          >
            <meshStandardMaterial color={improvedWallColor} opacity={0.3} transparent />
          </Box>

          {/* Left Wall Insulation (only if not adjacent) */}
          {!adjacentAreas?.left && (
            <Box
              args={[walls.insulationThickness, dimensions.height, dimensions.width]}
              position={[
                -dimensions.length / 2 - walls.thickness / 2 - walls.insulationThickness / 2,
                dimensions.height / 2,
                0,
              ]}
            >
              <meshStandardMaterial color={improvedWallColor} opacity={0.3} transparent />
            </Box>
          )}

          {/* Right Wall Insulation (only if not adjacent) */}
          {!adjacentAreas?.right && (
            <Box
              args={[walls.insulationThickness, dimensions.height, dimensions.width]}
              position={[
                dimensions.length / 2 + walls.thickness / 2 + walls.insulationThickness / 2,
                dimensions.height / 2,
                0,
              ]}
            >
              <meshStandardMaterial color={improvedWallColor} opacity={0.3} transparent />
            </Box>
          )}
        </>
      )}
    </group>
  )
}

export default function Room3DVisualization({ roomData, results }: Room3DVisualizationProps) {
  return (
    <div className="h-full w-full bg-gradient-to-b from-gray-100 to-gray-200">
      <Canvas camera={{ position: [8, 6, 8], fov: 50 }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.4} />

        <Room3D roomData={roomData} results={results} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>
    </div>
  )
}
