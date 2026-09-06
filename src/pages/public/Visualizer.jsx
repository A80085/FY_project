import React from "react";
import RoomVisualizer from "@/components/visualizer/RoomVisualizer";

export default function Visualizer() {
  return (
    <div className="pt-28 pb-24">
      <div className="container-px max-w-7xl mx-auto">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow text-accent mb-3">3D Room Visualiser</p>
          <h1 className="font-display text-4xl sm:text-5xl text-primary font-bold">Picture it finished.</h1>
          <p className="mt-3 text-muted-foreground">
            Choose a room template, then swap floors, walls, upholstery and cabinetry to the finishes we
            stock. Drag to orbit, scroll to zoom.
          </p>
        </div>
        <RoomVisualizer />
      </div>
    </div>
  );
}
