import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Maximize, 
  ArrowUpRight, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  Sun,
  MapPin,
  Clock,
  Phone,
  Building2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { productService } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import { Image } from "@/components/ui/image";

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Interactive Room Presets with clear, human terminology
const ROOM_PRESETS = [
  {
    id: "living",
    title: "Living Room",
    subtitle: "Custom Wall Paneling & Media Console",
    image: "/images/typology_living_walnut.jpg",
    specs: "480 sq.ft · 10.5ft Ceilings · Warm Ambient Tone",
    materials: [
      { name: "Smoked Walnut", type: "Natural Veneer", color: "#4A3525" },
      { name: "Calacatta Quartz", type: "Engineered Stone", color: "#E8E5DD" },
      { name: "Aged Antique Brass", type: "Profile Hardware", color: "#C59B27" }
    ],
    hotspots: [
      { x: "24%", y: "42%", label: "Smoked Walnut Fluted Paneling" },
      { x: "48%", y: "76%", label: "Calacatta Quartz Low Table" }
    ]
  },
  {
    id: "kitchen",
    title: "Modular Kitchen",
    subtitle: "L-Shape Layout with Breakfast Island",
    image: "/images/typology_kitchen_island.jpg",
    specs: "320 sq.ft · 9.5ft Ceilings · Soft-Close Lift-Ups",
    materials: [
      { name: "Ivory Matte Acrylic", type: "Acrylic Sheet", color: "#ECE7DE" },
      { name: "Charcoal Slatted Oak", type: "Textured Laminate", color: "#2E2A27" },
      { name: "Brushed Brass Bar Pulls", type: "Cabinet Hardware", color: "#D4AF37" }
    ],
    hotspots: [
      { x: "30%", y: "26%", label: "Ivory Matte Overhead Cabinets" },
      { x: "62%", y: "68%", label: "Seamless Waterfall Quartz Island" }
    ]
  },
  {
    id: "bedroom",
    title: "Master Bedroom",
    subtitle: "Fluted Headboard & Full-Height Wardrobe",
    image: "/images/typology_bedroom_suite.jpg",
    specs: "410 sq.ft · 10ft Ceilings · Concealed Storage",
    materials: [
      { name: "Book-Matched Teak", type: "Natural Veneer", color: "#6A4526" },
      { name: "Warm Taupe Fluted", type: "Textured Laminate", color: "#A89A89" },
      { name: "Smoked Bronze Handles", type: "Wardrobe Hardware", color: "#544638" }
    ],
    hotspots: [
      { x: "50%", y: "38%", label: "Book-Matched Teak & Fluted Bedhead" },
      { x: "82%", y: "52%", label: "Floor-to-Ceiling Wardrobes" }
    ]
  },
  {
    id: "office",
    title: "Home Office",
    subtitle: "Floating Desk & Acoustic Slat Wall",
    image: "/images/typology_office_slat.jpg",
    specs: "280 sq.ft · 11ft Ceilings · Glare-Free Task Light",
    materials: [
      { name: "Charcoal Walnut", type: "Matte Veneer", color: "#362B28" },
      { name: "Cognac Full-Grain", type: "Accent Texture", color: "#8B4513" },
      { name: "Blackened Steel Accents", type: "Metal Trim", color: "#222222" }
    ],
    hotspots: [
      { x: "24%", y: "35%", label: "Built-in Floating Bookcase" },
      { x: "48%", y: "64%", label: "Integrated Cable-Management Desk" }
    ]
  }
];

// Recognized brands real customers look for in India
const BRANDS = [
  { name: "CenturyPly", category: "Marine Plywood" },
  { name: "Greenply", category: "BWP Plywood" },
  { name: "Merino", category: "Laminates & Acrylics" },
  { name: "Greenlam", category: "Decorative Surfaces" },
  { name: "Häfele", category: "Architectural Hardware" },
  { name: "Hettich", category: "Soft-Close Fittings" },
  { name: "Ebco", category: "Joinery Solutions" },
  { name: "Godrej", category: "Locks & Security" }
];


export default function Home() {
  const [products, setProducts] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState("living");
  const [activeLighting, setActiveLighting] = useState("warm");
  const [activeHotspot, setActiveHotspot] = useState(null);

  useEffect(() => {
    productService.list("-created_date", 8).then(setProducts).catch(() => setProducts([]));
  }, []);

  const featured = products.filter((p) => p.is_featured);
  const featuredDisplay = featured.length ? featured.slice(0, 4) : products.slice(0, 4);
  const currentRoom = ROOM_PRESETS.find((r) => r.id === activeRoomId) || ROOM_PRESETS[0];

  return (
    <div className="bg-background min-h-screen text-foreground">
      {/* ── 1. HERO SECTION (CLEAN, ARCHITECTURAL, CREDIBLE) ── */}
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 border-b border-border/60">
        <div className="container-px max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Direct, human value proposition (7 cols) */}
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={staggerContainer}
              className="lg:col-span-7 flex flex-col"
            >
              {/* Grounded Provenance Chip */}
              <motion.div variants={fadeInUp} className="mb-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/70 px-3.5 py-1 text-xs font-medium text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Serving Mumbai &amp; Palghar Since 2010 · Direct Mill Distributor
                </span>
              </motion.div>
              
              {/* Confident, clear headline without artificial italics */}
              <motion.h1 
                variants={fadeInUp} 
                className="text-3xl sm:text-5xl lg:text-[3.75rem] font-display font-bold tracking-tight text-foreground leading-[1.12] mb-6"
              >
                Quality Plywood, Custom Laminates &amp; Modern Interiors.
              </motion.h1>
              
              {/* Practical, honest description */}
              <motion.p 
                variants={fadeInUp} 
                className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 font-normal"
              >
                Certified 100% BWP marine plywood, 180+ designer laminate sheets, natural veneers, and precision hardware. Browse finishes online, estimate your room budget, or visit our showroom in Virar West.
              </motion.p>
              
              {/* Action Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3.5 mb-8">
                <Link 
                  to="/catalog" 
                  className="inline-flex h-12 sm:h-13 items-center justify-center gap-2.5 bg-primary text-primary-foreground hover:bg-primary/90 px-7 text-sm font-semibold tracking-wide transition-all rounded-md shadow-sm"
                >
                  Browse Materials
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  to="/visualizer" 
                  className="inline-flex h-12 sm:h-13 items-center justify-center gap-2.5 border border-border bg-card hover:bg-secondary text-foreground px-7 text-sm font-semibold tracking-wide transition-all rounded-md"
                >
                  <Maximize className="h-4 w-4 text-accent" />
                  Try 3D Room Visualizer
                </Link>
                <Link 
                  to="/estimate" 
                  className="inline-flex h-12 sm:h-13 items-center justify-center gap-2 border border-dashed border-border/80 hover:border-accent hover:bg-accent/5 text-muted-foreground hover:text-foreground px-5 text-sm font-medium transition-all rounded-md"
                >
                  Calculate Cost
                </Link>
              </motion.div>

              {/* Real Customer Guarantees */}
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-muted-foreground border-t border-border/60 pt-6">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-medium text-foreground">IS:710 Marine Grade Certified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-medium text-foreground">Termite &amp; Borer Proof Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-medium text-foreground">180+ Physical Swatches on Display</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Clean Project Showcase Card (5 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="rounded-xl overflow-hidden border border-border bg-card shadow-lg">
                <div className="aspect-[4/3] sm:aspect-[16/11] relative overflow-hidden bg-muted">
                  <Image
                    src="/images/hero_interior_1788941933675.jpg"
                    alt="Shree Mangalam Living Room Interior"
                    className="w-full h-full object-cover"
                    fittingType="fill"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Subtle top location chip */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-medium text-white flex items-center gap-1.5 border border-white/10">
                    <MapPin className="h-3 w-3 text-accent" />
                    <span>Recent Project · Virar West</span>
                  </div>
                </div>

                {/* Grounded project details footer */}
                <div className="p-5 sm:p-6 bg-card border-t border-border/70 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-accent">
                        Living Room &amp; Fluted Wall Joinery
                      </p>
                      <h3 className="text-base sm:text-lg font-display font-semibold text-foreground">
                        Custom Walnut TV Unit &amp; Low Console
                      </h3>
                    </div>
                    <Link
                      to="/gallery"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 shrink-0 pt-0.5"
                    >
                      Gallery <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Fabricated with 18mm BWP marine plywood core, natural smoked walnut veneer, and soft-close profile handles.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── AUTHORIZED BRANDS STRIP (REAL-WORLD COMMERCIAL TRUST) ── */}
        <div className="container-px max-w-7xl mx-auto w-full pt-10 sm:pt-14">
          <div className="rounded-lg border border-border/80 bg-secondary/40 p-5 sm:p-6">
            <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground text-center mb-4">
              Authorized Stockists &amp; Preferred Distributors of Trusted Brands
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              {BRANDS.map((b, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card/80 border border-border/60 text-xs shadow-2xs">
                  <span className="font-semibold text-foreground">{b.name}</span>
                  <span className="text-[10px] text-muted-foreground hidden sm:inline">· {b.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CREDIBILITY & EXPERIENCE STATS ── */}
      <section className="py-12 bg-secondary/30 border-b border-border/60">
        <div className="container-px max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
            {[
              { stat: "14+ Years", title: "Showroom Experience", desc: "Serving Virar West, Palghar & Mumbai since 2010" },
              { stat: "2,400+", title: "Homes & Flats Furnished", desc: "Modular kitchens, wardrobes & living suites" },
              { stat: "180+", title: "Finishes in Stock", desc: "Physical laminate, veneer & acrylic swatches" },
              { stat: "10-Year", title: "Plywood Warranty", desc: "100% genuine BWP IS:710 marine grade guarantee" }
            ].map((item, idx) => (
              <div key={idx} className="min-w-0 pt-4 sm:pt-0 sm:pl-6 first:pl-0 first:pt-0">
                <p className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">{item.stat}</p>
                <p className="text-xs uppercase tracking-wider font-semibold text-accent mb-0.5">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE 3D ROOM VISUALIZER SUITE ── */}
      <section className="py-16 sm:py-20 bg-background border-b border-border/60">
        <div className="container-px max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent mb-2">
                <Sparkles className="h-3.5 w-3.5" /> Interactive 3D Studio
              </span>
              <h2 className="text-2xl sm:text-4xl font-display text-foreground font-bold">
                Visualize Finishes Before Fabricating
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                Test finishes in real-time, toggle daylight and warm lighting scenarios, and inspect physical material specifications directly in your browser.
              </p>
            </div>
            <Link
              to="/visualizer"
              className="inline-flex items-center gap-2 h-11 px-5 bg-primary text-primary-foreground rounded-md text-xs uppercase tracking-wider font-semibold hover:bg-primary/90 transition-all self-start md:self-auto shrink-0 shadow-sm"
            >
              Open Full 3D Studio <Maximize className="h-4 w-4" />
            </Link>
          </div>

          {/* Configurator Box */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-md">
            {/* Toolbar */}
            <div className="bg-muted/50 border-b border-border/70 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
              {/* Room Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {ROOM_PRESETS.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => {
                      setActiveRoomId(room.id);
                      setActiveHotspot(null);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all whitespace-nowrap shrink-0 ${
                      activeRoomId === room.id
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                    }`}
                  >
                    {room.title}
                  </button>
                ))}
              </div>

              {/* Lighting controls */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center bg-background border border-border/80 rounded-md p-1 text-xs">
                  <button
                    onClick={() => setActiveLighting("warm")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-sm transition-colors ${
                      activeLighting === "warm"
                        ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sun className="h-3 w-3" />
                    <span>Warm Light</span>
                  </button>
                  <button
                    onClick={() => setActiveLighting("day")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-sm transition-colors ${
                      activeLighting === "day"
                        ? "bg-sky-500/20 text-sky-700 dark:text-sky-300 font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Daylight</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Viewport & Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
              {/* Canvas Visual (8 cols) */}
              <div className="lg:col-span-8 relative bg-black overflow-hidden flex items-center justify-center min-h-[340px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentRoom.id + activeLighting}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={currentRoom.image}
                      alt={currentRoom.title}
                      className="w-full h-full object-cover"
                      fittingType="fill"
                    />
                    <div
                      className={`absolute inset-0 transition-colors duration-500 pointer-events-none ${
                        activeLighting === "warm"
                          ? "bg-amber-900/15 mix-blend-color"
                          : "bg-blue-900/10 mix-blend-color"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  </motion.div>
                </AnimatePresence>

                {/* Specs chip */}
                <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md px-3 py-1 rounded-md border border-white/15 text-white text-[11px]">
                  <span>{currentRoom.specs}</span>
                </div>

                {/* Hotspots */}
                {currentRoom.hotspots.map((pin, i) => (
                  <div
                    key={i}
                    style={{ left: pin.x, top: pin.y }}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  >
                    <button
                      onClick={() => setActiveHotspot(activeHotspot === i ? null : i)}
                      className="group/pin relative flex items-center justify-center"
                    >
                      <span className="relative h-6 w-6 rounded-full bg-accent text-accent-foreground font-bold text-xs flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-white">
                        +
                      </span>
                    </button>

                    {activeHotspot === i && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-background text-foreground px-3 py-2 rounded-md border border-border shadow-xl text-xs font-medium whitespace-nowrap z-30"
                      >
                        <p className="text-[10px] uppercase tracking-wider text-accent font-semibold">Specified Material</p>
                        <p>{pin.label}</p>
                      </motion.div>
                    )}
                  </div>
                ))}

                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-black/70 backdrop-blur-md text-white/90 px-3 py-1.5 rounded-full text-xs">
                  <Eye className="h-3.5 w-3.5 text-accent" />
                  <span>Click plus pins to inspect material specs</span>
                </div>
              </div>

              {/* Palette Column (4 cols) */}
              <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-card border-t lg:border-t-0 lg:border-l border-border/70">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-accent">
                      Active Space
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      Preset: {currentRoom.title}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                    {currentRoom.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-5">
                    {currentRoom.subtitle}
                  </p>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                      Applied Material Finishes
                    </p>

                    <div className="space-y-2.5">
                      {currentRoom.materials.map((mat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-md border border-border/70 bg-muted/20"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="h-6 w-6 rounded-sm border border-border/50 shrink-0"
                              style={{ backgroundColor: mat.color }}
                            />
                            <div>
                              <p className="text-xs font-semibold text-foreground">{mat.name}</p>
                              <p className="text-[11px] text-muted-foreground">{mat.type}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">In Stock</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/70 mt-6 space-y-2.5">
                  <Link
                    to="/visualizer"
                    className="w-full inline-flex h-11 items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wider rounded-md hover:bg-primary/90 transition-all shadow-sm"
                  >
                    Open Full 3D Room Configurator
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/estimate"
                    className="w-full inline-flex h-10 items-center justify-center gap-2 border border-border bg-background hover:bg-secondary text-foreground text-xs uppercase tracking-wider font-medium rounded-md transition-colors"
                  >
                    Calculate Budget For This Room
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. THE PHYSICAL SHOWROOM ATELIER (REAL-WORLD PROOF) ── */}
      <section className="py-16 sm:py-20 bg-secondary/20 border-b border-border/60">
        <div className="container-px max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent mb-2">
                <Building2 className="h-3.5 w-3.5" /> Virar West Showroom
              </span>
              <h2 className="text-2xl sm:text-4xl font-display text-foreground font-bold mb-2">
                Step Inside Our Experience Center
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base font-normal max-w-2xl leading-relaxed">
                Visit our physical store on Old Viva College Road. Touch 180+ finish swatches, test smooth drawer channels, inspect natural wood slabs, and consult with our specialists.
              </p>
            </div>
            <Link
              to="/inquiry"
              className="inline-flex items-center gap-2 h-11 px-5 bg-accent text-accent-foreground rounded-md text-xs uppercase tracking-wider font-semibold hover:bg-accent/90 transition-all shrink-0 shadow-sm"
            >
              Book Showroom Visit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 3 Real Showroom Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Card 1 */}
            <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm flex flex-col">
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                <Image
                  src="/images/store_suspended_timber.jpg"
                  alt="Timber and Veneer Atelier"
                  className="w-full h-full object-cover"
                  fittingType="fill"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-sm bg-black/70 backdrop-blur-md text-white border border-white/10">
                  Timber &amp; Louvers
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground mb-1.5">
                    Suspended Timber &amp; Rotating Louvers
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Full-height vertical natural wood slabs and rotating veneer partitions paired with a curved cantilever timber desk.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 text-xs text-accent font-medium">
                  Natural Teak · Smoked Walnut · Fluted Oak
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm flex flex-col">
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                <Image
                  src="/images/store_material_library.png"
                  alt="Choose Your Material Library"
                  className="w-full h-full object-cover"
                  fittingType="fill"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-sm bg-black/70 backdrop-blur-md text-white border border-white/10">
                  Physical Swatch Wall
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground mb-1.5">
                    180+ Finish Specification Wall
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Touch and inspect physical specimens: high-pressure laminates, glossy acrylics, engineered quartz, and brass fittings.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 text-xs text-accent font-medium">
                  180+ Finish Swatches on Display
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm flex flex-col">
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                <Image
                  src="/images/showroom_arched_millwork_bespoke.jpg"
                  alt="Custom Arched Millwork Display"
                  className="w-full h-full object-cover"
                  fittingType="fill"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-sm bg-black/70 backdrop-blur-md text-white border border-white/10">
                  Modular Cabinetry
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground mb-1.5">
                    Arched Millwork &amp; Walnut Shelving
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Soft-gray architectural cabinetry with arched niches, solid walnut shelf insets, and integrated warm picture sconces.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 text-xs text-accent font-medium">
                  Zero-Joint Edgebanding · Classic Fluting
                </div>
              </div>
            </div>
          </div>

          {/* Showroom Address & Contact Banner */}
          <div className="wood-panel-dark text-white rounded-xl p-6 sm:p-8 border border-border/40 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest font-semibold text-accent">
                  Showroom Address &amp; Operating Hours
                </p>
                <h4 className="text-xl sm:text-2xl font-display font-semibold text-white">
                  Shree Mangalam Ply and Interiors
                </h4>
                <p className="text-xs sm:text-sm text-white/85 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent shrink-0" />
                  <span>Shop No. 06, Kusum Vihar 'A', Beside Banjara Hotel, Old Viva College Road, Virar West, Palghar - 401303</span>
                </p>
                <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-white/80">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-accent" /> +91 87886 09224 / +91 98250 12345
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-accent" /> Mon – Sat: 10:00 AM – 8:30 PM (Sunday by Appointment)
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <Link
                  to="/inquiry"
                  className="h-11 px-5 rounded-md text-xs uppercase tracking-wider font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-all shadow-sm inline-flex items-center justify-center gap-2"
                >
                  Request Consultation <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://maps.google.com/?q=Shree+Mangalam+Ply+and+Interiors+Virar+West"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 px-5 rounded-md text-xs uppercase tracking-wider font-semibold border border-white/25 hover:border-accent text-white hover:text-accent transition-all inline-flex items-center justify-center gap-2"
                >
                  Open in Google Maps <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FEATURED MATERIAL ARCHIVE ── */}
      <section className="py-16 sm:py-20 bg-secondary/15">
        <div className="container-px max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-accent mb-2 block">
                Showroom Inventory
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-bold text-foreground mb-1">
                Featured Materials &amp; Finishes
              </h2>
              <p className="text-muted-foreground text-sm">
                In-stock plywood, veneers, laminates, and hardware ready for on-site delivery.
              </p>
            </div>
            <Link 
              to="/catalog" 
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              View All 180+ Finishes 
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDisplay.length ? (
              featuredDisplay.map((p) => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))
            ) : (
              <p className="col-span-full text-muted-foreground text-sm py-12 text-center border border-dashed border-border rounded-md">
                Loading materials catalog…
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
