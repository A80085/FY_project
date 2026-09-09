import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Ruler, Maximize, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { productService } from "@/services/productService";
import { galleryService } from "@/services/galleryService";
import ProductCard from "@/components/site/ProductCard";
import { Image } from "@/components/ui/image";
import { GALLERY_SEED } from "@/lib/interiorData";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
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

export default function Home() {
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    productService.list("-created_date", 8).then(setProducts).catch(() => setProducts([]));
    galleryService.list("-created_date", 6).then(setGallery).catch(() => setGallery(GALLERY_SEED.slice(0, 6)));
  }, []);

  const featured = products.filter((p) => p.is_featured);
  const featuredDisplay = featured.length ? featured.slice(0, 4) : products.slice(0, 4);

  return (
    <div className="bg-background min-h-screen text-foreground overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-12">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/images/hero_interior_1788941933675.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover"
            fittingType="fill"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>
        
        <div className="container-px max-w-7xl mx-auto relative z-10 w-full">
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-primary">
                Shree Mangalam Interior Studio
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl sm:text-7xl lg:text-[5.5rem] font-display font-medium tracking-tight text-primary leading-[1.05] mb-8">
              Crafting timeless <br className="hidden sm:block" />
              <span className="text-muted-foreground italic font-light">architectural spaces.</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 font-light">
              Elevate your interiors with engineered laminates, bespoke hardware, and precision veneers. Experience our collection through an immersive 3D lens.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5">
              <Link to="/catalog" className="group inline-flex h-14 items-center justify-center gap-3 bg-primary text-primary-foreground px-8 text-sm font-semibold tracking-wide hover:bg-primary/90 transition-all rounded-sm shadow-xl">
                Explore Collection <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/visualizer" className="group inline-flex h-14 items-center justify-center gap-3 border border-primary/20 bg-background/50 backdrop-blur-sm text-foreground px-8 text-sm font-semibold tracking-wide hover:bg-secondary transition-all rounded-sm">
                Open 3D Configurator <Maximize className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* METRICS / STATS (Scroll Reveal) */}
      <section className="py-20 bg-background border-t border-border/50">
        <div className="container-px max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16 divide-x divide-border/50"
          >
            {[
              ["12+", "Years established"],
              ["2.4k", "Projects delivered"],
              ["180+", "Curated finishes"],
              ["3D", "Live visualization"]
            ].map(([stat, label], i) => (
              <motion.div key={i} variants={fadeInUp} className="pl-6 md:pl-10 first:pl-0 first:border-0 border-l-0 md:border-l">
                <p className="text-4xl md:text-5xl font-display text-primary mb-2">{stat}</p>
                <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ASYMMETRIC BENTO GRID - ARCHITECTURAL INTRO */}
      <section className="py-24 bg-secondary/30">
        <div className="container-px max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-primary mb-6">Precision engineered.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl font-light leading-relaxed">
              We provide a seamless specification process for architects, designers, and homeowners. Our digital catalog guarantees exact material properties for your vision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Bento Box 1 - Large Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group"
            >
              <Image src="/images/gallery_lounge_1788942051775.jpg" alt="Material" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" fittingType="fill" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-sm uppercase tracking-widest font-semibold mb-2 opacity-80">Specification</p>
                <p className="text-xl font-display">Book-matched teak veneer, architectural grade.</p>
              </div>
            </motion.div>

            {/* Bento Box 2 - Service */}
            <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }} className="bg-background rounded-xl p-8 border border-border flex flex-col justify-between hover:border-primary/30 transition-colors">
              <Layers className="h-8 w-8 text-primary/60 mb-4" />
              <div>
                <h3 className="text-xl font-display text-primary mb-3">Curated Finishes</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">180+ laminates, veneers & acrylics. Rigorously tested for durability and aesthetic perfection.</p>
              </div>
            </motion.div>

            {/* Bento Box 3 - Service */}
            <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }} className="bg-primary text-primary-foreground rounded-xl p-8 flex flex-col justify-between">
              <Ruler className="h-8 w-8 text-primary-foreground/60 mb-4" />
              <div>
                <h3 className="text-xl font-display mb-3">Made-to-Measure</h3>
                <p className="text-primary-foreground/80 text-sm leading-relaxed">Precision CNC cutting and edge-banding on request, ensuring a flawless fit.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="py-24 bg-background">
        <div className="container-px max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display text-primary mb-4">Featured Collection</h2>
              <p className="text-muted-foreground text-lg font-light">High-specification materials currently in stock.</p>
            </div>
            <Link to="/catalog" className="group flex items-center gap-2 text-sm uppercase tracking-widest font-semibold text-primary hover:text-muted-foreground transition-colors">
              View full catalog <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredDisplay.length ? (
              featuredDisplay.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }}>
                  <ProductCard product={p} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-muted-foreground text-sm py-12 text-center border border-dashed border-border rounded-sm">Loading inventory data…</p>
            )}
          </div>
        </div>
      </section>

      {/* 3D CONFIGURATOR HERO */}
      <section className="py-24 bg-background">
        <div className="container-px max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden bg-primary min-h-[500px] flex items-center"
          >
            <div className="absolute inset-0 z-0 w-full lg:w-1/2 left-1/2 hidden lg:block">
               <Image src="/images/gallery_bedroom_1788942008850.jpg" alt="3D wireframe" className="h-full w-full object-cover opacity-60" fittingType="fill" />
               <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent" />
            </div>
            
            <div className="relative z-10 w-full lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center">
              <span className="inline-flex w-fit items-center rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-primary-foreground mb-8">
                Interactive Technology
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display text-primary-foreground mb-6 leading-tight">
                Visualize before <br /> you build.
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed mb-10 font-light max-w-md">
                Configure room layouts, apply exact material textures, and generate a bill of quantities instantly using our 3D engine.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link to="/visualizer" className="inline-flex h-14 items-center justify-center bg-background text-foreground px-8 text-sm font-semibold tracking-wide rounded-sm hover:scale-105 transition-transform shadow-lg">
                  Launch 3D Configurator
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
