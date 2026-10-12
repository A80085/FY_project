import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Maximize2, RotateCw, Sun, RefreshCw, Hand } from "lucide-react";
import { productService } from "@/services/productService";
import { BUILTIN_SLOTS, CATALOG_TO_SLOT, COLOR_FAMILY_MAP, FINISH_MAP } from "./constants";
import VisualizerControls from "./VisualizerControls";
import VisualizerCanvas from "./VisualizerCanvas";

const ROOMS = {
  living: { name: "Living Room" },
  bedroom: { name: "Bedroom" },
  kitchen: { name: "Modular Kitchen" },
};

// Circular dual-arrow rotation icon matching CAD / 3D orbit standard
function OrbitIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M 5 12 A 7 7 0 0 1 18 7" />
      <polygon points="18.5,7 13.5,6.2 16.5,10.8" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
      <path d="M 19 12 A 7 7 0 0 1 6 17" />
      <polygon points="5.5,17 10.5,17.8 7.5,13.2" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}

export default function RoomVisualizer() {
  const [room, setRoom] = useState("living");
  const [activeSlot, setActiveSlot] = useState("walls");
  const [selections, setSelections] = useState({ floor: 0, walls: 0, primary: 0, cabinetry: 1 });
  const [autoRotate, setAutoRotate] = useState(false);
  const [lighting, setLighting] = useState("warm");
  const [interactionMode, setInteractionMode] = useState("orbit"); // "orbit" | "hand"
  const [slotSwatches, setSlotSwatches] = useState(() => {
    const o = {};
    Object.keys(BUILTIN_SLOTS).forEach((k) => (o[k] = BUILTIN_SLOTS[k].swatches.slice()));
    return o;
  });
  const [catalogCount, setCatalogCount] = useState(0);

  const canvasRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setInteractionMode("hand");
      } else if (e.key.toLowerCase() === "h") {
        setInteractionMode("hand");
      } else if (e.key.toLowerCase() === "o" || e.key.toLowerCase() === "r") {
        setInteractionMode("orbit");
      }
    };
    const handleKeyUp = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        setInteractionMode("orbit");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    productService.list("-created_date", 200)
      .then((products) => {
        if (!mounted) return;
        let count = 0;
        setSlotSwatches((prev) => {
          const next = { ...prev };
          Object.keys(next).forEach((k) => (next[k] = BUILTIN_SLOTS[k].swatches.slice()));
          Object.entries(CATALOG_TO_SLOT).forEach(([slot, cats]) => {
            products.forEach((p) => {
              if (!cats.includes(p.category)) return;
              const color = COLOR_FAMILY_MAP[p.color_family];
              if (!color) return;
              const finish = FINISH_MAP[p.finish] || "matt";
              next[slot].push({ name: p.name, color, finish, fromCatalog: true, price: p.price, unit: p.unit, sku: p.sku });
              count++;
            });
          });
          return next;
        });
        setCatalogCount(count);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  function applySwatch(idx) {
    setSelections((s) => ({ ...s, [activeSlot]: idx }));
  }

  const SLOT_FINISH = { floor: "wood", walls: "matt", primary: "fabric", cabinetry: "matt" };

  function onUploadTexture(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const slot = activeSlot;
    const idx = slotSwatches[slot].length;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const tex = new THREE.Texture(img);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.anisotropy = 8;
        tex.needsUpdate = true;
        tex.userData = { custom: true };
        setSlotSwatches((prev) => {
          const list = prev[slot].slice();
          list.push({ name: "Your texture", color: "#cccccc", finish: SLOT_FINISH[slot], customTex: tex, customThumb: reader.result });
          return { ...prev, [slot]: list };
        });
        setSelections((s) => ({ ...s, [slot]: idx }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">
      <div className="relative rounded-sm overflow-hidden border border-border bg-muted shadow-sm">
        <VisualizerCanvas 
          ref={canvasRef}
          room={room}
          selections={selections}
          slotSwatches={slotSwatches}
          autoRotate={autoRotate}
          lighting={lighting}
          interactionMode={interactionMode}
        />

        {/* Top bar: Room selection pills + Orbit/Hand tool selector */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-3 z-10">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {Object.entries(ROOMS).map(([key, r]) => (
                <button
                  key={key}
                  onClick={() => setRoom(key)}
                  className={`px-3 py-1.5 text-xs font-semibold tracking-wide rounded-sm border shrink-0 transition-colors shadow-xs ${
                    room === key ? "bg-primary text-primary-foreground border-primary" : "bg-background/90 backdrop-blur border-border hover:border-accent text-foreground"
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Switcher: Orbit vs Hand Grab Tool */}
          <div className="flex items-center gap-0.5 shrink-0 bg-background/90 backdrop-blur border border-border p-0.5 rounded-sm shadow-xs pointer-events-auto">
            <button
              type="button"
              aria-label="Orbit 3D room rotation"
              title="Orbit Mode (Rotate 360° around space) [O / R]"
              onClick={() => setInteractionMode("orbit")}
              className={`flex items-center gap-1 text-[11px] sm:text-xs px-2 py-1 rounded-xs font-medium transition-all ${
                interactionMode === "orbit"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <OrbitIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Orbit</span>
            </button>
            <button
              type="button"
              aria-label="Hand grab and move across 3D models"
              title="Hand Tool (Click & drag to grab and move across models) [H or Hold Space]"
              onClick={() => setInteractionMode("hand")}
              className={`flex items-center gap-1 text-[11px] sm:text-xs px-2 py-1 rounded-xs font-medium transition-all ${
                interactionMode === "hand"
                  ? "bg-accent text-accent-foreground shadow-xs font-semibold"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Hand className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Hand Move</span>
            </button>
          </div>
        </div>

        {/* Floating helper pill when Hand mode is active */}
        {interactionMode === "hand" && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 pointer-events-none z-10 transition-all">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/80 backdrop-blur-md text-white text-[11px] rounded-full border border-white/10 shadow-lg tracking-wide font-medium whitespace-nowrap">
              <Hand className="h-3.5 w-3.5 text-accent animate-pulse" />
              <span>Hand Mode: Click &amp; drag to grab and move across space</span>
            </div>
          </div>
        )}

        {/* Bottom bar controls — single row, never wraps */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-10">
          <div className="flex items-center gap-0.5 bg-background/90 backdrop-blur border border-border px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-sm shadow-sm pointer-events-auto">
            {/* Quick Hand/Orbit toggle in bottom toolbar */}
            <button
              aria-label="Toggle Hand / Orbit tool"
              title="Toggle Hand / Orbit mode [Space / H / O]"
              onClick={() => setInteractionMode((m) => (m === "hand" ? "orbit" : "hand"))}
              className={`flex items-center gap-1 text-[11px] sm:text-xs px-1.5 sm:px-2 py-1 rounded-sm font-medium transition-colors ${
                interactionMode === "hand" ? "bg-accent text-accent-foreground font-semibold" : "text-foreground hover:bg-muted"
              }`}
            >
              {interactionMode === "hand" ? (
                <>
                  <Hand className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden xs:inline sm:inline">Hand</span>
                </>
              ) : (
                <>
                  <OrbitIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden xs:inline sm:inline">Orbit</span>
                </>
              )}
            </button>
            <div className="h-3.5 w-px bg-border" />
            <button
              aria-label="Toggle auto-rotate"
              onClick={() => setAutoRotate((v) => !v)}
              className={`flex items-center gap-1 text-[11px] sm:text-xs px-1.5 sm:px-2 py-1 rounded-sm font-medium ${
                autoRotate ? "bg-accent text-accent-foreground" : "text-foreground"
              }`}
            >
              <RotateCw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden xs:inline sm:inline">Rotate</span>
            </button>
            <div className="h-3.5 w-px bg-border" />
            <button
              aria-label="Cycle lighting mode"
              onClick={() => setLighting((l) => (l === "warm" ? "cool" : l === "cool" ? "neutral" : "warm"))}
              className="flex items-center gap-1 text-[11px] sm:text-xs px-1.5 sm:px-2 py-1 rounded-sm capitalize font-medium text-foreground"
            >
              <Sun className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500" />
              <span className="hidden xs:inline sm:inline capitalize">{lighting}</span>
            </button>
            <div className="h-3.5 w-px bg-border" />
            <button
              aria-label="Reset camera view"
              onClick={() => canvasRef.current?.resetView()}
              className="flex items-center gap-1 text-[11px] sm:text-xs px-1.5 sm:px-2 py-1 rounded-sm font-medium text-foreground"
            >
              <RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden xs:inline sm:inline">Reset</span>
            </button>
          </div>
          <button
            aria-label="Toggle fullscreen"
            onClick={() => canvasRef.current?.fullscreen()}
            className="flex items-center gap-1 text-[11px] sm:text-xs bg-background/90 backdrop-blur border border-border px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-sm hover:border-accent font-medium shadow-sm pointer-events-auto text-foreground"
          >
            <Maximize2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Full</span>
          </button>
        </div>
      </div>

      <VisualizerControls 
        catalogCount={catalogCount}
        activeSlot={activeSlot}
        setActiveSlot={setActiveSlot}
        slotSwatches={slotSwatches}
        selections={selections}
        applySwatch={applySwatch}
        onUploadTexture={onUploadTexture}
      />
    </div>
  );
}
