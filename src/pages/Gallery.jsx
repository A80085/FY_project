import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { galleryService } from "@/services/galleryService";
import PageHero from "@/components/PageHero";
import { GALLERY_SEED } from "@/lib/interiorData";
import { Image } from "@/components/ui/image";
import { 
  ArrowUpRight, 
  Maximize2, 
  X,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ROOM_TYPOLOGIES = [
  { label: "All Typologies", val: "All" },
  { label: "Living Suites", val: "Living Room" },
  { label: "Culinary Ateliers", val: "Kitchen" },
  { label: "Master Suites", val: "Bedroom" },
  { label: "Executive Studies", val: "Office" },
  { label: "Dining Salons", val: "Dining" }
];

// Rich architectural material specifications mapped to case studies
const CASE_STUDY_SPECS = {
  "Timber & Veneer Atelier Gallery": {
    footprint: "Flagship Showroom Atelier",
    clientType: "Shree Mangalam Experience Center",
    materials: ["Suspended Natural Timber Slabs", "Rotating Veneer Sample Louvers", "Cantilever Curved Desk"],
    lighting: "Architectural Track Lighting + Ambient Wood Glow",
    roomPreset: "living"
  },
  "Bespoke Arched Millwork Suite": {
    footprint: "Showroom Joinery Exhibit",
    clientType: "Architectural Showcase",
    materials: ["Muted Gray Fluted Arched Cabinetry", "Warm Natural Walnut Shelves", "Solid Brass Picture Sconces"],
    lighting: "Overhead Brass Sconce Illumination (3000K)",
    roomPreset: "office"
  },
  "Choose Your Material Swatch Wall": {
    footprint: "180+ Swatch Specification Wall",
    clientType: "Architect & Designer Resource",
    materials: ["Smoked Oak Architectural Framework", "Acrylic, Veneer & Laminate Chips", "Quartz & Stone Swatches"],
    lighting: "High-CRI Specimen Evaluation Lighting",
    roomPreset: "office"
  },
  "Walnut Living Suite": {
    footprint: "4,200 sq.ft Penthouse",
    clientType: "Private Residential Estate",
    materials: ["Smoked Walnut Fluted Panelling", "Brushed Brass Bar Trim", "Calacatta Quartz Low Table"],
    lighting: "Warm Cove (3200K) + Natural Daylighting",
    roomPreset: "living"
  },
  "Ivory Modular Kitchen": {
    footprint: "320 sq.ft Culinary Atelier",
    clientType: "Bespoke Villa Kitchen",
    materials: ["High-Gloss Acrylic Ivory", "Seamless Waterfall Quartz", "Concealed Soft-Close Profiles"],
    lighting: "Task Daylight (5500K) + Undercabinet Strips",
    roomPreset: "kitchen"
  },
  "Tranquil Master Bedroom": {
    footprint: "450 sq.ft Master Chamber",
    clientType: "Luxury Apartment",
    materials: ["Book-Matched Natural Oak", "Fluted Acoustic Bedhead", "Aged Bronze Hardware"],
    lighting: "Indirect Ambient Recessed (2700K)",
    roomPreset: "bedroom"
  },
  "Live-Edge Teak Dining Salon": {
    footprint: "360 sq.ft Dining Salon",
    clientType: "Contemporary Penthouse",
    materials: ["Solid Live-Edge Natural Teak Slab", "Fluted Smoked Walnut Feature Wall", "Sculptural Brass Chandelier"],
    lighting: "Warm Indirect Vertical LED Strips (3000K)",
    roomPreset: "living"
  },
  "Industrial Dining Nook": {
    footprint: "280 sq.ft Dining Salon",
    clientType: "Modern Residence",
    materials: ["Reclaimed Teak Slab", "Blackened Steel Framework", "Textured Exposed Micro-Cement"],
    lighting: "Pendant Accent Luminescence",
    roomPreset: "living"
  },
  "Heritage Veneer Lounge": {
    footprint: "580 sq.ft Formal Drawing Room",
    clientType: "Heritage Bungalow",
    materials: ["Burma Teak Architectural Veneer", "Solid Brass Molding Inlay", "Classic Cornice Profiles"],
    lighting: "Warm Chandelier & Wall Sconces",
    roomPreset: "living"
  },
  "Minimalist Home Office": {
    footprint: "240 sq.ft Executive Study",
    clientType: "Consulting Suite",
    materials: ["Matt Charcoal Laminate", "Acoustic Slat Cladding", "Floating Teak Wireway Desk"],
    lighting: "High-CRI Glare-Free Task Lighting",
    roomPreset: "office"
  },
  "Executive Home Office": {
    footprint: "320 sq.ft Executive Study",
    clientType: "Private Corporate Suite",
    materials: ["Floating Charcoal Walnut Desk", "Acoustic Dark Wood Slat Wall", "Built-In LED Shelving"],
    lighting: "Warm Recessed LED Linear Lighting + Task Glare-Free",
    roomPreset: "office"
  }
};

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("All");
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  useEffect(() => {
    galleryService.list("-created_date", 60)
      .then((data) => {
        setItems(data.length ? data : GALLERY_SEED);
        setLoading(false);
      })
      .catch(() => {
        setItems(GALLERY_SEED);
        setLoading(false);
      });
  }, []);

  const filtered = items.filter((g) => activeType === "All" || g.room_type === activeType);

  return (
    <div className="pb-24 bg-background text-foreground">
      <PageHero
        eyebrow="Architectural Portfolio · South Gujarat"
        title="Delivered Spatial Archives"
        description="A curated journal of private residences, modular culinary spaces, and executive ateliers executed with millimeter joinery precision."
        image="/images/gallery_walnut_1788941961232.jpg"
      />

      <div className="container-px max-w-7xl mx-auto pt-10 sm:pt-14">
        {/* Typology Filter Navigation */}
        <div className="flex items-center justify-start lg:justify-center gap-2 mb-12 overflow-x-auto no-scrollbar pb-2">
          {ROOM_TYPOLOGIES.map((t) => (
            <button
              key={t.val}
              onClick={() => setActiveType(t.val)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs border shrink-0 transition-all ${
                activeType === t.val 
                  ? "bg-accent text-accent-foreground border-accent shadow-xs" 
                  : "border-border/70 hover:border-accent/40 bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="h-10 w-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground text-xs uppercase tracking-[0.25em]">Opening Spatial Archive…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item, _idx) => {
              const specs = CASE_STUDY_SPECS[item.title] || {
                footprint: "380 sq.ft Space",
                clientType: "Private Client",
                materials: ["Architectural Wood Panel", "Solid Brass Fittings"],
                lighting: "Warm Ambient (3200K)",
                roomPreset: "living"
              };

              return (
                <div 
                  key={item.id || item.title} 
                  className="group flex flex-col bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 card-lift"
                >
                  {/* Visual Frame */}
                  <div 
                    className="relative aspect-[16/11] overflow-hidden bg-muted cursor-pointer"
                    onClick={() => setSelectedCaseStudy({ ...item, specs })}
                  >
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      fittingType="fill"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    
                    {/* Top Floating Badge */}
                    <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-2xs border border-border/50 text-[10px] uppercase tracking-wider font-semibold text-accent">
                      {item.room_type}
                    </div>

                    {/* Top Right Inspection Icon */}
                    <div className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="h-3.5 w-3.5 text-accent" />
                    </div>

                    {/* Bottom Metadata Overlay */}
                    <div className="absolute bottom-3 inset-x-4 z-10 flex items-center justify-between text-white/90 text-[11px] font-mono">
                      <span>{item.location || "Virar West"} · {item.year || "2024"}</span>
                      <span className="text-accent">{specs.footprint}</span>
                    </div>
                  </div>

                  {/* Editorial Case Study Details */}
                  <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <h3 
                        onClick={() => setSelectedCaseStudy({ ...item, specs })}
                        className="font-display text-xl text-foreground font-semibold leading-snug group-hover:text-accent transition-colors cursor-pointer"
                      >
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-light line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Specified Material Palette Chips */}
                    <div className="pt-3 border-t border-border/50">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                        Specified Finishes:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {specs.materials.map((mat, i) => (
                          <span 
                            key={i} 
                            className="bg-muted/60 text-foreground text-[10px] px-2 py-0.5 rounded-2xs border border-border/40 font-mono"
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedCaseStudy({ ...item, specs })}
                        className="text-xs uppercase tracking-widest font-semibold text-accent hover:text-foreground inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Case Study Dossier</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>

                      <Link
                        to="/visualizer"
                        className="text-[11px] text-muted-foreground hover:text-accent font-medium transition-colors"
                      >
                        Launch 3D Room →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── ARCHITECTURAL CASE STUDY DOSSIER MODAL ── */}
        <AnimatePresence>
          {selectedCaseStudy && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-card text-foreground rounded-2xl border border-border/80 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                  <Image
                    src={selectedCaseStudy.image_url}
                    alt={selectedCaseStudy.title}
                    className="w-full h-full object-cover"
                    fittingType="fill"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedCaseStudy(null)}
                    className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-black/60 text-white grid place-items-center hover:bg-black/90 transition-colors border border-white/20"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="badge-accent mb-2">
                      {selectedCaseStudy.room_type} · {selectedCaseStudy.location}
                    </span>
                    <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
                      {selectedCaseStudy.title}
                    </h2>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.22em] font-semibold text-accent mb-2">
                      Spatial Narrative
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed font-light">
                      {selectedCaseStudy.description} Executed with mill-calibrated hardwood substrates, concealed hardware profiles, and anti-fingerprint surface protection.
                    </p>
                  </div>

                  {/* Architectural Specifications Table */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-border/70 bg-muted/20 text-xs">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5">Footprint</span>
                      <span className="font-medium text-foreground">{selectedCaseStudy.specs.footprint}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5">Location</span>
                      <span className="font-medium text-foreground">{selectedCaseStudy.location}, Gujarat</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5">Year Completed</span>
                      <span className="font-medium text-foreground font-mono">{selectedCaseStudy.year || "2024"}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-0.5">Lighting Environment</span>
                      <span className="font-medium text-foreground">{selectedCaseStudy.specs.lighting}</span>
                    </div>
                  </div>

                  {/* Specified Finishes List */}
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.22em] font-semibold text-accent mb-3">
                      Specified Material Finishes
                    </h4>
                    <div className="space-y-2">
                      {selectedCaseStudy.specs.materials.map((mat, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xs border border-border/60 bg-card text-xs">
                          <span className="font-medium text-foreground">{mat}</span>
                          <span className="text-[10px] font-mono text-accent">Applied in Showroom</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/visualizer"
                      onClick={() => setSelectedCaseStudy(null)}
                      className="glow-amber flex-1 inline-flex h-12 items-center justify-center gap-2 bg-accent text-accent-foreground text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-accent/90 transition-all shadow-md"
                    >
                      Configure This Layout in 3D
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      to={`/inquiry?summary=Interested in replicating ${encodeURIComponent(selectedCaseStudy.title)} (${selectedCaseStudy.specs.footprint})`}
                      onClick={() => setSelectedCaseStudy(null)}
                      className="flex-1 inline-flex h-12 items-center justify-center border border-border/80 bg-background hover:bg-secondary text-foreground text-xs uppercase tracking-widest font-medium rounded-xs transition-colors"
                    >
                      Inquire For Similar Project
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
