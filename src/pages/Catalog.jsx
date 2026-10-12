import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, LayoutGrid, Table, PackageCheck, ArrowUpRight, Check, AlertTriangle } from "lucide-react";
import { productService } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import PageHero from "@/components/PageHero";
import { PRODUCT_SEED, formatINR } from "@/lib/interiorData";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "@/components/ui/image";

const CATEGORIES = ["All", "Laminates", "Plywood", "Hardware", "Veneer", "Custom Pieces", "Accessories"];

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [sampleKitRequested, setSampleKitRequested] = useState(false);
  const [params] = useSearchParams();

  useEffect(() => {
    productService.list("-created_date", 200)
      .then((data) => {
        setProducts(data.length ? data : PRODUCT_SEED);
        setLoading(false);
      })
      .catch(() => {
        setProducts(PRODUCT_SEED);
        setLoading(false);
      });
    const c = params.get("category");
    if (c) setCategory(c);
  }, [params]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const okCat = category === "All" || p.category === category;
      const okQ = !query || `${p.name} ${p.color_family || ""} ${p.finish || ""} ${p.subcategory || ""} ${p.sku || ""}`.toLowerCase().includes(query.toLowerCase());
      return okCat && okQ;
    });
  }, [products, category, query]);

  return (
    <div className="pb-24 bg-background text-foreground">
      <PageHero
        eyebrow="Architectural Material Archive"
        title="Curated Specimen Library"
        description="Filter by classification, core substrate, or surface finish. All specimens reflect genuine Virar West physical showroom inventory."
        image="/images/prod_walnut_lam_1788942098886.jpg"
      />

      <div className="container-px max-w-7xl mx-auto pt-8 sm:pt-12">
        {/* ── PHYSICAL SAMPLE BOX PROMOTION (ARCHITECT CONCIERGE) ── */}
        <div className="mb-10 wood-panel-dark text-white rounded-xl p-6 sm:p-8 border border-border/40 shadow-lg relative overflow-hidden">
          {/* Subtle background showroom image overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-25 pointer-events-none">
            <img src="/images/store_material_library.png" alt="Material Swatch Library" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(24,25%,8%)] via-[hsl(24,25%,8%)/70%] to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <PackageCheck className="h-5 w-5" />
                <span className="text-xs uppercase tracking-[0.22em] font-semibold">Architect &amp; Designer Specimen Box</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-medium text-white">
                Request The 5-Piece Atelier Sample Kit
              </h3>
              <p className="text-white/80 text-xs sm:text-sm font-light leading-relaxed">
                Curated directly from our physical showroom swatch wall in Virar West. Receive 5 physical 10×10cm wood veneer, fluted laminate, and acrylic sample swatches boxed with architectural spec sheets. Delivered across Mumbai, Palghar &amp; Gujarat.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={() => setSampleKitRequested(true)}
                disabled={sampleKitRequested}
                className={`h-12 px-6 rounded-xs text-xs uppercase tracking-widest font-semibold transition-all ${
                  sampleKitRequested
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-accent text-accent-foreground hover:bg-accent/90 glow-amber shadow-md"
                }`}
              >
                {sampleKitRequested ? "✓ Sample Box Dispatched" : "Request Sample Kit (Free for Architects)"}
              </button>
            </div>
          </div>
        </div>

        {/* ── FILTER & VIEW MODE TOOLBAR ── */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between mb-8 pb-6 border-b border-border/60">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((c) => {
              const count = c === "All" ? products.length : products.filter((p) => p.category === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3.5 py-2 text-xs tracking-wider uppercase font-semibold rounded-xs border shrink-0 transition-all ${
                    category === c 
                      ? "bg-accent text-accent-foreground border-accent shadow-xs" 
                      : "border-border/70 hover:border-accent/40 bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{c}</span>
                  <span className="ml-1.5 text-[10px] opacity-70 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar & View Mode Toggle */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search finish, timber, SKU…"
                className="w-full pl-9 pr-4 py-2 text-xs bg-card border border-border/80 rounded-xs focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* View Mode Toggle Button */}
            <div className="flex items-center bg-card border border-border/80 rounded-xs p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-2xs transition-colors ${
                  viewMode === "grid" ? "bg-accent text-accent-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Lookbook Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-2xs transition-colors ${
                  viewMode === "table" ? "bg-accent text-accent-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
                title="CAD Spec Table View"
              >
                <Table className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── MATERIAL ARCHIVE CONTENT ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="w-full aspect-[3/4] rounded-xs" />
                <Skeleton className="h-4 w-3/4 mt-2" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-1/4 mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-6 font-mono">
              <span>Showing {filtered.length} curated specimen{filtered.length !== 1 && "s"}</span>
              <span>Sorted by Latest Ingestion</span>
            </div>

            {/* View Mode 1: Lookbook Grid (Sōl Haus) */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              /* View Mode 2: CAD Specification Table (Architect/BIM format) */
              <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-border/60">
                    <thead className="bg-muted/40 uppercase tracking-widest text-[10px] text-muted-foreground font-semibold">
                      <tr>
                        <th className="py-3.5 px-4">Specimen</th>
                        <th className="py-3.5 px-4">Material &amp; Description</th>
                        <th className="py-3.5 px-4">Classification</th>
                        <th className="py-3.5 px-4">Dimensions</th>
                        <th className="py-3.5 px-4">Inventory</th>
                        <th className="py-3.5 px-4">Indicative Rate</th>
                        <th className="py-3.5 px-4 text-right">Dossier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-light">
                      {filtered.map((p) => {
                        const lowStock = p.stock <= (p.min_threshold || 10);
                        return (
                          <tr key={p.id} className="hover:bg-secondary/40 transition-colors group">
                            <td className="py-3 px-4">
                              <div className="h-12 w-12 rounded-2xs overflow-hidden border border-border/60 bg-muted shrink-0">
                                <Image
                                  src={p.image_url || "/images/prod_walnut_lam_1788942098886.jpg"}
                                  alt={p.name}
                                  className="h-full w-full object-cover"
                                  fittingType="fill"
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-display font-medium text-foreground text-sm group-hover:text-accent transition-colors">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs font-light">
                                {p.description}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-accent block">
                                {p.category}
                              </span>
                              <span className="text-[11px] text-muted-foreground font-mono">
                                {p.finish || p.subcategory || "Architectural"}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                              {p.dimensions || "8ft × 4ft"}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${lowStock ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}>
                                {lowStock ? <AlertTriangle className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                                {p.stock} {p.unit?.includes("sheet") ? "sheets" : "units"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-display font-semibold text-foreground text-sm">
                                {formatINR(p.price)}
                              </span>
                              <span className="text-[10px] text-muted-foreground ml-1">
                                /{p.unit || "unit"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Link
                                to={`/catalog/${p.id}`}
                                className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-accent hover:text-foreground transition-colors"
                              >
                                <span>Inspect</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!filtered.length && (
              <div className="bg-card border border-border/70 rounded-xl p-16 text-center text-muted-foreground text-sm">
                <p className="font-display text-lg text-foreground mb-2">No matching specimens in current filter</p>
                <p className="text-xs font-light mb-6">Try broadening your keyword or selecting "All" categories.</p>
                <button
                  onClick={() => { setCategory("All"); setQuery(""); }}
                  className="px-5 py-2.5 bg-accent text-accent-foreground text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-accent/90"
                >
                  Reset Archive Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
