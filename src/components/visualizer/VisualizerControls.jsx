import React, { useRef } from "react";
import { Eye, Package, Upload } from "lucide-react";
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

  return (
    <div className="bg-card border border-border rounded-sm p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-1 text-muted-foreground">
        <Eye className="h-4 w-4" />
        <p className="eyebrow">Customise</p>
      </div>
      <h3 className="font-display text-xl text-primary mb-1">Material Library</h3>
      {catalogCount > 0 && (
        <p className="text-[11px] text-muted-foreground mb-4 flex items-center gap-1.5">
          <Package className="h-3 w-3 text-accent" /> {catalogCount} swatches pulled live from your catalog
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-5 border-b border-border pb-4">
        {Object.entries(BUILTIN_SLOTS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => setActiveSlot(key)}
            className={`px-3 py-1.5 text-xs rounded-sm transition-colors ${
              activeSlot === key ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-secondary"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">{BUILTIN_SLOTS[activeSlot].label} finishes</p>
      <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[380px] pr-1">
        {slotList.map((sw, i) => (
          <button
            key={i}
            onClick={() => applySwatch(i)}
            className={`flex items-center gap-3 p-2.5 border rounded-sm text-left transition-colors ${
              selections[activeSlot] === i ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"
            }`}
          >
            {sw.customThumb ? (
              <span className="h-9 w-9 rounded-sm border border-black/10 shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${sw.customThumb})` }} />
            ) : (
              <span className="h-9 w-9 rounded-sm border border-black/10 shrink-0" style={{ background: sw.color }} />
            )}
            <span className="flex-1 min-w-0">
              <span className="block text-sm text-foreground truncate">{sw.name}</span>
              <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                {sw.customTex ? "Your upload" : sw.fromCatalog ? `In stock · ₹${sw.price}${sw.unit ? "/" + sw.unit.replace("per ", "") : ""}` : sw.finish}
              </span>
            </span>
            {selections[activeSlot] === i && <span className="text-xs text-accent font-medium shrink-0">In use</span>}
          </button>
        ))}
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="mt-3 flex items-center justify-center gap-2 p-2.5 border border-dashed border-border rounded-sm text-sm text-muted-foreground hover:border-accent hover:text-accent transition-colors"
      >
        <Upload className="h-4 w-4" /> Use your own texture
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onUploadTexture} />

      <p className="mt-auto pt-5 text-[11px] text-muted-foreground leading-relaxed">
        Drag to orbit · scroll to zoom. Upload your own swatch or pick from the finishes we stock.
      </p>
    </div>
  );
}
