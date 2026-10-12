import React from "react";
import PageHero from "@/components/PageHero";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  ArrowUpRight
} from "lucide-react";
import { Image } from "@/components/ui/image";

const TIMELINE = [
  {
    year: "2010",
    title: "The Artisanal Joinery Genesis",
    desc: "Founded as a specialized timber and plywood workshop in Virar West, dedicated to hand-selecting genuine BWP marine plywood, natural teak, and veneers for residential and commercial interiors."
  },
  {
    year: "2016",
    title: "Zero-Joint Hot-Air Edgebanding",
    desc: "Pioneered computerized beam sizing and seamless hot-air edgebanding in South Gujarat, eliminating visible glue lines and preventing tropical humidity peeling."
  },
  {
    year: "2021",
    title: "Parametric 3D Material Simulation",
    desc: "Introduced browser-based interactive 3D spatial simulation, allowing visionary homeowners and architects to evaluate grain alignment and light reflection prior to fabrication."
  },
  {
    year: "2026",
    title: "The Flagship Experience Atelier",
    desc: "Expanded into an architectural archive housing 180+ curated laminates, acrylics, and artisanal hardware specimens serving projects across Mumbai, Palghar, Thane, and Gujarat."
  }
];

const PILLARS = [
  {
    num: "I",
    title: "Direct Forest & Mill Provenance",
    desc: "Every veneer log is inspected at source for moisture equilibrium and grain fidelity. FSC-certified sustainable harvesting with complete chain-of-custody documentation."
  },
  {
    num: "II",
    title: "Zero-Joint Edgebanding Precision",
    desc: "Precision hot-air laser edge application seals panel substrates against coastal humidity, creating an invisible structural transition that outperforms conventional adhesive banding."
  },
  {
    num: "III",
    title: "Real-Time 3D Parametric Simulation",
    desc: "Our RoomSketch 3D technology tests daylight conditions (3200K to 5500K) and grain alignment before cutting a single sheet, eliminating costly on-site surprises."
  },
  {
    num: "IV",
    title: "Atelier Concierge & White-Glove Handover",
    desc: "From physical 10×10cm sample delivery to on-site carpenter guidance, our dedicated atelier concierges coordinate every phase with micrometer tolerances."
  }
];

export default function About() {
  return (
    <div className="pb-24 bg-background text-foreground">
      <PageHero
        eyebrow="Architectural Heritage &amp; Craft"
        title="The Virar West Millwork Atelier"
        description="Crafting bespoke architectural laminates, hand-matched veneers, and precision hardware since 2010."
        image="/images/gallery_walnut_1788941961232.jpg"
      />

      <div className="container-px max-w-7xl mx-auto pt-16 sm:pt-20 space-y-28">
        
        {/* ── 1. PROVENANCE STORY SPLIT ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="badge-accent">
              • CHAPTER 01 · OUR PHILOSOPHY
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground leading-[1.12]">
              Materiality is the soul of <br />
              <span className="italic font-light text-accent">architectural permanence.</span>
            </h2>
            <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed font-light">
              <p>
                In an era of mass-manufactured, disposable synthetic interiors, Shree Mangalam Interior Studio was established on a different premise: that architectural woodwork should age with grace, dignity, and structural endurance.
              </p>
              <p>
                What began as a localized timber atelier on Old Viva College Road in Virar West has grown into a comprehensive specification house for discerning architects, luxury homeowners, and interior designers across Mumbai, Palghar, and Western India.
              </p>
              <p>
                We unite time-tested master carpenter joinery with digital 3D parametric visualization and computerized CNC precision—guaranteeing that what you specify digitally is executed with millimeter accuracy on your site.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-6 text-xs font-mono text-muted-foreground">
              <span>✦ VIRAR WEST FLAGSHIP</span>
              <span>✦ 12+ YEARS HERITAGE</span>
              <span>✦ FSC CERTIFIED</span>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden border border-border/80 shadow-2xl bg-muted relative group">
              <Image 
                src="/images/about_studio_1788941947938.jpg" 
                alt="Shree Mangalam Interior Workshop" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                fittingType="fill" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              
              {/* Floating Architectural Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xs bg-background/90 backdrop-blur-md border border-border/60 text-foreground">
                <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent mb-1">
                  Atelier Archive Ref: EST-2010
                </p>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Where Hand Craftsmanship Meets CNC Exactness
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. THE CHRONOLOGICAL HERITAGE TIMELINE ── */}
        <section className="border-t border-border/60 pt-20">
          <div className="max-w-2xl mb-14">
            <span className="badge-accent mb-3">Historical Provenance</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-foreground">
              Sixteen years of architectural evolution.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base font-light mt-3 leading-relaxed">
              Trace the defining milestones that transformed our Virar timber workshop into a state-of-the-art digital interior studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TIMELINE.map((step, idx) => (
              <div 
                key={idx} 
                className="relative p-6 sm:p-7 rounded-xl border border-border/70 bg-card flex flex-col justify-between hover:border-accent/50 transition-all card-lift shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
                    <span className="font-display text-3xl font-bold text-accent">
                      {step.year}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
                      Era {idx + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. THE 4 PILLARS OF ARCHITECTURAL MILLWORK ── */}
        <section className="wood-panel-dark text-white rounded-2xl p-8 sm:p-12 lg:p-16 border border-border/40 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mb-12 relative z-10">
            <span className="badge-accent mb-3">Architectural Standard</span>
            <h2 className="text-3xl sm:text-4xl font-display font-medium text-white">
              The Four Pillars of Millwork Excellence.
            </h2>
            <p className="text-white/80 text-sm font-light mt-2 leading-relaxed">
              Why leading residential architects and interior designers consistently specify Shree Mangalam finishes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {PILLARS.map((pillar, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xs flex gap-5">
                <span className="font-display text-2xl font-bold text-accent shrink-0 pt-0.5">
                  {pillar.num}
                </span>
                <div className="space-y-2">
                  <h3 className="font-display text-lg font-semibold text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. MACRO CRAFTSMANSHIP PHOTO JOURNAL ── */}
        <section className="border-t border-border/60 pt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="badge-accent mb-3">Visual Archive</span>
              <h2 className="text-3xl sm:text-4xl font-display font-medium text-foreground">
                Tactile Materiality &amp; Joinery
              </h2>
              <p className="text-muted-foreground text-sm font-light mt-2">
                A closer look at the raw timber pores, solid brass knurling, and architectural finishes.
              </p>
            </div>
            <Link to="/gallery" className="text-xs uppercase tracking-widest font-semibold text-accent hover:text-foreground inline-flex items-center gap-1.5 transition-colors">
              <span>View Finished Projects</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="aspect-[4/5] rounded-xl overflow-hidden border border-border/80 bg-muted group relative">
              <Image 
                src="/images/store_suspended_timber.jpg" 
                alt="Suspended Timber and Veneer Gallery" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                fittingType="fill" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <p className="text-[10px] uppercase tracking-widest text-accent font-semibold">Showroom Atelier</p>
                <p className="text-sm font-display font-medium">Suspended Slabs &amp; Rotating Louvers</p>
              </div>
            </div>

            <div className="aspect-[4/5] rounded-xl overflow-hidden border border-border/80 bg-muted group relative">
              <Image 
                src="/images/store_material_library.png" 
                alt="Physical Material Library Swatch Wall" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                fittingType="fill" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <p className="text-[10px] uppercase tracking-widest text-accent font-semibold">Swatch Wall Archive</p>
                <p className="text-sm font-display font-medium">Choose Your Material Library</p>
              </div>
            </div>

            <div className="aspect-[4/5] rounded-xl overflow-hidden border border-border/80 bg-muted group relative">
              <Image 
                src="/images/showroom_arched_millwork_bespoke.jpg" 
                alt="Custom Arched Millwork Display" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                fittingType="fill" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <p className="text-[10px] uppercase tracking-widest text-accent font-semibold">Bespoke Joinery</p>
                <p className="text-sm font-display font-medium">Arched Cabinetry &amp; Walnut Shelving</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. VISIT THE FLAGSHIP SHOWROOM ATELIER ── */}
        <section className="rounded-2xl border border-border/80 bg-card p-8 sm:p-12 lg:p-16 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="badge-accent">
                • FLAGSHIP EXPERIENCE SHOWROOM
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-medium text-foreground">
                Visit Shree Mangalam Showroom
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed max-w-2xl">
                Experience physical samples under calibrated showroom lighting. Meet our millwork and timber experts to discuss your residential or commercial floorplan.
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-muted-foreground font-mono">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>Shop No. 06, Kusum Vihar 'A', Old Viva College Road, Virar West - 401303</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span>Monday – Saturday: 10:00 AM – 8:30 PM</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link 
                to="/inquiry" 
                className="glow-amber inline-flex h-14 items-center justify-center gap-2 bg-accent text-accent-foreground text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-accent/90 transition-all shadow-md"
              >
                Book Studio Appointment <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                to="/catalog" 
                className="inline-flex h-12 items-center justify-center border border-border/80 bg-background hover:bg-secondary text-foreground text-xs uppercase tracking-widest font-medium rounded-xs transition-colors"
              >
                Browse Digital Archive First
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
