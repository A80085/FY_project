import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, AlertTriangle, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { productService } from "@/services/productService";
import { formatINR, PRODUCT_SEED } from "@/lib/interiorData";
import { Image } from "@/components/ui/image";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
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

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <p className="text-muted-foreground text-sm uppercase tracking-widest animate-pulse">Loading specification…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center">
        <h1 className="font-display text-4xl text-primary mb-4">Material not found</h1>
        <Link to="/catalog" className="inline-block text-accent text-sm uppercase tracking-widest font-semibold hover:text-primary transition-colors">
          ← Return to catalog
        </Link>
      </div>
    );
  }

  const lowStock = product.stock <= (product.min_threshold || 10);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-background">
      <div className="container-px max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/catalog" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-muted-foreground hover:text-primary mb-12 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to collection
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Image Column - Sticky on desktop */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:sticky lg:top-32 relative aspect-[4/5] rounded-xl overflow-hidden bg-secondary border border-border shadow-2xl"
          >
            <Image
              src={product.image_url || "https://loremflickr.com/1200/800/interior,design?lock=26"}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
              fittingType="fill"
            />
          </motion.div>

          {/* Details Column */}
          <motion.div 
            variants={staggerContainer} initial="hidden" animate="visible"
            className="flex flex-col pt-4 lg:pt-10"
          >
            <motion.div variants={fadeInUp}>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-accent mb-3 block">
                {product.category} {product.subcategory ? `— ${product.subcategory}` : ""}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-primary leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-4 mb-8">SKU: {product.sku || "N/A"}</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-baseline gap-3 mb-8">
              <span className="font-display text-4xl font-medium text-primary">{formatINR(product.price)}</span>
              <span className="text-sm uppercase tracking-widest text-muted-foreground">{product.unit || "per sq.ft"}</span>
            </motion.div>

            <motion.p variants={fadeInUp} className="text-muted-foreground text-lg leading-relaxed font-light mb-12">
              {product.description}
            </motion.p>

            {/* Specifications Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-y-8 gap-x-4 border-y border-border py-8 mb-12">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Finish type</span>
                <span className="text-sm font-medium text-foreground">{product.finish || "Standard"}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Colour Family</span>
                <span className="text-sm font-medium text-foreground">{product.color_family || "Natural"}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Current Stock</span>
                <span className={`text-sm font-medium inline-flex items-center gap-1.5 ${lowStock ? "text-destructive" : "text-foreground"}`}>
                  {lowStock && <AlertTriangle className="h-3.5 w-3.5" />}
                  {product.stock} {product.unit?.includes("sheet") ? "sheets" : "units"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Availability</span>
                <span className="text-sm font-medium text-emerald-600 inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> In Showroom
                </span>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to={`/inquiry?summary=Interested in ${encodeURIComponent(product.name)} (SKU: ${product.sku})`}
                className="flex-1 inline-flex h-14 items-center justify-center bg-accent text-accent-foreground text-sm font-semibold tracking-wide uppercase rounded-sm hover:bg-accent/90 transition-all shadow-lg hover:shadow-accent/20"
              >
                Inquire for pricing
              </Link>
              <Link
                to="/estimate"
                className="flex-1 inline-flex h-14 items-center justify-center border border-primary/20 text-foreground text-sm font-semibold tracking-wide uppercase rounded-sm hover:bg-secondary transition-all"
              >
                Calculate estimate
              </Link>
            </motion.div>

            {/* Features list */}
            <motion.div variants={fadeInUp} className="space-y-4 text-xs font-medium text-muted-foreground">
              <p className="flex items-center gap-3"><Truck className="h-4 w-4 text-accent" /> Local delivery across Surat, Navsari, Valsad &amp; Vapi</p>
              <p className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-accent" /> Guaranteed authentic grade materials</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
