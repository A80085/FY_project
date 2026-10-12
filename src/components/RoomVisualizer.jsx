import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Maximize2, RotateCw, Sun, RefreshCw, Hand, Camera } from "lucide-react";
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
      if (typeof reader.result !== "string") return;
      const resultStr = reader.result;
      const img = new Image();
      img.onload = () => {
        const tex = new THREE.Texture(img);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.anisotropy = 8;
        tex.needsUpdate = true;
        tex.userData = { custom: true };
        setSlotSwatches((prev) => {
          const list = prev[slot].slice();
          list.push({ name: "Your texture", color: "#cccccc", finish: SLOT_FINISH[slot], customTex: tex, customThumb: resultStr });
          return { ...prev, [slot]: list };
        });
        setSelections((s) => ({ ...s, [slot]: idx }));
      };
      img.src = resultStr;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
      <div className="relative rounded-2xl overflow-hidden border border-border/80 bg-muted shadow-xl">
        <VisualizerCanvas 
          ref={canvasRef}
          room={room}
          selections={selections}
          slotSwatches={slotSwatches}
          autoRotate={autoRotate}
          lighting={lighting}
          interactionMode={interactionMode}
        />

        {/* Top bar: Room selection pills */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 z-10 pointer-events-none">
          <div className="min-w-0 flex-1 pointer-events-auto">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
              {Object.entries(ROOMS).map(([key, r]) => (
                <button
                  key={key}
                  onClick={() => setRoom(key)}
                  className={`px-4 py-2 text-xs font-semibold tracking-wide rounded-full border shrink-0 transition-all shadow-sm ${
                    room === key
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card/90 backdrop-blur-md border-border/70 hover:border-accent text-foreground hover:bg-card"
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-md border border-border/60 text-[11px] font-medium text-foreground shadow-sm pointer-events-auto">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive 3D WebGL</span>
          </div>
        </div>

        {/* Bottom bar controls: Unified Studio CAD Toolbar */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-end gap-2 pointer-events-none z-10">
          <div className="flex items-center gap-1 sm:gap-1.5 bg-card/95 backdrop-blur-md border border-border/80 p-1.5 rounded-2xl shadow-xl pointer-events-auto max-w-full overflow-x-auto no-scrollbar">
            {/* Mode Selector Segment: Orbit & Hand Move */}
            <div className="flex items-center gap-0.5 bg-muted/70 p-1 rounded-xl shrink-0">
              <button
                type="button"
                aria-label="Orbit 3D camera"
                title="Orbit Mode: Rotate 360° around space [O]"
                onClick={() => setInteractionMode("orbit")}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  interactionMode === "orbit"
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-foreground hover:bg-background/80"
                }`}
              >
                <OrbitIcon className="h-3.5 w-3.5" />
                <span>Orbit</span>
              </button>
              <button
                type="button"
                aria-label="Hand Pan and Move camera"
                title="Hand Move Mode: Click & drag to grab and pan across models [H / Space]"
                onClick={() => setInteractionMode("hand")}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  interactionMode === "hand"
                    ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                    : "text-foreground hover:bg-background/80"
                }`}
              >
                <Hand className="h-3.5 w-3.5" />
                <span className="hidden xs:inline sm:inline">Hand Move</span>
                <span className="xs:hidden">Hand</span>
              </button>
            </div>

            <div className="h-4 w-px bg-border shrink-0" />

            {/* Auto-Rotate */}
            <button
              type="button"
              aria-label="Toggle continuous auto-rotation"
              title="Toggle continuous room rotation"
              onClick={() => setAutoRotate((v) => !v)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                autoRotate
                  ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? "animate-spin" : ""}`} />
              <span className="hidden xs:inline sm:inline">Rotate</span>
            </button>

            <div className="h-4 w-px bg-border shrink-0" />

            {/* Lighting Preset */}
            <button
              type="button"
              aria-label="Cycle lighting ambience"
              title={`Lighting: ${lighting} (Click to switch Warm / Cool / Neutral)`}
              onClick={() => setLighting((l) => (l === "warm" ? "cool" : l === "cool" ? "neutral" : "warm"))}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium text-foreground hover:bg-muted transition-all shrink-0"
            >
              <Sun className={`h-3.5 w-3.5 ${lighting === "warm" ? "text-amber-500" : lighting === "cool" ? "text-blue-400" : "text-amber-200"}`} />
              <span className="hidden xs:inline sm:inline capitalize">{lighting}</span>
            </button>

            <div className="h-4 w-px bg-border shrink-0" />

            {/* Reset View */}
            <button
              type="button"
              aria-label="Reset camera view"
              title="Reset view to default angle"
              onClick={() => canvasRef.current?.resetView()}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium text-foreground hover:bg-muted transition-all shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden xs:inline sm:inline">Reset</span>
            </button>

            <div className="h-4 w-px bg-border shrink-0" />

            {/* Snapshot */}
            <button
              type="button"
              aria-label="Save snapshot of your design"
              title="Take a high-resolution snapshot of this room design"
              onClick={() => canvasRef.current?.takeSnapshot()}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium text-foreground hover:bg-muted transition-all shrink-0"
            >
              <Camera className="h-3.5 w-3.5 text-foreground" />
              <span className="hidden sm:inline">Snapshot</span>
            </button>

            <div className="h-4 w-px bg-border shrink-0" />

            {/* Fullscreen */}
            <button
              type="button"
              aria-label="Toggle fullscreen"
              title="Toggle full screen immersion"
              onClick={() => canvasRef.current?.fullscreen()}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium text-foreground hover:bg-muted transition-all shrink-0"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Full</span>
            </button>
          </div>
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
