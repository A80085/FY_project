import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Boxes, Ruler, Sparkles, PaintBucket, Maximize } from "lucide-react";
import { productService } from "@/services/productService";
import { galleryService } from "@/services/galleryService";
import SectionHeading from "@/components/layout/SectionHeading";
import ProductCard from "@/components/site/ProductCard";
import { Image } from "@/components/ui/image";
import { GALLERY_SEED } from "@/lib/interiorData";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    productService.list("-created_date", 8)
      .then(setProducts)
      .catch(() => setProducts([]));
    galleryService.list("-created_date", 6)
      .then(setGallery)
      .catch(() => setGallery(GALLERY_SEED.slice(0, 6)));
  }, []);

  const featured = products.filter((p) => p.is_featured);
  const featuredDisplay = featured.length ? featured.slice(0, 4) : products.slice(0, 4);
  const heroGallery = gallery.length ? gallery : GALLERY_SEED.slice(0, 3);

  return (
    <div className="bg-background pt-20">
      {/* HERO - Clean, Split Layout */}
      <section className="container-px max-w-7xl mx-auto py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Shree Mangalam Interior Studio
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-primary leading-[1.1]">
            Structured spaces. <br className="hidden sm:block" />
            <span className="text-muted-foreground">Premium finishes.</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
            Engineered laminates, architectural hardware, and precision veneers for modern homes. Browse our catalog and configure your space in 3D with exacting detail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/catalog" className="inline-flex h-12 items-center justify-center gap-2 bg-primary text-primary-foreground px-8 text-sm font-semibold tracking-wide hover:bg-primary/90 transition-colors rounded-sm shadow-sm">
              Explore Catalog <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/visualizer" className="inline-flex h-12 items-center justify-center gap-2 border border-input bg-background text-foreground px-8 text-sm font-semibold tracking-wide hover:bg-secondary transition-colors rounded-sm shadow-sm">
              Launch 3D Configurator <Maximize className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="pt-8 border-t border-border grid grid-cols-3 gap-6">
            {[
              ["12+", "Years Est."],
              ["2.4k", "Projects"],
              ["180", "Finishes"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="text-2xl font-bold text-primary">{n}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 w-full">
          <div className="aspect-[4/3] rounded-sm overflow-hidden bg-secondary border border-border">
            <Image
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
              alt="Architectural interior"
              className="h-full w-full object-cover"
              fittingType="fill"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="border-y border-border bg-secondary/50">
        <div className="container-px max-w-7xl mx-auto py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            ["Laminates", Layers],
            ["Plywood", Boxes],
            ["Hardware", Sparkles],
            ["Veneer", PaintBucket],
            ["Custom", Ruler],
            ["Accessories", Boxes],
          ].map(([label, Icon]) => (
            <div key={label} className="flex flex-col items-center gap-3 p-4 bg-background border border-border rounded-sm hover:border-primary/50 transition-colors cursor-pointer shadow-sm">
              <Icon className="h-6 w-6 text-primary" />
              <span className="text-xs tracking-wider uppercase font-semibold text-primary">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ARCHITECTURAL INTRO */}
      <section className="section-y">
        <div className="container-px max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div className="order-2 lg:order-1 relative aspect-square rounded-sm overflow-hidden border border-border bg-secondary">
            <Image
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
              alt="Material detail"
              className="h-full w-full object-cover"
              fittingType="fill"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-background/90 to-transparent">
              <div className="bg-background border border-border p-4 rounded-sm shadow-sm inline-block">
                <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1">Specification</p>
                <p className="text-sm font-medium text-primary">Book-matched teak veneer, architectural grade.</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 lg:pt-12">
            <h2 className="text-3xl font-bold tracking-tight text-primary mb-4">Precision from selection to installation.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              We provide a seamless specification process for architects, designers, and homeowners. Access our digital catalog for exact material properties, or visualize the application before committing.
            </p>
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                ["Curated Finishes", "180+ laminates, veneers & acrylics. Rigorously tested for durability."],
                ["Made-to-Measure", "Precision CNC cutting and edge-banding on request."],
                ["Live Inventory", "Real-time stock data ensures your project stays on schedule."],
                ["Instant Estimates", "Calculate material costs programmatically based on your 3D layout."],
              ].map(([t, d]) => (
                <div key={t} className="flex flex-col gap-2">
                  <h4 className="font-semibold text-primary border-b border-border pb-2">{t}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section-y bg-secondary/30 border-t border-border">
        <div className="container-px max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-6 mb-8 border-b border-border pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-primary">Featured Materials</h2>
              <p className="text-sm text-muted-foreground mt-1">High-specification materials currently in stock.</p>
            </div>
            <Link to="/catalog" className="text-sm font-semibold hover:text-muted-foreground flex items-center gap-1 transition-colors">
              View catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDisplay.length ? (
              featuredDisplay.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <p className="col-span-full text-muted-foreground text-sm py-12 text-center border border-dashed border-border rounded-sm">Loading inventory data…</p>
            )}
          </div>
        </div>
      </section>

      {/* 3D CONFIGURATOR CTA */}
      <section className="section-y border-t border-border">
        <div className="container-px max-w-7xl mx-auto bg-primary rounded-sm overflow-hidden flex flex-col lg:flex-row">
          <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center">
            <div className="inline-flex w-fit items-center rounded-sm bg-primary-foreground/10 px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase text-primary-foreground mb-6">
              Interactive Tools
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Visualize before you build.
            </h2>
            <p className="text-primary-foreground/80 leading-relaxed mb-8 max-w-md">
              Configure room layouts, apply exact material textures from our catalog, and generate a bill of quantities instantly using our 3D visualization engine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/visualizer" className="inline-flex h-12 items-center justify-center gap-2 bg-background text-foreground px-6 text-sm font-semibold rounded-sm hover:bg-secondary transition-colors">
                Open 3D Configurator
              </Link>
              <Link to="/estimate" className="inline-flex h-12 items-center justify-center gap-2 border border-primary-foreground/20 text-primary-foreground px-6 text-sm font-semibold rounded-sm hover:bg-primary-foreground/10 transition-colors">
                Run Cost Estimate
              </Link>
            </div>
          </div>
          <div className="flex-1 relative min-h-[300px] lg:min-h-full">
             <Image
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80"
              alt="3D render wireframe"
              className="absolute inset-0 h-full w-full object-cover"
              fittingType="fill"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
