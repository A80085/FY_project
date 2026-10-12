import React from "react";
import RoomVisualizer from "@/components/RoomVisualizer";
import PageHero from "@/components/PageHero";
import { CheckCircle2, Sparkles, Compass } from "lucide-react";

export default function Visualizer() {
  return (
    <div className="pb-24 bg-background text-foreground">
      <PageHero
        eyebrow="Interactive 3D Studio"
        title="3D Room Finishes Visualizer"
        description="Explore genuine showroom laminates, veneers, quartz, and cabinetry in interactive 3D spaces. Orbit in 360°, inspect natural and warm lighting scenarios, and preview your custom interior before fabrication."
        image="/images/typology_living_walnut.jpg"
      />

      <div className="container-px max-w-7xl mx-auto pt-8 sm:pt-10">
        {/* Quick studio guidance banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground bg-card border border-border/80 px-4 py-3 rounded-xl shadow-2xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              18mm BWP Marine Substrates
            </span>
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Häfele Soft-Close Fittings
            </span>
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <Sparkles className="h-4 w-4 text-accent shrink-0" />
              180+ Physical Swatches in Virar West
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
            <Compass className="h-3.5 w-3.5 text-accent" />
            <span>Orbit: [O] · Pan: [H / Space] · Zoom: [Scroll]</span>
          </div>
        </div>

        <RoomVisualizer />
      </div>
    </div>
  );
}

