import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Maximize2, RotateCw, Sun, RefreshCw } from "lucide-react";
import { productService } from "@/services/productService";
import { BUILTIN_SLOTS, CATALOG_TO_SLOT, COLOR_FAMILY_MAP, FINISH_MAP } from "./constants";
import VisualizerControls from "./VisualizerControls";
import VisualizerCanvas from "./VisualizerCanvas";

const ROOMS = {
  living: { name: "Living Room" },
  bedroom: { name: "Bedroom" },
  kitchen: { name: "Modular Kitchen" },
};

export default function RoomVisualizer() {
  const [room, setRoom] = useState("living");
  const [activeSlot, setActiveSlot] = useState("walls");
  const [selections, setSelections] = useState({ floor: 0, walls: 0, primary: 0, cabinetry: 1 });
  const [autoRotate, setAutoRotate] = useState(false);
  const [lighting, setLighting] = useState("warm");
  const [slotSwatches, setSlotSwatches] = useState(() => {
    const o = {};
    Object.keys(BUILTIN_SLOTS).forEach((k) => (o[k] = BUILTIN_SLOTS[k].swatches.slice()));
    return o;
  });
  const [catalogCount, setCatalogCount] = useState(0);

  const canvasRef = useRef(null);

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
        />
        {/* Room selection pills — horizontal scroll with fade hint on the right */}
        <div className="absolute top-3 left-3 right-3">
          <div className="relative">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {Object.entries(ROOMS).map(([key, r]) => (
                <button
                  key={key}
                  onClick={() => setRoom(key)}
                  className={`px-3 py-1.5 text-xs font-semibold tracking-wide rounded-sm border shrink-0 transition-colors shadow-sm ${
                    room === key ? "bg-primary text-primary-foreground border-primary" : "bg-background/90 backdrop-blur border-border hover:border-accent text-foreground"
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
            {/* Fade hint so users discover horizontal scroll */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-black/20 to-transparent rounded-r-sm" />
          </div>
        </div>
        {/* Bottom bar controls — single row, never wraps */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-0.5 bg-background/90 backdrop-blur border border-border px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-sm shadow-sm pointer-events-auto">
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
