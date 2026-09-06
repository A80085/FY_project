import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Maximize2, RotateCw, Sun, RefreshCw } from "lucide-react";
import { productService } from "@/services/productService";
import { BUILTIN_SLOTS, CATALOG_TO_SLOT, COLOR_FAMILY_MAP, FINISH_MAP } from "./constants";
import VisualizerControls from "./VisualizerControls";
import VisualizerCanvas from "./VisualizerCanvas";

// ROOMS definition for overlay buttons
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
    <div className="grid lg:grid-cols-[1fr_340px] gap-5">
      <div className="relative rounded-sm overflow-hidden border border-border bg-muted">
        <VisualizerCanvas 
          ref={canvasRef}
          room={room}
          selections={selections}
          slotSwatches={slotSwatches}
          autoRotate={autoRotate}
          lighting={lighting}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {Object.entries(ROOMS).map(([key, r]) => (
            <button
              key={key}
              onClick={() => setRoom(key)}
              className={`px-3 py-1.5 text-xs tracking-wide rounded-sm border transition-colors ${
                room === key ? "bg-primary text-primary-foreground border-primary" : "bg-background/90 border-border hover:border-accent"
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur border border-border px-2.5 py-1.5 rounded-sm">
            <button onClick={() => setAutoRotate((v) => !v)} className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-sm ${autoRotate ? "bg-accent text-accent-foreground" : ""}`}><RotateCw className="h-3.5 w-3.5" /> Rotate</button>
            <div className="h-4 w-px bg-border" />
            <button onClick={() => setLighting((l) => (l === "warm" ? "cool" : l === "cool" ? "neutral" : "warm"))} className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-sm capitalize"><Sun className="h-3.5 w-3.5" /> {lighting}</button>
            <div className="h-4 w-px bg-border" />
            <button onClick={() => canvasRef.current?.resetView()} className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-sm"><RefreshCw className="h-3.5 w-3.5" /> Reset</button>
          </div>
          <button onClick={() => canvasRef.current?.fullscreen()} className="flex items-center gap-1.5 text-xs bg-background/90 backdrop-blur border border-border px-2.5 py-1.5 rounded-sm hover:border-accent"><Maximize2 className="h-3.5 w-3.5" /> Full</button>
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
