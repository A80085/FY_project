import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Layers, 
  Ruler, 
  Maximize, 
  ArrowUpRight, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  Sun,
  MapPin,
  Clock,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { productService } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import { Image } from "@/components/ui/image";

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

// RoomSketch interactive room presets
const ROOM_PRESETS = [
  {
    id: "living",
    title: "Living Lounge",
    subtitle: "The Pavilion Residence",
    image: "/images/gallery_lounge_1788942051775.jpg",
    specs: "480 sq.ft · 10.5ft Ceilings · North Facing",
    materials: [
      { name: "Smoked Walnut", type: "Veneer", color: "#4A3525" },
      { name: "Calacatta Quartz", type: "Stone", color: "#E8E5DD" },
      { name: "Aged Antique Brass", type: "Hardware", color: "#C59B27" }
    ],
    hotspots: [
      { x: "32%", y: "45%", label: "Smoked Walnut Wall Paneling" },
      { x: "68%", y: "62%", label: "Calacatta Marble Low Table" }
    ]
  },
  {
    id: "kitchen",
    title: "Modular Kitchen",
    subtitle: "Culinary Atelier",
    image: "/images/gallery_kitchen_1788941976982.jpg",
    specs: "320 sq.ft · 9.5ft Ceilings · Island Layout",
    materials: [
      { name: "Ivory Matte Acrylic", type: "Acrylic", color: "#ECE7DE" },
      { name: "Charcoal Slatted Oak", type: "Laminate", color: "#2E2A27" },
      { name: "Brushed Brass Bar Pulls", type: "Hardware", color: "#D4AF37" }
    ],
    hotspots: [
      { x: "45%", y: "40%", label: "Soft-Close Ivory Overhead Units" },
      { x: "72%", y: "70%", label: "Waterfall Quartz Counter" }
    ]
  },
  {
    id: "bedroom",
    title: "Master Suite",
    subtitle: "Sanctuary Chamber",
    image: "/images/gallery_bedroom_1788942008850.jpg",
    specs: "410 sq.ft · 10ft Ceilings · Integrated Wardrobe",
    materials: [
      { name: "Book-Matched Teak", type: "Veneer", color: "#6A4526" },
      { name: "Warm Taupe Fluted", type: "Laminate", color: "#A89A89" },
      { name: "Smoked Bronze Handles", type: "Hardware", color: "#544638" }
    ],
    hotspots: [
      { x: "38%", y: "52%", label: "Fluted Teak Bedhead Feature" },
      { x: "78%", y: "48%", label: "Floor-to-Ceiling Wardrobes" }
    ]
  },
  {
    id: "office",
    title: "Executive Study",
    subtitle: "Architectural Library",
    image: "/images/gallery_office_1788942067114.jpg",
    specs: "280 sq.ft · 11ft Ceilings · Acoustic Clad",
    materials: [
      { name: "Charcoal Walnut", type: "Veneer", color: "#362B28" },
      { name: "Cognac Full-Grain", type: "Leather", color: "#8B4513" },
      { name: "Blackened Steel Accents", type: "Hardware", color: "#222222" }
    ],
    hotspots: [
      { x: "50%", y: "42%", label: "Built-in Floating Bookcase" },
      { x: "30%", y: "68%", label: "Integrated Wireway Desk" }
    ]
  }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState("living");
  const [activeLighting, setActiveLighting] = useState("warm"); // warm | day
  const [activeHotspot, setActiveHotspot] = useState(null);

  useEffect(() => {
    productService.list("-created_date", 8).then(setProducts).catch(() => setProducts([]));
  }, []);

  const featured = products.filter((p) => p.is_featured);
  const featuredDisplay = featured.length ? featured.slice(0, 4) : products.slice(0, 4);
  const currentRoom = ROOM_PRESETS.find((r) => r.id === activeRoomId) || ROOM_PRESETS[0];

  return (
    <div className="bg-background min-h-screen text-foreground overflow-hidden">
      {/* ── 1. HERO SECTION (ELORIA + SŌL HAUS EDITORIAL SPLIT) ── */}
      <section className="relative min-h-[92vh] flex flex-col justify-between pt-28 sm:pt-32 lg:pt-36 pb-8 border-b border-border/50">
        {/* Subtle architectural ambient grain & warm glow */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] rounded-full bg-accent/8 blur-[140px]" />
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="container-px max-w-7xl mx-auto relative z-10 w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Editorial Headline & Actions (7 cols) */}
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={staggerContainer}
              className="lg:col-span-7 flex flex-col"
            >
              {/* Provenance Badge */}
              <motion.div variants={fadeInUp} className="mb-6">
                <span className="badge-accent">
                  • EST. 2010 · ARCHITECTURAL SPECIMEN STUDIO · VIRAR WEST, MUMBAI
                </span>
              </motion.div>
              
              {/* Stately Display Headline */}
              <motion.h1 
                variants={fadeInUp} 
                className="text-4xl sm:text-6xl lg:text-6xl xl:text-[4.75rem] font-display font-medium tracking-tight text-foreground leading-[1.08] mb-6"
              >
                Crafting timeless <br />
                <span className="italic font-light text-accent">architectural spaces.</span>
              </motion.h1>
              
              {/* Editorial Description */}
              <motion.p 
                variants={fadeInUp} 
                className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 font-light"
              >
                Engineered laminates, hand-matched architectural veneers, and precision hardware crafted for visionary designers. Experience the materiality of your space in real-time.
              </motion.p>
              
              {/* Dual Action Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/catalog" 
                  className="glow-amber group inline-flex h-14 items-center justify-center gap-3 bg-accent text-accent-foreground px-8 text-sm font-semibold tracking-wide hover:bg-accent/90 transition-all rounded-xs shadow-lg"
                >
                  Explore Collection 
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/visualizer" 
                  className="group inline-flex h-14 items-center justify-center gap-3 border border-border/80 bg-card/60 backdrop-blur-md text-foreground px-8 text-sm font-semibold tracking-wide hover:bg-secondary hover:border-accent/40 transition-all rounded-xs shadow-xs"
                >
                  Interactive 3D Studio 
                  <Maximize className="h-4 w-4 text-accent group-hover:scale-110 transition-transform" />
                </Link>
              </motion.div>

              {/* Architectural Specimen Micro-Pills */}
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground border-t border-border/40 pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  <span>Direct Mill Sourcing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  <span>FSC-Certified Hardwoods</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  <span>Precision CNC Ready</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Floating Showcase Card (ELORIA style) (5 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-xl overflow-hidden border border-border/80 bg-card shadow-2xl group">
                {/* Main Hero Visual — Editorial Luxury Interior */}
                <div className="aspect-[4/5] relative overflow-hidden bg-muted">
                  <Image
                    src="/images/hero_interior_1788941933675.jpg"
                    alt="Shree Mangalam Crafted Interior Living Suite"
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    fittingType="fill"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                </div>

                {/* Floating Specimen Badge (Top Left) */}
                <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-xs border border-border/50 shadow-md">
                  <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-accent">
                    Atelier Specimen
                  </p>
                  <p className="text-xs font-display font-medium text-foreground">
                    Bespoke Architectural Living Suite
                  </p>
                </div>

                {/* Floating Live 3D Chip (Top Right) */}
                <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white shadow-md flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] tracking-wider uppercase font-medium">Curated Finish</span>
                </div>

                {/* Bottom Architectural Metadata Panel */}
                <div className="absolute bottom-0 inset-x-0 p-6 z-10 text-white flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">Signature Collection</p>
                      <h3 className="text-lg font-display font-semibold text-white">Shree Mangalam Master Suite</h3>
                    </div>
                    <Link
                      to="/gallery"
                      className="h-9 w-9 rounded-full bg-accent text-accent-foreground grid place-items-center hover:scale-110 transition-transform shadow-md"
                      title="View Project Gallery"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/80 font-light">
                    <span>Veneers · Marine Plywood · Custom Joinery</span>
                    <span className="font-mono text-[11px] text-accent">Virar West · Mumbai</span>
                  </div>
                </div>
              </div>

              {/* Decorative Subtle Background Frame */}
              <div className="absolute -inset-2 -z-10 rounded-2xl border border-accent/20 pointer-events-none hidden sm:block" />
            </motion.div>
          </div>
        </div>

        {/* ── FLOATING CREDIBILITY BAR (ELORIA STYLE) ── */}
        <div className="container-px max-w-7xl mx-auto w-full pt-8 sm:pt-10">
          <div className="rounded-xl border border-border/70 bg-card/75 backdrop-blur-md p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:divide-x divide-border/60">
              {[
                { stat: "12+ Years", title: "Architectural Provenance", desc: "Crafting bespoke surfaces since 2010" },
                { stat: "2,400+", title: "Spaces Curated", desc: "Residential, commercial & hospitality" },
                { stat: "180+", title: "Curated Materials", desc: "Veneers, laminates & hardware" },
                { stat: "Virar Atelier", title: "Flagship Experience", desc: "Old Viva College Road studio" }
              ].map((item, idx) => (
                <div key={idx} className="min-w-0 lg:pl-6 xl:pl-8 lg:first:pl-0">
                  <p className="text-2xl sm:text-3xl font-display font-bold text-accent mb-1">{item.stat}</p>
                  <p className="text-xs uppercase tracking-widest font-semibold text-foreground mb-0.5">{item.title}</p>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ROOMSKETCH-INSPIRED INTERACTIVE 3D CONFIGURATOR SUITE ── */}
      <section className="py-20 sm:py-24 bg-background border-b border-border/50">
        <div className="container-px max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="min-w-0">
              <span className="badge-accent mb-3">
                RoomSketch 3D Technology
              </span>
              <h2 className="text-3xl sm:text-5xl font-display text-foreground font-medium">
                Visualize Before You Fabricate.
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl font-light mt-2 leading-relaxed">
                Test finishes in real-time, toggle natural light scenarios, and inspect physical materiality directly in your browser.
              </p>
            </div>
            <Link
              to="/visualizer"
              className="glow-amber inline-flex items-center gap-2 h-12 px-6 bg-accent text-accent-foreground rounded-xs text-xs uppercase tracking-widest font-semibold hover:bg-accent/90 transition-all self-start md:self-auto shrink-0 shadow-md"
            >
              Open Full 3D Visualizer <Maximize className="h-4 w-4" />
            </Link>
          </div>

          {/* Interactive SaaS Configurator Canvas Mockup */}
          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xl">
            {/* SaaS Top Toolbar — flex-wrap with clear minimum gaps so controls never collide */}
            <div className="bg-muted/40 border-b border-border/60 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              {/* Room Selector Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
                {ROOM_PRESETS.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => {
                      setActiveRoomId(room.id);
                      setActiveHotspot(null);
                    }}
                    className={`px-3 sm:px-3.5 py-1.5 rounded-xs text-xs font-medium tracking-wide transition-all whitespace-nowrap shrink-0 ${
                      activeRoomId === room.id
                        ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                    }`}
                  >
                    {room.title}
                  </button>
                ))}
              </div>

              {/* Lighting & Environment Controls */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center bg-background/80 border border-border/60 rounded-xs p-1 text-xs">
                  <button
                    onClick={() => setActiveLighting("warm")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-2xs transition-colors ${
                      activeLighting === "warm"
                        ? "bg-amber-500/20 text-accent font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Golden Hour Light (3200K)"
                  >
                    <Sun className="h-3 w-3" />
                    <span>Golden Hour</span>
                  </button>
                  <button
                    onClick={() => setActiveLighting("day")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-2xs transition-colors ${
                      activeLighting === "day"
                        ? "bg-sky-500/20 text-sky-600 dark:text-sky-300 font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Studio Daylight (5500K)"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Studio Day</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Configurator Viewport & Inspector Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] sm:min-h-[520px]">
              {/* Interactive Visual Canvas (8 cols) */}
              <div className="lg:col-span-8 relative bg-black overflow-hidden flex items-center justify-center min-h-[360px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentRoom.id + activeLighting}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={currentRoom.image}
                      alt={currentRoom.title}
                      className="w-full h-full object-cover"
                      fittingType="fill"
                    />
                    {/* Lighting Ambient Tint Filter */}
                    <div
                      className={`absolute inset-0 transition-colors duration-700 pointer-events-none ${
                        activeLighting === "warm"
                          ? "bg-amber-900/15 mix-blend-color"
                          : "bg-blue-900/10 mix-blend-color"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  </motion.div>
                </AnimatePresence>

                {/* Floating Architectural Coordinate Overlay */}
                <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xs border border-white/15 text-white text-[11px] font-mono">
                  <span>{currentRoom.specs}</span>
                </div>

                {/* Interactive Hotspot Pins */}
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
                      <span className="absolute h-7 w-7 rounded-full bg-accent/40 animate-ping" />
                      <span className="relative h-6 w-6 rounded-full bg-accent text-accent-foreground font-bold text-xs flex items-center justify-center shadow-lg hover:scale-125 transition-transform border-2 border-white">
                        +
                      </span>
                    </button>

                    {/* Popover Callout */}
                    {activeHotspot === i && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-background/95 backdrop-blur-md text-foreground px-3.5 py-2 rounded-xs border border-border shadow-xl text-xs font-medium whitespace-nowrap z-30"
                      >
                        <p className="text-[10px] uppercase tracking-wider text-accent font-semibold">Specified Finish</p>
                        <p>{pin.label}</p>
                      </motion.div>
                    )}
                  </div>
                ))}

                {/* Quick Hint */}
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md text-white/80 px-3 py-1.5 rounded-full text-xs">
                  <Eye className="h-3.5 w-3.5 text-accent" />
                  <span>Click glowing pins to inspect material specs</span>
                </div>
              </div>

              {/* Material Inspector & Specimen Palette (4 cols) */}
              <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-card border-t lg:border-t-0 lg:border-l border-border/60">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold text-accent">
                      Active Space
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      Preset #{currentRoom.id.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-semibold text-foreground mb-1">
                    {currentRoom.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6 font-light">
                    {currentRoom.subtitle}
                  </p>

                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                      Applied Material Palette
                    </p>

                    <div className="space-y-3">
                      {currentRoom.materials.map((mat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xs border border-border/60 bg-muted/30 hover:border-accent/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="h-7 w-7 rounded-xs border border-border/50 shadow-inner shrink-0"
                              style={{ backgroundColor: mat.color }}
                            />
                            <div>
                              <p className="text-xs font-semibold text-foreground">{mat.name}</p>
                              <p className="text-[10px] text-muted-foreground">{mat.type} Specimen</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-accent">Applied</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-6 border-t border-border/60 mt-6 space-y-3">
                  <Link
                    to="/visualizer"
                    className="glow-amber w-full inline-flex h-12 items-center justify-center gap-2 bg-accent text-accent-foreground font-semibold text-xs uppercase tracking-widest rounded-xs hover:bg-accent/90 transition-all shadow-md"
                  >
                    Open Full 3D Room Configurator
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/estimate"
                    className="w-full inline-flex h-11 items-center justify-center gap-2 border border-border/80 bg-background hover:bg-secondary text-foreground text-xs uppercase tracking-widest font-medium rounded-xs transition-colors"
                  >
                    Calculate Cost For This Room
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. ASYMMETRIC BENTO GRID - ARCHITECTURAL PRECISION ── */}
      <section className="py-24 bg-secondary/30 border-b border-border/50">
        <div className="container-px max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-14">
            <span className="badge-accent mb-3">Architectural Standard</span>
            <h2 className="text-3xl sm:text-5xl font-display text-foreground font-medium mb-4">
              Engineered with millwork precision.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl font-light leading-relaxed">
              We provide a seamless specification process for architects, contractors, and luxury homeowners. Every finish in our archive is tested for stability, durability, and texture fidelity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
            {/* Bento Box 1 - Architectural Image Specimen (2 cols, 2 rows) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8 }} 
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group border border-border/80 shadow-md"
            >
              <Image 
                src="/images/gallery_walnut_1788941961232.jpg" 
                alt="Shree Mangalam Architectural Walnut Panelling & Living Suite" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                fittingType="fill" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-6 left-6 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-xs border border-border/50">
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-accent">
                  Architectural Millwork · Grade AAA
                </span>
              </div>

              <div className="absolute bottom-8 left-8 right-8 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold mb-1 text-accent">
                    Custom Walnut Panelling &amp; Living Joinery
                  </p>
                  <p className="text-2xl font-display font-medium text-white max-w-md">
                    Seamless architectural woodwork with integrated brass accents and book-matched fluted details.
                  </p>
                </div>
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-white/90 hover:text-accent transition-colors shrink-0"
                >
                  View Case Studies <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Bento Box 2 - Curated Finishes */}
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              variants={fadeInUp} 
              viewport={{ once: true }} 
              className="bg-card rounded-xl p-8 border border-border/80 flex flex-col justify-between hover:border-accent/50 transition-colors shadow-xs card-lift"
            >
              <div className="flex items-center justify-between">
                <Layers className="h-8 w-8 text-accent" />
                <span className="text-xs font-mono text-muted-foreground">180+ SKUs</span>
              </div>
              <div>
                <h3 className="text-xl font-display text-foreground font-semibold mb-2">Curated Finishes</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed font-light">
                  Architectural laminates, hand-selected veneers, fluted acoustic panels, and matte acrylics. Physical specimen swatches delivered to your studio.
                </p>
              </div>
            </motion.div>

            {/* Bento Box 3 - Precision Fabrication */}
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              variants={fadeInUp} 
              viewport={{ once: true }} 
              className="wood-panel-dark text-white rounded-xl p-8 flex flex-col justify-between border border-border/40 shadow-xs card-lift"
            >
              <div className="flex items-center justify-between">
                <Ruler className="h-8 w-8 text-accent" />
                <span className="text-xs font-mono text-accent">CNC Exact</span>
              </div>
              <div>
                <h3 className="text-xl font-display text-white font-semibold mb-2">Made-to-Measure</h3>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-light">
                  Precision computer-controlled cutting, groove-routing, and zero-joint hot air edge-banding for flawless millimeter accuracy on site.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3.5 THE PHYSICAL EXPERIENCE SHOWROOM ── */}
      <section className="py-24 bg-card/60 border-b border-border/50">
        <div className="container-px max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <span className="badge-accent mb-3">Our Flagship Experience</span>
              <h2 className="text-3xl sm:text-5xl font-display text-foreground font-medium mb-2">
                Step Inside Our Showroom Atelier
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg font-light max-w-2xl leading-relaxed">
                Explore our full-scale display in Virar West featuring ceiling-suspended timber slabs, interactive rotating veneer louvers, physical sample walls, and bespoke arched millwork.
              </p>
            </div>
            <Link
              to="/inquiry"
              className="glow-amber inline-flex items-center gap-2 h-12 px-6 bg-accent text-accent-foreground rounded-xs text-xs uppercase tracking-widest font-semibold hover:bg-accent/90 transition-all shrink-0 shadow-md"
            >
              Book Showroom Visit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 3 Authentic Showroom Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {/* Card 1: Suspended Timber */}
            <div className="group rounded-xl overflow-hidden border border-border/80 bg-card shadow-sm hover:shadow-xl transition-all duration-500 card-lift flex flex-col">
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                <Image
                  src="/images/store_suspended_timber.jpg"
                  alt="Timber and Veneer Atelier"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  fittingType="fill"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-2xs bg-black/70 backdrop-blur-md text-accent border border-white/10">
                  Timber Atelier
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    Suspended Timber &amp; Rotating Louvers
                  </h3>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Full-height vertical natural wood slabs and rotating veneer partitions paired with a curved cantilever solid timber desk.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-accent">
                  Natural Teak · Smoked Walnut · Fluted Oak
                </div>
              </div>
            </div>

            {/* Card 2: Material Swatch Wall */}
            <div className="group rounded-xl overflow-hidden border border-border/80 bg-card shadow-sm hover:shadow-xl transition-all duration-500 card-lift flex flex-col">
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                <Image
                  src="/images/store_material_library.png"
                  alt="Choose Your Material Library"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  fittingType="fill"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-2xs bg-black/70 backdrop-blur-md text-accent border border-white/10">
                  Swatch Library
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    "Choose Your Material" Swatch Wall
                  </h3>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Touch and inspect 180+ physical finish specimens: high-pressure laminates, glossy acrylics, engineered quartz, and brass fittings.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-accent">
                  180+ Physical Swatches In Stock
                </div>
              </div>
            </div>

            {/* Card 3: Arched Millwork */}
            <div className="group rounded-xl overflow-hidden border border-border/80 bg-card shadow-sm hover:shadow-xl transition-all duration-500 card-lift flex flex-col">
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                <Image
                  src="/images/showroom_arched_millwork_bespoke.jpg"
                  alt="Custom Arched Millwork Display"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  fittingType="fill"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-2xs bg-black/70 backdrop-blur-md text-accent border border-white/10">
                  Bespoke Joinery
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    Arched Millwork &amp; Walnut Shelving
                  </h3>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Custom soft-gray architectural cabinetry with arched niches, solid walnut wood shelf insets, and integrated brass picture sconces.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-accent">
                  Zero-Joint Edgebanding · Classic Wainscot
                </div>
              </div>
            </div>
          </div>

          {/* Showroom Visit Location Banner */}
          <div className="wood-panel-dark text-white rounded-xl p-6 sm:p-8 border border-border/40 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.22em] font-semibold text-accent">
                  Physical Store Address &amp; Hours
                </p>
                <h4 className="text-xl sm:text-2xl font-display font-medium text-white">
                  Shree Mangalam Ply and Interiors
                </h4>
                <p className="text-xs sm:text-sm text-white/80 font-light flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent shrink-0" />
                  <span>Shop No. 06, Kusum Vihar 'A', Beside Banjara Hotel, Old Viva College Road, Virar West, Palghar - 401303</span>
                </p>
                <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-white/80 font-mono">
                  <span className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-accent" /> +91 87886 09224 / +91 98250 12345
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-accent" /> Mon – Sat: 10:00 AM – 8:30 PM (Sun by Appointment)
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <Link
                  to="/inquiry"
                  className="glow-amber h-12 px-6 rounded-xs text-xs uppercase tracking-widest font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-all shadow-md inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Request Site Consultation <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://maps.google.com/?q=Shree+Mangalam+Ply+and+Interiors+Virar+West"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-6 rounded-xs text-xs uppercase tracking-widest font-semibold border border-white/20 hover:border-accent text-white hover:text-accent transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  View on Google Maps <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. FEATURED COLLECTION (SŌL HAUS ARCHIVAL PRESENTATION) ── */}
      <section className="py-24 bg-background">
        <div className="container-px max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="badge-accent mb-3">Architectural Archive</span>
              <h2 className="text-3xl sm:text-5xl font-display text-foreground font-medium mb-2">
                Featured Specimen Collection
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg font-light">
                High-specification finishes ready for specification and immediate dispatch.
              </p>
            </div>
            <Link 
              to="/catalog" 
              className="group flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              View complete archive 
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredDisplay.length ? (
              featuredDisplay.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }}>
                  <ProductCard product={p} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-muted-foreground text-sm py-16 text-center border border-dashed border-border rounded-xs">
                Loading specimen archive…
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
