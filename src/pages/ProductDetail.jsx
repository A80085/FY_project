import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Truck, 
  ZoomIn, 
  Layers, 
  Ruler, 
  ArrowUpRight,
  PackageCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { productService } from "@/services/productService";
import { formatINR, PRODUCT_SEED } from "@/lib/interiorData";
import { Image } from "@/components/ui/image";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

// Curated complementary material pairings for architectural moodboarding
const COMPLEMENTARY_PAIRINGS = [
  { name: "Aged Knurled Brass Pull", category: "Hardware", finish: "Satin Gold", image: "/images/prod_brass_handle_1788942126754.jpg", code: "ACC-01" },
  { name: "Calacatta Quartz", category: "Stone", finish: "Honed", image: "/images/prod_calacatta_quartz.jpg", code: "STN-03" },
  { name: "Ivory Matte Acrylic", category: "Laminate", finish: "Anti-Fingerprint", image: "/images/prod_ivory_acrylic_1788942113723.jpg", code: "ACR-08" }
];

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomMode, setZoomMode] = useState(false); // false = full view, true = 2.5x macro
  const [sampleOrdered, setSampleOrdered] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    productService.getById(id)
      .then((data) => {
        if (data) setProduct(data);
        else setProduct(PRODUCT_SEED.find((p) => String(p.id) === String(id)) || PRODUCT_SEED[0]);
        setLoading(false);
      })
      .catch(() => {
        setProduct(PRODUCT_SEED[0]);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-24 flex flex-col items-center justify-center bg-background">
        <div className="h-10 w-10 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground text-xs uppercase tracking-[0.25em] font-medium">Retrieving Architectural Dossier…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-36 pb-24 flex flex-col items-center justify-center bg-background">
        <h1 className="font-display text-3xl sm:text-4xl text-foreground mb-4">Material Not Found</h1>
        <p className="text-muted-foreground text-sm mb-6">The requested architectural specimen could not be located in our archive.</p>
        <Link to="/catalog" className="inline-flex items-center gap-2 text-accent text-xs uppercase tracking-widest font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4" /> Return to Material Archive
        </Link>
      </div>
    );
  }

  const lowStock = product.stock <= (product.min_threshold || 10);
  const displayImage = product.image_url || "/images/prod_walnut_lam_1788942098886.jpg";

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-24 bg-background text-foreground">
      <div className="container-px max-w-7xl mx-auto">
        {/* Navigation Breadcrumb / Provenance Link */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <Link 
            to="/catalog" 
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" /> 
            <span>Material Archive</span>
            <span className="text-border">/</span>
            <span className="text-foreground">{product.category}</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* ── LEFT COLUMN: INTERACTIVE SPECIMEN VIEWER (STICKY) (5 cols) ── */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 lg:sticky lg:top-28 space-y-4"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted/40 border border-border/80 shadow-2xl group">
              {/* Image with Macro Zoom Toggle */}
              <div className="w-full h-full overflow-hidden relative cursor-zoom-in" onClick={() => setZoomMode(!zoomMode)}>
                <Image
                  src={displayImage}
                  alt={product.name}
                  className={`h-full w-full object-cover transition-all duration-700 ease-out ${
                    zoomMode ? "scale-[2.4] origin-center" : "scale-100 group-hover:scale-105"
                  }`}
                  fittingType="fill"
                />
                
                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15 pointer-events-none" />
              </div>

              {/* Floating Top Archival Specimen Tag */}
              <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-xs border border-border/60 shadow-md pointer-events-none">
                <p className="text-[9px] uppercase tracking-[0.22em] font-semibold text-accent">
                  Specimen Archive
                </p>
                <p className="text-xs font-mono font-medium text-foreground">
                  {product.sku || "SM-VNR-04"}
                </p>
              </div>

              {/* Floating Macro Toggle Button */}
              <button
                onClick={() => setZoomMode(!zoomMode)}
                className="absolute top-4 right-4 z-10 bg-black/65 backdrop-blur-md text-white px-3 py-1.5 rounded-xs border border-white/20 hover:border-accent hover:text-accent transition-all text-xs font-medium flex items-center gap-1.5 shadow-md"
              >
                <ZoomIn className="h-3.5 w-3.5" />
                <span>{zoomMode ? "Reset View" : "Macro Grain (2.5x)"}</span>
              </button>

              {/* Bottom Viewer Caption */}
              <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between text-white/90 text-xs pointer-events-none">
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-2xs text-[10px] uppercase tracking-wider">
                  {zoomMode ? "Inspecting Wood Pore Detail" : "Full Sheet Specimen"}
                </span>
                <span className="font-mono text-[10px] text-accent">Virar West Physical Archive</span>
              </div>
            </div>

            {/* Quick Specimen Actions Strip */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-[11px] sm:text-xs">
              <Link
                to="/visualizer"
                className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-xs border border-border/80 bg-card hover:bg-secondary hover:border-accent/40 text-foreground transition-all shadow-2xs font-medium text-center"
              >
                <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent shrink-0" />
                <span className="truncate">Preview In 3D Space</span>
              </Link>
              <Link
                to={`/estimate`}
                className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-xs border border-border/80 bg-card hover:bg-secondary hover:border-accent/40 text-foreground transition-all shadow-2xs font-medium text-center"
              >
                <Ruler className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent shrink-0" />
                <span className="truncate">Calculate Total Cost</span>
              </Link>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: ARCHITECTURAL SPECIMEN DOSSIER (7 cols) ── */}
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible"
            className="lg:col-span-7 flex flex-col space-y-8"
          >
            {/* Header Block */}
            <motion.div variants={fadeInUp} className="border-b border-border/60 pb-6">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="badge-accent">
                  {product.category} · {product.subcategory || "Architectural Spec"}
                </span>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  REF: {product.sku || "SM-2026-04"}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] text-foreground font-medium leading-[1.1] mb-4">
                {product.name}
              </h1>

              {product.finish && (
                <p className="text-base text-accent italic font-light font-display">
                  {product.finish} Architectural Finish
                </p>
              )}

              {/* Price & Unit Display */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-light">Millwork Sourcing:</span>
                <span className="font-display text-3xl sm:text-4xl font-semibold text-foreground">
                  {formatINR(product.price)}
                </span>
                <span className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground font-medium">
                  /{product.unit || "per sq.ft"}
                </span>
              </div>
            </motion.div>

            {/* Editorial Description */}
            <motion.div variants={fadeInUp}>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-light">
                {product.description || "Engineered for luxury residential joinery and high-traffic commercial interiors. Features precision grain alignment, enhanced surface durability, and mill-calibrated thickness."}
              </p>
            </motion.div>

            {/* ── TECHNICAL SPECIFICATION MATRIX (6-CELL ARCHITECTURAL GRID) ── */}
            <motion.div variants={fadeInUp} className="rounded-xl border border-border/80 bg-card p-6 shadow-xs">
              <h3 className="text-xs uppercase tracking-[0.22em] font-semibold text-foreground mb-5 flex items-center justify-between">
                <span>Technical Specifications Matrix</span>
                <span className="text-[10px] text-accent font-mono">IS:2046 / IS:5509 Standard</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 divide-border/50 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Finish Type</span>
                  <span className="font-medium text-foreground">{product.finish || "Standard Matte"}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Color Palette</span>
                  <span className="font-medium text-foreground">{product.color_family || "Natural Walnut"}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Sheet Dimensions</span>
                  <span className="font-medium text-foreground font-mono">{product.dimensions || "8ft × 4ft (2440×1220mm)"}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Thickness & Tolerance</span>
                  <span className="font-medium text-foreground font-mono">1.0mm (±0.05mm)</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Environmental Grade</span>
                  <span className="font-medium text-foreground">FSC Low-Emission E0</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Live Inventory</span>
                  <span className={`font-medium inline-flex items-center gap-1.5 ${lowStock ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {lowStock ? <AlertTriangle className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                    {product.stock} {product.unit?.includes("sheet") ? "sheets" : "units"} in Virar Showroom
                  </span>
                </div>
              </div>
            </motion.div>

            {/* ── ORDER PHYSICAL ARCHITECT SAMPLE CHIP ── */}
            <motion.div variants={fadeInUp} className="wood-panel-dark text-white rounded-xl p-6 border border-border/40 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="h-4 w-4 text-accent" />
                    <h4 className="font-display font-semibold text-base text-white">Order Physical 10×10cm Sample Chip</h4>
                  </div>
                  <p className="text-white/80 text-xs font-light max-w-md leading-relaxed">
                    Test the physical texture and grain against your site lighting. ₹150 per chip (100% credited toward your final project invoice).
                  </p>
                </div>
                <button
                  onClick={() => setSampleOrdered(true)}
                  disabled={sampleOrdered}
                  className={`shrink-0 px-5 py-2.5 rounded-xs text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap ${
                    sampleOrdered
                      ? "bg-emerald-600 text-white cursor-default"
                      : "bg-accent text-accent-foreground hover:bg-accent/90 glow-amber"
                  }`}
                >
                  {sampleOrdered ? "✓ Sample Chip Requested" : "Order Sample (₹150)"}
                </button>
              </div>
              {sampleOrdered && (
                <p className="mt-3 text-[11px] text-accent/90 border-t border-white/10 pt-2 font-mono">
                  Sample specimen added to your studio dispatch list. Our Virar West concierge will confirm delivery address.
                </p>
              )}
            </motion.div>

            {/* ── PRIMARY PROJECT ACTIONS ── */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to={`/inquiry?summary=Interested in ${encodeURIComponent(product.name)} (SKU: ${product.sku || ""})`}
                className="glow-amber flex-1 inline-flex h-14 items-center justify-center gap-2 bg-accent text-accent-foreground text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-accent/90 transition-all shadow-lg"
              >
                Inquire For Project Sourcing
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/estimate"
                className="flex-1 inline-flex h-14 items-center justify-center gap-2 border border-border/80 bg-card hover:bg-secondary text-foreground text-xs uppercase tracking-widest font-medium rounded-xs transition-colors"
              >
                Generate Detailed BOQ
              </Link>
            </motion.div>

            {/* ── PAIRS WELL WITH: ARCHITECTURAL MATERIAL PALETTE ── */}
            <motion.div variants={fadeInUp} className="border-t border-border/60 pt-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground">
                  Curated Material Pairings
                </span>
                <span className="text-xs text-muted-foreground font-light">Architectural Moodboard</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {COMPLEMENTARY_PAIRINGS.map((pairing, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xs border border-border/60 bg-card/60 hover:border-accent/40 transition-colors">
                    <img src={pairing.image} alt={pairing.name} className="h-10 w-10 rounded-2xs object-cover border border-border/40 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{pairing.name}</p>
                      <p className="text-[10px] text-muted-foreground">{pairing.category} · {pairing.finish}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Provenance & Delivery Guarantees */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs text-muted-foreground font-light border-t border-border/40">
              <p className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-accent shrink-0" />
                <span>Dedicated millwork delivery across Mumbai, Palghar, Thane &amp; Gujarat.</span>
              </p>
              <p className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
                <span>100% authentic grade certificate with batch provenance.</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
