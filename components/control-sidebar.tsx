"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { RoomData, Results } from "@/types/interfaces";
import {
  wallMaterials,
  insulationMaterials,
  windowTypes,
  roofMaterials,
  floorMaterials,
  doorTypes,
} from "@/data/materials";
import CustomSlider from "./custom-slider";

export default function ControlSidebar({
  roomData,
  onUpdateRoomData,
}: {
  roomData: RoomData;
  onUpdateRoomData: (section: keyof RoomData, data: any) => void;
}) {
  const getMaxWindows = () => {
    const availableWalls = [];

    // Only add walls that are NOT adjacent areas
    if (!roomData.adjacentAreas?.front) {
      // Front wall has door, so less space available
      availableWalls.push(
        Math.max(0, roomData.dimensions.length - roomData.door.width - 0.6)
      ); // Door + margins
    }
    if (!roomData.adjacentAreas?.back) {
      availableWalls.push(Math.max(0, roomData.dimensions.length - 0.4)); // Margin space
    }
    if (!roomData.adjacentAreas?.left) {
      availableWalls.push(Math.max(0, roomData.dimensions.width - 0.4)); // Margin space
    }
    if (!roomData.adjacentAreas?.right) {
      availableWalls.push(Math.max(0, roomData.dimensions.width - 0.4)); // Margin space
    }

    const totalSpace = availableWalls.reduce((sum, space) => sum + space, 0);
    return Math.max(0, Math.floor(totalSpace / (roomData.windows.width + 0.2)));
  };

  const maxWindows = getMaxWindows();

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Tabs - Full height - Responsive */}
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs defaultValue="room" className="h-full flex flex-col min-h-0">
          {/* Tab Headers - Responsive */}
          <div className="border-b border-gray-200 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-3 h-8 sm:h-10 bg-transparent p-0">
              <TabsTrigger
                value="room"
                className="text-xs font-medium  data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none  rounded-tl-md h-full px-1 sm:px-2"
              >
                Room
              </TabsTrigger>
              <TabsTrigger
                value="windows-doors"
                className="text-xs font-medium  data-[state=active]:text-green-700 data-[state=active]:border-b-2 data-[state=active]:border-green-500 rounded-none h-full px-1 sm:px-2"
              >
                Windows & Doors
              </TabsTrigger>
              <TabsTrigger
                value="roof-floor"
                className="text-xs font-medium  data-[state=active]:text-purple-700 data-[state=active]:border-b-2  data-[state=active]:border-purple-500 rounded-none rounded-tr-md  h-full px-1 sm:px-2"
              >
                Roof & Floor
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content - Responsive spacing with proper scrolling */}
          <div className="flex-1 overflow-hidden min-h-0">
            {/* Room Tab */}
            <TabsContent
              value="room"
              className="h-full overflow-y-auto bg-blue-50/30 m-0 p-2 sm:p-3 space-y-2 sm:space-y-3"
            >
              {/* Room Dimensions */}
              <div className="bg-white rounded-lg p-2 border border-blue-200 flex-shrink-0">
                <h3 className="font-medium text-blue-900 mb-2 text-sm">
                  Room Dimensions
                </h3>
                <div className="space-y-2">
                  <CustomSlider
                    label={"Length"}
                    displayValue={roomData.dimensions.length + "m"}
                    value={roomData.dimensions.length}
                    onValueChange={(value) =>
                      onUpdateRoomData("dimensions", { length: value })
                    }
                    min={2}
                    max={15}
                    step={0.5}
                  />
                  <CustomSlider
                    label={"Width"}
                    displayValue={roomData.dimensions.width + "m"}
                    value={roomData.dimensions.width}
                    onValueChange={(value) =>
                      onUpdateRoomData("dimensions", { width: value })
                    }
                    min={2}
                    max={15}
                    step={0.5}
                  />
                  <CustomSlider
                    label={"Height"}
                    displayValue={roomData.dimensions.height + "m"}
                    value={roomData.dimensions.height}
                    onValueChange={(value) =>
                      onUpdateRoomData("dimensions", { height: value })
                    }
                    min={2.2}
                    max={4}
                    step={0.1}
                  />
                </div>
              </div>

              {/* Adjacent Areas - Responsive grid */}
              <div className="bg-white rounded-lg p-2 border border-blue-200 flex-shrink-0">
                <h3 className="font-medium text-blue-900 mb-2 text-sm">
                  Adjacent Areas
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-1">
                  {[
                    { key: "front", label: "Front" },
                    { key: "back", label: "Back" },
                    { key: "left", label: "Left" },
                    { key: "right", label: "Right" },
                    { key: "ceiling", label: "Ceiling" },
                    { key: "floor", label: "Floor" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={
                          roomData.adjacentAreas?.[
                            key as keyof typeof roomData.adjacentAreas
                          ] || false
                        }
                        onChange={(e) =>
                          onUpdateRoomData("adjacentAreas", {
                            ...roomData.adjacentAreas,
                            [key]: e.target.checked,
                          })
                        }
                        className="rounded w-3 h-3"
                      />
                      <Label className="text-gray-600">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wall Configuration */}
              <div className="bg-white rounded-lg p-2 border border-blue-200 flex-shrink-0">
                <h3 className="font-medium text-blue-900 mb-2 text-sm">
                  Wall Configuration
                </h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-600">Material:</Label>
                    <Select
                      value={roomData.walls.material}
                      onValueChange={(value) =>
                        onUpdateRoomData("walls", { material: value })
                      }
                    >
                      <SelectTrigger className="mt-1 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {wallMaterials.map((material) => (
                          <SelectItem
                            key={material.id}
                            value={material.id}
                            className="text-xs"
                          >
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <CustomSlider
                    label="Thickness"
                    displayValue={roomData.walls.thickness.toFixed(2) + "m"}
                    value={roomData.walls.thickness}
                    onValueChange={(value) =>
                      onUpdateRoomData("walls", { thickness: value })
                    }
                    min={0.1}
                    max={0.5}
                    step={0.01}
                  />

                  <div>
                    <Label className="text-xs text-gray-600">Insulation:</Label>
                    <Select
                      value={roomData.walls.insulation}
                      onValueChange={(value) => {
                        onUpdateRoomData("walls", {
                          insulation: value,
                          insulationThickness:
                            value === "none"
                              ? 0
                              : roomData.walls.insulationThickness,
                        });
                      }}
                    >
                      <SelectTrigger className="mt-1 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {insulationMaterials.map((material) => (
                          <SelectItem
                            key={material.id}
                            value={material.id}
                            className="text-xs"
                          >
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {roomData.walls.insulation !== "none" && (
                    <CustomSlider
                      label="Insulation Thickness"
                      displayValue={
                        roomData.walls.insulationThickness.toFixed(2) + "m"
                      }
                      value={roomData.walls.insulationThickness}
                      onValueChange={(value) =>
                        onUpdateRoomData("walls", {
                          insulationThickness: value,
                        })
                      }
                      min={0.01}
                      max={0.2}
                      step={0.01}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Windows and Doors Tab */}
            <TabsContent
              value="windows-doors"
              className="h-full overflow-y-auto bg-green-50/30 m-0 p-2 sm:p-3 space-y-2 sm:space-y-3"
            >
              {/* Windows */}
              <div className="bg-white rounded-lg p-2 border border-green-200 flex-shrink-0">
                <h3 className="font-medium text-green-900 mb-2 text-sm">
                  Windows
                </h3>
                <div className="space-y-2">
                  <CustomSlider
                    label="Count"
                    displayValue={roomData.windows.count + "/" + maxWindows}
                    value={roomData.windows.count}
                    onValueChange={(value) =>
                      onUpdateRoomData("windows", {
                        count: Math.round(value),
                      })
                    }
                    min={0}
                    max={maxWindows}
                    step={1}
                  />
                  {maxWindows === 0 && (
                    <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                      No windows can be placed. All available walls are adjacent
                      areas.
                    </div>
                  )}
                  <CustomSlider
                    label="Width"
                    displayValue={roomData.windows.width.toFixed(1) + "m"}
                    value={roomData.windows.width}
                    onValueChange={(value) =>
                      onUpdateRoomData("windows", { width: value })
                    }
                    min={0.5}
                    max={3}
                    step={0.1}
                  />
                  <CustomSlider
                    label="Height"
                    displayValue={roomData.windows.height.toFixed(1) + "m"}
                    value={roomData.windows.height}
                    onValueChange={(value) =>
                      onUpdateRoomData("windows", { height: value })
                    }
                    min={0.5}
                    max={Math.min(roomData.dimensions.height - 1.2, 2.5)}
                    step={0.1}
                  />

                  <div>
                    <Label className="text-xs text-gray-600">Glass Type:</Label>
                    <Select
                      value={roomData.windows.type}
                      onValueChange={(value) =>
                        onUpdateRoomData("windows", { type: value })
                      }
                    >
                      <SelectTrigger className="mt-1 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {windowTypes.map((type) => (
                          <SelectItem
                            key={type.id}
                            value={type.id}
                            className="text-xs"
                          >
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Door Configuration */}
              <div className="bg-white rounded-lg p-2 border border-green-200 flex-shrink-0">
                <h3 className="font-medium text-green-900 mb-2 text-sm">
                  Door (Always on Front Wall)
                </h3>
                <div className="space-y-2">
                  <CustomSlider
                    label="Width"
                    displayValue={roomData.door.width.toFixed(1) + "m"}
                    value={roomData.door.width}
                    onValueChange={(value) =>
                      onUpdateRoomData("door", { width: value })
                    }
                    min={0.7}
                    max={1.2}
                    step={0.1}
                  />
                  <CustomSlider
                    label="Height"
                    displayValue={roomData.door.height.toFixed(1) + "m"}
                    value={roomData.door.height}
                    onValueChange={(value) =>
                      onUpdateRoomData("door", { height: value })
                    }
                    min={1.8}
                    max={2.5}
                    step={0.1}
                  />

                  <div>
                    <Label className="text-xs text-gray-600">Door Type:</Label>
                    <Select
                      value={roomData.door.type}
                      onValueChange={(value) =>
                        onUpdateRoomData("door", { type: value })
                      }
                    >
                      <SelectTrigger className="mt-1 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {doorTypes.map((type) => (
                          <SelectItem
                            key={type.id}
                            value={type.id}
                            className="text-xs"
                          >
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Roof and Floor Tab */}
            <TabsContent
              value="roof-floor"
              className="h-full overflow-y-auto bg-purple-50/30 m-0 p-2 sm:p-3 space-y-2 sm:space-y-3"
            >
              {/* Roof Configuration */}
              <div className="bg-white rounded-lg p-2 border border-purple-200 flex-shrink-0">
                <h3 className="font-medium text-purple-900 mb-2 text-sm">
                  Roof Configuration
                </h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-600">Material:</Label>
                    <Select
                      value={roomData.roof.material}
                      onValueChange={(value) =>
                        onUpdateRoomData("roof", { material: value })
                      }
                    >
                      <SelectTrigger className="mt-1 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roofMaterials.map((material) => (
                          <SelectItem
                            key={material.id}
                            value={material.id}
                            className="text-xs"
                          >
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <CustomSlider
                    label="Thickness"
                    displayValue={roomData.roof.thickness.toFixed(2) + "m"}
                    value={roomData.roof.thickness}
                    onValueChange={(value) =>
                      onUpdateRoomData("roof", { thickness: value })
                    }
                    min={0.1}
                    max={0.5}
                    step={0.01}
                  />

                  <div>
                    <Label className="text-xs text-gray-600">Insulation:</Label>
                    <Select
                      value={roomData.roof.insulation}
                      onValueChange={(value) => {
                        onUpdateRoomData("roof", {
                          insulation: value,
                          insulationThickness:
                            value === "none"
                              ? 0
                              : roomData.roof.insulationThickness,
                        });
                      }}
                    >
                      <SelectTrigger className="mt-1 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {insulationMaterials.map((material) => (
                          <SelectItem
                            key={material.id}
                            value={material.id}
                            className="text-xs"
                          >
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {roomData.roof.insulation !== "none" && (
                    <CustomSlider
                      label="Insulation Thickness"
                      displayValue={
                        roomData.roof.insulationThickness.toFixed(2) + "m"
                      }
                      value={roomData.roof.insulationThickness}
                      onValueChange={(value) =>
                        onUpdateRoomData("roof", {
                          insulationThickness: value,
                        })
                      }
                      min={0.01}
                      max={0.3}
                      step={0.01}
                    />
                  )}
                </div>
              </div>

              {/* Floor Configuration */}
              <div className="bg-white rounded-lg p-2 border border-purple-200 flex-shrink-0">
                <h3 className="font-medium text-purple-900 mb-2 text-sm">
                  Floor Configuration
                </h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-600">Material:</Label>
                    <Select
                      value={roomData.floor.material}
                      onValueChange={(value) =>
                        onUpdateRoomData("floor", { material: value })
                      }
                    >
                      <SelectTrigger className="mt-1 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {floorMaterials.map((material) => (
                          <SelectItem
                            key={material.id}
                            value={material.id}
                            className="text-xs"
                          >
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <CustomSlider
                    label="Thickness"
                    displayValue={roomData.floor.thickness.toFixed(2) + "m"}
                    value={roomData.floor.thickness}
                    onValueChange={(value) =>
                      onUpdateRoomData("floor", { thickness: value })
                    }
                    min={0.05}
                    max={0.3}
                    step={0.01}
                  />

                  <div>
                    <Label className="text-xs text-gray-600">Insulation:</Label>
                    <Select
                      value={roomData.floor.insulation}
                      onValueChange={(value) => {
                        onUpdateRoomData("floor", {
                          insulation: value,
                          insulationThickness:
                            value === "none"
                              ? 0
                              : roomData.floor.insulationThickness,
                        });
                      }}
                    >
                      <SelectTrigger className="mt-1 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {insulationMaterials.map((material) => (
                          <SelectItem
                            key={material.id}
                            value={material.id}
                            className="text-xs"
                          >
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {roomData.floor.insulation !== "none" && (
                    <>
                      <CustomSlider
                        label="Insulation Thickness"
                        displayValue={
                          roomData.floor.insulationThickness.toFixed(2) + "m"
                        }
                        value={roomData.floor.insulationThickness}
                        onValueChange={(value) =>
                          onUpdateRoomData("floor", {
                            insulationThickness: value,
                          })
                        }
                        min={0.01}
                        max={0.2}
                        step={0.01}
                      />
                    </>
                  )}
                </div>
              </div>
              
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
