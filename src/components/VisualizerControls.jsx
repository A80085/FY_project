import React, { useRef } from "react";
import { Eye, Package, Upload, CheckCircle2, Layers } from "lucide-react";
import { BUILTIN_SLOTS } from "./constants";

export default function VisualizerControls({
  catalogCount,
  activeSlot,
  setActiveSlot,
  slotSwatches,
  selections,
  applySwatch,
  onUploadTexture,
}) {
  const fileInputRef = useRef(null);
  const slotList = slotSwatches[activeSlot] || [];
  const activeSwatch = slotList[selections[activeSlot]] || slotList[0];

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 flex flex-col shadow-md">
      <div className="flex items-center justify-between mb-1 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-accent" />
          <p className="eyebrow text-accent">Interactive Finishes</p>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full border border-border/40">
          Virar Swatches
        </span>
      </div>

      <h3 className="font-display text-xl text-foreground font-semibold mb-1">
        Showroom Material Library
      </h3>
      
      {catalogCount > 0 && (
        <p className="text-[11px] text-muted-foreground mb-4 flex items-center gap-1.5">
          <Package className="h-3.5 w-3.5 text-accent shrink-0" />
          <span>{catalogCount} live showroom items synced with inventory</span>
        </p>
      )}

      {/* Surface Slot Selector Pills */}
      <div className="flex flex-wrap gap-1.5 mb-5 border-b border-border/60 pb-4">
        {Object.entries(BUILTIN_SLOTS).map(([key, s]) => {
          const isSelected = activeSlot === key;
          return (
            <button
              key={key}
              onClick={() => setActiveSlot(key)}
              className={`px-3.5 py-1.5 text-xs rounded-full font-medium transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-secondary/70 text-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Slot header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">
          {BUILTIN_SLOTS[activeSlot].label} Finishes
        </p>
        <span className="text-[10px] text-accent font-medium">
          {slotList.length} options available
        </span>
      </div>

      {/* Swatches List */}
      <div className="relative">
        <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[260px] sm:max-h-[300px] lg:max-h-[360px] pr-1 no-scrollbar">
          {slotList.map((sw, i) => {
            const isApplied = selections[activeSlot] === i;
            return (
              <button
                key={i}
                onClick={() => applySwatch(i)}
                className={`flex items-center gap-3 p-2.5 border rounded-xl text-left transition-all ${
                  isApplied
                    ? "border-accent bg-accent/10 shadow-xs ring-1 ring-accent/40"
                    : "border-border/70 hover:border-accent/40 bg-card hover:bg-secondary/40"
                }`}
              >
                {sw.customThumb ? (
                  <span
                    className="h-10 w-10 rounded-lg border border-black/10 shrink-0 bg-cover bg-center shadow-2xs"
                    style={{ backgroundImage: `url(${sw.customThumb})` }}
                  />
                ) : (
                  <span
                    className="h-10 w-10 rounded-lg border border-black/10 shrink-0 shadow-2xs relative overflow-hidden flex items-center justify-center"
                    style={{ background: sw.color }}
                  >
                    {sw.finish === "wood" && (
                      <span className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                    )}
                  </span>
                )}

                <span className="flex-1 min-w-0">
                  <span className="block text-xs sm:text-sm font-semibold text-foreground truncate">
                    {sw.name}
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-muted-foreground truncate">
                    {sw.brand ? `${sw.brand} · ` : ""}
                    {sw.customTex
                      ? "Custom Texture"
                      : sw.fromCatalog
                      ? `In Stock · ₹${sw.price}${sw.unit ? "/" + sw.unit.replace("per ", "") : ""}`
                      : sw.substrate || sw.finish}
                  </span>
                </span>

                {isApplied && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-accent px-2 py-0.5 rounded-full bg-accent/15 shrink-0 border border-accent/25">
                    In Use
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {/* Soft bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent" />
      </div>

      {/* Texture Upload Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="mt-3 flex items-center justify-center gap-2 p-2.5 border border-dashed border-border/80 rounded-xl text-xs sm:text-sm font-medium text-muted-foreground hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
      >
        <Upload className="h-3.5 w-3.5" />
        <span>Upload Custom Architecture Swatch</span>
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onUploadTexture} />

      {/* Substrate & Fabrication Standard Card */}
      <div className="mt-5 pt-4 border-t border-border/70 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1">
          <Layers className="h-3.5 w-3.5 text-accent" />
          <span>Physical Fabrication Standard</span>
        </div>
        <div className="bg-secondary/40 rounded-xl p-3 border border-border/60 space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Core Substrate:</span>
            <span className="font-semibold text-foreground">18mm BWP Marine Plywood</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Hardware Standard:</span>
            <span className="font-semibold text-foreground">Häfele / Hettich Soft-Close</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Showroom Stock:</span>
            <span className="font-semibold text-accent">Virar West Physical Wall</span>
          </div>
        </div>
      </div>
    </div>
  );
}


