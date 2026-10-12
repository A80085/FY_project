import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, Sofa, BedDouble, UtensilsCrossed, Briefcase, DoorOpen, Ruler, Plus, Trash2, Wrench, Download } from "lucide-react";
import { ROOM_TYPES, WALL_FINISHES, FLOORING_OPTIONS, HARDWARE_OPTIONS, FURNISHING_ADDONS, CUSTOM_PRESETS, calcEstimate, formatINR } from "@/lib/interiorData";
import { generateEstimatePDF } from "@/utils/pdfGenerator";
import PageHero from "@/components/PageHero";

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

  const [estimate, setEstimate] = useState(null);

  useEffect(() => {
    if (!room) { setEstimate(null); return; }
    let cancelled = false;
    calcEstimate({ room, dims, wall, floor, hardware, addons, customItems })
      .then((result) => { if (!cancelled) setEstimate(result); });
    return () => { cancelled = true; };
  }, [room, dims, wall, floor, hardware, addons, customItems]);

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
    if (!estimate) return;
    setIsExporting(true);
    try {
      await generateEstimatePDF({ room, dims, wall, floor, hardware, addons, customItems, estimate });
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
      <div className="container-px max-w-7xl mx-auto pt-6 sm:pt-10">
        {/* Mobile Step Header with Live Running Estimate */}
        <div className="sm:hidden flex items-center justify-between mb-4 bg-card border border-border p-3 rounded-sm shadow-sm">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
              Step {step + 1}/{STEPS.length}
            </span>
            <span className="text-xs font-bold text-primary truncate">
              · {STEPS[step]}
            </span>
          </div>
          {estimate && (
            <span className="font-display font-bold text-accent text-sm shrink-0 ml-2">
              {formatINR(estimate.total)}
            </span>
          )}
        </div>

        {/* Scrollable Progress bar */}
        <div className="flex items-center gap-2 mb-6 sm:mb-10 overflow-x-auto no-scrollbar pb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => i <= step && setStep(i)}
                disabled={i > step}
                className={`h-7 w-7 grid place-items-center rounded-full text-xs border transition-colors ${i <= step ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </button>
              <span className={`text-xs ${i === step ? "text-primary font-semibold" : "text-muted-foreground"}`}>{s}</span>
              {i < STEPS.length - 1 && <span className="w-4 sm:w-10 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          <div className="bg-card border border-border rounded-sm p-4 sm:p-8 shadow-sm">
            {/* STEP 1: ROOM */}
            {step === 0 && (
              <div>
                <h2 className="font-display text-xl sm:text-2xl text-primary mb-1">Which room are you planning?</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6">Select a room type to start.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROOM_TYPES.map((r) => {
                    const Icon = ICONS[r.icon] || Sofa;
                    return (
                      <button
                        key={r.id}
                        onClick={() => { setRoom(r.id); setDims(r.defaultDims); }}
                        className={`flex items-center gap-3.5 p-3.5 sm:p-4 border rounded-sm text-left transition-colors ${room === r.id ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"}`}
                      >
                        <span className={`h-10 w-10 sm:h-11 sm:w-11 grid place-items-center rounded-sm shrink-0 ${room === r.id ? "bg-accent text-accent-foreground" : "bg-muted"}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block font-medium text-sm truncate">{r.name}</span>
                          <span className="block text-xs text-muted-foreground">Base rate {formatINR(r.baseRate)}/sq.ft</span>
                        </span>
                        {room === r.id && <Check className="h-4 w-4 text-accent shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: DIMENSIONS */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-xl sm:text-2xl text-primary mb-1">Enter dimensions (in feet)</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6">Approximate room size — used to calculate area.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[["length", "Length"], ["width", "Width"], ["height", "Height"]].map(([key, label]) => (
                    <div key={key}>
                      <label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5 mb-2 font-medium"><Ruler className="h-3.5 w-3.5" />{label}</label>
                      <input
                        type="number" min="1" max="40"
                        value={dims[key]}
                        onChange={(e) => setDims((d) => ({ ...d, [key]: Number(e.target.value) }))}
                        className="w-full px-4 py-3 text-base sm:text-lg border border-border rounded-sm focus:outline-none focus:border-accent"
                      />
                      <p className="text-xs text-muted-foreground mt-1">ft</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-secondary/50 rounded-sm flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Floor area</span>
                  <span className="font-display text-lg sm:text-xl text-primary font-bold">{(dims.length * dims.width).toFixed(0)} sq.ft</span>
                </div>
              </div>
            )}

            {/* STEP 3: MATERIALS */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl text-primary mb-1">Choose your finishes</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">Materials we stock, applied to your room.</p>
                </div>
                {[
                  { label: "Wall finish", options: WALL_FINISHES, value: wall, setter: setWall },
                  { label: "Flooring", options: FLOORING_OPTIONS, value: floor, setter: setFloor },
                  { label: "Hardware grade", options: HARDWARE_OPTIONS, value: hardware, setter: setHardware },
                ].map(({ label, options, value, setter }) => (
                  <div key={label}>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2.5 font-medium">{label}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {options.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => setter(o.id)}
                          className={`p-3 border rounded-sm text-left transition-colors ${value === o.id ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"}`}
                        >
                          <span className="block text-sm font-medium">{o.name}</span>
                          <span className="block text-xs text-muted-foreground mt-0.5">{o.group || "Hardware"} · {o.multiplier ? `×${o.multiplier}` : ""}{o.addPerSqft ? ` +${formatINR(o.addPerSqft)}/sq.ft` : ""}</span>
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
                <h2 className="font-display text-xl sm:text-2xl text-primary mb-1">Add finishing touches</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6">Optional furnishings to refine your estimate.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <h2 className="font-display text-xl sm:text-2xl text-primary mb-1">Add your own line items</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                  Know exactly what you need? Add custom items with your own quantity and rate.
                </p>

                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-medium">Quick add</p>
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
                  <div className="border border-dashed border-border rounded-sm p-6 sm:p-8 text-center text-sm text-muted-foreground">
                    No custom items yet. Use a quick-add above or add a blank row to build your own breakdown.
                  </div>
                ) : (
                  <div className="overflow-x-auto no-scrollbar">
                    <div className="min-w-[480px] space-y-2">
                      <div className="grid grid-cols-[1fr_80px_90px_100px_36px] gap-2 px-1 text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
                        <span>Item</span><span>Qty</span><span>Unit</span><span className="text-right">Rate (₹)</span><span />
                      </div>
                      {customItems.map((c, i) => (
                        <div key={i} className="grid grid-cols-[1fr_80px_90px_100px_36px] gap-2 items-center">
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
                          <button onClick={() => removeCustom(i)} className="grid place-items-center text-muted-foreground hover:text-destructive p-1">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between">
                  <button onClick={() => addCustom()} className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent font-medium">
                    <Plus className="h-4 w-4" /> Add blank row
                  </button>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Custom subtotal</p>
                    <p className="font-display text-lg sm:text-xl text-primary font-bold">{formatINR(customTotal)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: ESTIMATE */}
            {step === 5 && estimate && (
              <div>
                <div id="estimate-results-content" className="bg-card pb-4">
                  <h2 className="font-display text-xl sm:text-2xl text-primary mb-1">Your rough estimate</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-6">Based on your selections. Final price confirmed at showroom.</p>

                  <div className="wood-panel-dark p-5 sm:p-6 rounded-sm mb-6 shadow-sm border border-border/40">
                    <p className="eyebrow text-accent">Estimated total (incl. labour &amp; GST)</p>
                    <p className="font-display text-3xl sm:text-5xl mt-2 tracking-tight text-white">{formatINR(estimate.total)}</p>
                    <p className="text-white/70 text-xs sm:text-sm mt-1">≈ {formatINR(estimate.perSqft)} / sq.ft</p>
                  </div>

                  <div className="space-y-2">
                    {estimate.breakdown.map((b) => (
                      <div key={b.label} className="flex items-center justify-between py-2 border-b border-border text-xs sm:text-sm">
                        <span className="text-muted-foreground truncate pr-2">{b.label}</span>
                        <span className="font-medium shrink-0">{formatINR(b.value)}</span>
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
              <button onClick={back} disabled={step === 0} className="inline-flex items-center gap-2 text-sm text-muted-foreground disabled:opacity-40 hover:text-primary font-medium">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={next} disabled={(step === 0 && !room)} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 sm:px-6 py-2.5 text-sm rounded-sm disabled:opacity-40 hover:bg-accent hover:text-accent-foreground font-medium transition-colors shadow-sm">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <Link to="/catalog" className="text-sm text-muted-foreground hover:text-accent font-medium">Browse catalog →</Link>
              )}
            </div>
          </div>

          {/* live sidebar */}
          <div className="bg-card border border-border rounded-sm p-5 sm:p-6 h-fit sticky top-28 shadow-sm">
            <p className="eyebrow mb-3">Live summary</p>
            {room ? (
              <>
                <h3 className="font-display text-lg sm:text-xl text-primary font-bold">{ROOM_TYPES.find((r) => r.id === room)?.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{dims.length} × {dims.width} × {dims.height} ft · {(dims.length * dims.width).toFixed(0)} sq.ft</p>
                <dl className="mt-5 space-y-2 text-xs">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Walls</dt><dd className="font-medium">{WALL_FINISHES.find((w) => w.id === wall)?.name}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Floor</dt><dd className="font-medium">{FLOORING_OPTIONS.find((f) => f.id === floor)?.name}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Hardware</dt><dd className="font-medium">{HARDWARE_OPTIONS.find((h) => h.id === hardware)?.name}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Add-ons</dt><dd className="font-medium">{addons.length || "None"}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Custom items</dt><dd className="font-medium">{customItems.filter((c) => c.name).length || "None"}</dd></div>
                </dl>
                {estimate && (
                  <div className="mt-5 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">Estimate</p>
                    <p className="font-display text-2xl sm:text-3xl text-primary font-bold">{formatINR(estimate.total)}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground">Select a room to begin your estimate.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
