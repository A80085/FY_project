import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, Sofa, BedDouble, UtensilsCrossed, Briefcase, DoorOpen, Ruler, Plus, Trash2, Wrench, Download } from "lucide-react";
import { ROOM_TYPES, WALL_FINISHES, FLOORING_OPTIONS, HARDWARE_OPTIONS, FURNISHING_ADDONS, CUSTOM_PRESETS, calcEstimate, formatINR } from "@/lib/interiorData";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PageHero from "@/components/layout/PageHero";

const STEPS = ["Room", "Dimensions", "Materials", "Add-ons", "Custom", "Estimate"];
const ICONS = { Sofa, BedDouble, UtensilsCrossed, Briefcase, DoorOpen };

export default function Estimate() {
  const [step, setStep] = useState(0);
  const [room, setRoom] = useState("");
  const [dims, setDims] = useState({ length: 14, width: 12, height: 10 });
  const [wall, setWall] = useState(WALL_FINISHES[0].id);
  const [floor, setFloor] = useState(FLOORING_OPTIONS[0].id);
  const [hardware, setHardware] = useState(HARDWARE_OPTIONS[0].id);
  const [addons, setAddons] = useState([]);
  const [customItems, setCustomItems] = useState([]);

  const estimate = room ? calcEstimate({ room, dims, wall, floor, hardware, addons, customItems }) : null;

  function next() { setStep((s) => Math.min(s + 1, STEPS.length - 1)); }
  function back() { setStep((s) => Math.max(s - 1, 0)); }

  function toggleAddon(id) {
    setAddons((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  }

  function addCustom(preset) {
    setCustomItems((c) => [...c, { name: preset?.name || "", qty: preset?.qty ?? 1, unit: preset?.unit || "unit", rate: preset?.rate ?? 0 }]);
  }
  function updateCustom(i, field, value) {
    setCustomItems((c) => c.map((it, idx) => (idx === i ? { ...it, [field]: field === "name" || field === "unit" ? value : Number(value) } : it)));
  }
  function removeCustom(i) {
    setCustomItems((c) => c.filter((_, idx) => idx !== i));
  }
  const customTotal = customItems.reduce((s, c) => s + Number(c.qty) * Number(c.rate), 0);

  function buildSummary() {
    const rt = ROOM_TYPES.find((r) => r.id === room);
    const w = WALL_FINISHES.find((x) => x.id === wall);
    const f = FLOORING_OPTIONS.find((x) => x.id === floor);
    const h = HARDWARE_OPTIONS.find((x) => x.id === hardware);
    const customs = customItems.filter((c) => c.name).map((c) => `${c.name}(${c.qty}${c.unit})`).join("; ");
    return `Room: ${rt?.name} | ${dims.length}x${dims.width}x${dims.height} ft | Walls: ${w?.name} | Floor: ${f?.name} | Hardware: ${h?.name} | Add-ons: ${addons.length ? addons.join(", ") : "none"} | Custom: ${customs || "none"} | Estimate: ${formatINR(estimate.total)}`;
  }

  const [isExporting, setIsExporting] = useState(false);

  const generatePDF = async () => {
    setIsExporting(true);
    const element = document.getElementById("estimate-results-content");
    if (!element) {
      setIsExporting(false);
      return;
    }

    try {
      // Small delay to ensure any layout shifts are done
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Interior_Estimate_Shree_Mangalam.pdf");
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="pb-24">
      <PageHero
        eyebrow="Rough Estimate Calculator"
        title="Plan a budget in minutes."
        description="An indicative estimate based on room size and the finishes we stock. Final pricing is confirmed at the showroom."
        image="/images/gallery_kitchen_1788941976982.jpg"
      />
      <div className="container-px max-w-7xl mx-auto pt-10">
        {/* progress */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <span className={`h-7 w-7 grid place-items-center rounded-full text-xs border transition-colors ${i <= step ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className={`text-xs ${i === step ? "text-primary font-medium" : "text-muted-foreground"}`}>{s}</span>
              {i < STEPS.length - 1 && <span className="w-6 sm:w-10 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          <div className="bg-card border border-border rounded-sm p-6 sm:p-8">
            {/* STEP 1: ROOM */}
            {step === 0 && (
              <div>
                <h2 className="font-display text-2xl text-primary mb-1">Which room are you planning?</h2>
                <p className="text-sm text-muted-foreground mb-6">Select a room type to start.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {ROOM_TYPES.map((r) => {
                    const Icon = ICONS[r.icon] || Sofa;
                    return (
                      <button
                        key={r.id}
                        onClick={() => { setRoom(r.id); setDims(r.defaultDims); }}
                        className={`flex items-center gap-4 p-4 border rounded-sm text-left transition-colors ${room === r.id ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"}`}
                      >
                        <span className={`h-11 w-11 grid place-items-center rounded-sm ${room === r.id ? "bg-accent text-accent-foreground" : "bg-muted"}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="flex-1">
                          <span className="block font-medium text-sm">{r.name}</span>
                          <span className="block text-xs text-muted-foreground">Base rate {formatINR(r.baseRate)}/sq.ft</span>
                        </span>
                        {room === r.id && <Check className="h-4 w-4 text-accent" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: DIMENSIONS */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl text-primary mb-1">Enter dimensions (in feet)</h2>
                <p className="text-sm text-muted-foreground mb-6">Approximate room size — used to calculate area.</p>
                <div className="grid sm:grid-cols-3 gap-5">
                  {[["length", "Length"], ["width", "Width"], ["height", "Height"]].map(([key, label]) => (
                    <div key={key}>
                      <label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5 mb-2"><Ruler className="h-3.5 w-3.5" />{label}</label>
                      <input
                        type="number" min="1" max="40"
                        value={dims[key]}
                        onChange={(e) => setDims((d) => ({ ...d, [key]: Number(e.target.value) }))}
                        className="w-full px-4 py-3 text-lg border border-border rounded-sm focus:outline-none focus:border-accent"
                      />
                      <p className="text-xs text-muted-foreground mt-1">ft</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-secondary/50 rounded-sm flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Floor area</span>
                  <span className="font-display text-xl text-primary">{(dims.length * dims.width).toFixed(0)} sq.ft</span>
                </div>
              </div>
            )}

            {/* STEP 3: MATERIALS */}
            {step === 2 && (
              <div className="space-y-7">
                <div>
                  <h2 className="font-display text-2xl text-primary mb-1">Choose your finishes</h2>
                  <p className="text-sm text-muted-foreground mb-6">Materials we stock, applied to your room.</p>
                </div>
                {[
                  ["Wall finish", WALL_FINISHES, wall, setWall],
                  ["Flooring", FLOORING_OPTIONS, floor, setFloor],
                  ["Hardware grade", HARDWARE_OPTIONS, hardware, setHardware],
                ].map(([label, options, value, setter]) => (
                  <div key={label}>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">{label}</p>
                    <div className="grid sm:grid-cols-3 gap-2.5">
                      {options.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => setter(o.id)}
                          className={`p-3 border rounded-sm text-left transition-colors ${value === o.id ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"}`}
                        >
                          <span className="block text-sm font-medium">{o.name}</span>
                          <span className="block text-xs text-muted-foreground mt-0.5">{o.group} · ×{o.multiplier || "—"}{o.addPerSqft ? ` +${formatINR(o.addPerSqft)}/sq.ft` : ""}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 4: ADDONS */}
            {step === 3 && (
              <div>
                <h2 className="font-display text-2xl text-primary mb-1">Add finishing touches</h2>
                <p className="text-sm text-muted-foreground mb-6">Optional furnishings to refine your estimate.</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {FURNISHING_ADDONS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => toggleAddon(a.id)}
                      className={`p-4 border rounded-sm text-left transition-colors ${addons.includes(a.id) ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{a.name}</span>
                        {addons.includes(a.id) && <Check className="h-4 w-4 text-accent" />}
                      </div>
                      <span className="block text-xs text-muted-foreground mt-1">{formatINR(a.perSqft)}/sq.ft</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: CUSTOM */}
            {step === 4 && (
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Wrench className="h-4 w-4" />
                  <p className="eyebrow">For power users</p>
                </div>
                <h2 className="font-display text-2xl text-primary mb-1">Add your own line items</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Know exactly what you need? Add custom items with your own quantity and rate. They roll straight
                  into the final estimate, with labour and GST applied.
                </p>

                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Quick add</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {CUSTOM_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => addCustom(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-sm hover:border-accent hover:bg-accent/10 transition-colors"
                    >
                      <Plus className="h-3 w-3" /> {p.name}
                    </button>
                  ))}
                </div>

                {customItems.length === 0 ? (
                  <div className="border border-dashed border-border rounded-sm p-8 text-center text-sm text-muted-foreground">
                    No custom items yet. Use a quick-add above or add a blank row to build your own breakdown.
                  </div>
                ) : (
                  <div className="overflow-x-auto no-scrollbar">
                  <div className="min-w-[300px] space-y-2">
                    <div className="grid grid-cols-[1fr_70px_80px_90px_36px] gap-2 px-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                      <span>Item</span><span>Qty</span><span>Unit</span><span className="text-right">Rate (₹)</span><span />
                    </div>
                    {customItems.map((c, i) => (
                      <div key={i} className="grid grid-cols-[1fr_70px_80px_90px_36px] gap-2 items-center">
                        <input
                          value={c.name}
                          onChange={(e) => updateCustom(i, "name", e.target.value)}
                          placeholder="e.g. Skirting"
                          className="w-full px-2.5 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent"
                        />
                        <input
                          type="number" min="0" value={c.qty}
                          onChange={(e) => updateCustom(i, "qty", e.target.value)}
                          className="w-full px-2.5 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent"
                        />
                        <input
                          value={c.unit}
                          onChange={(e) => updateCustom(i, "unit", e.target.value)}
                          placeholder="unit"
                          className="w-full px-2.5 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent"
                        />
                        <input
                          type="number" min="0" value={c.rate}
                          onChange={(e) => updateCustom(i, "rate", e.target.value)}
                          className="w-full px-2.5 py-2 text-sm border border-border rounded-sm text-right focus:outline-none focus:border-accent"
                        />
                        <button onClick={() => removeCustom(i)} className="grid place-items-center text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between">
                  <button onClick={() => addCustom()} className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent">
                    <Plus className="h-4 w-4" /> Add blank row
                  </button>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Custom subtotal</p>
                    <p className="font-display text-xl text-primary">{formatINR(customTotal)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: ESTIMATE */}
            {step === 5 && estimate && (
              <div>
                <div id="estimate-results-content" className="bg-card pb-4">
                  <h2 className="font-display text-2xl text-primary mb-1">Your rough estimate</h2>
                  <p className="text-sm text-muted-foreground mb-6">Based on your selections. Final price confirmed at showroom.</p>

                  <div className="bg-primary text-primary-foreground p-6 rounded-sm mb-6">
                    <p className="eyebrow text-primary-foreground/60">Estimated total (incl. labour &amp; GST)</p>
                    <p className="font-display text-5xl mt-2">{formatINR(estimate.total)}</p>
                    <p className="text-primary-foreground/70 text-sm mt-1">≈ {formatINR(estimate.perSqft)} / sq.ft</p>
                  </div>

                  <div className="space-y-2">
                    {estimate.breakdown.map((b) => (
                      <div key={b.label} className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">{b.label}</span>
                        <span className="text-sm font-medium">{formatINR(b.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-7">
                  <Link
                    to={`/inquiry?summary=${encodeURIComponent(buildSummary())}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 text-sm rounded-sm hover:bg-primary/90 transition-colors shadow-sm font-medium"
                  >
                    Send to showroom <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={generatePDF}
                    disabled={isExporting}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground border border-border py-3.5 text-sm rounded-sm hover:bg-secondary/80 transition-colors shadow-sm font-medium disabled:opacity-50"
                  >
                    {isExporting ? "Generating..." : "Download PDF"} <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* nav buttons */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-border">
              <button onClick={back} disabled={step === 0} className="inline-flex items-center gap-2 text-sm text-muted-foreground disabled:opacity-40 hover:text-primary">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={next} disabled={(step === 0 && !room)} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-sm rounded-sm disabled:opacity-40 hover:bg-accent hover:text-accent-foreground">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <Link to="/catalog" className="text-sm text-muted-foreground hover:text-accent">Browse catalog →</Link>
              )}
            </div>
          </div>

          {/* live sidebar */}
          <div className="bg-card border border-border rounded-sm p-6 h-fit sticky top-28">
            <p className="eyebrow mb-3">Live summary</p>
            {room ? (
              <>
                <h3 className="font-display text-xl text-primary">{ROOM_TYPES.find((r) => r.id === room)?.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{dims.length} × {dims.width} × {dims.height} ft · {(dims.length * dims.width).toFixed(0)} sq.ft</p>
                <dl className="mt-5 space-y-2 text-xs">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Walls</dt><dd>{WALL_FINISHES.find((w) => w.id === wall)?.name}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Floor</dt><dd>{FLOORING_OPTIONS.find((f) => f.id === floor)?.name}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Hardware</dt><dd>{HARDWARE_OPTIONS.find((h) => h.id === hardware)?.name}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Add-ons</dt><dd>{addons.length || "None"}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Custom items</dt><dd>{customItems.filter((c) => c.name).length || "None"}</dd></div>
                </dl>
                {estimate && (
                  <div className="mt-5 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">Estimate</p>
                    <p className="font-display text-3xl text-primary">{formatINR(estimate.total)}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Select a room to begin your estimate.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
