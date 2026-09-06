import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, AlertTriangle, ShieldCheck, Truck } from "lucide-react";
import { productService } from "@/services/productService";
import { formatINR, PRODUCT_SEED } from "@/lib/interiorData";
import { Image } from "@/components/ui/image";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <div className="pt-32 pb-24 text-center">
        <p className="text-muted-foreground text-sm">Loading material details…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h1 className="font-display text-3xl text-primary">Material not found</h1>
        <Link to="/catalog" className="mt-4 inline-block text-accent text-sm font-medium">← Back to catalog</Link>
      </div>
    );
  }

  const lowStock = product.stock <= (product.min_threshold || 10);

  return (
    <div className="pt-28 pb-24">
      <div className="container-px max-w-7xl mx-auto">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to catalog
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="relative aspect-square rounded-sm overflow-hidden bg-card border border-border shadow-sm">
            <Image
              src={product.image_url || "https://images.unsplash.com/photo-1567016526105-22da7c13161a?auto=format&fit=crop&w=1200&q=80"}
              alt={product.name}
              className="h-full w-full object-cover"
              fittingType="fill"
            />
          </div>

          <div>
            <span className="eyebrow text-accent">{product.category} {product.subcategory ? `· ${product.subcategory}` : ""}</span>
            <h1 className="font-display text-4xl sm:text-5xl text-primary mt-2">{product.name}</h1>
            <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku || "N/A"}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-primary">{formatINR(product.price)}</span>
              <span className="text-sm text-muted-foreground">{product.unit || "per sq.ft"}</span>
            </div>

            <p className="mt-6 text-muted-foreground text-sm leading-relaxed">{product.description}</p>

            <div className="mt-8 grid grid-cols-2 gap-4 border-y border-border py-6">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block">Finish type</span>
                <span className="text-sm font-medium text-foreground">{product.finish || "Standard"}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block">Colour Family</span>
                <span className="text-sm font-medium text-foreground">{product.color_family || "Natural"}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block">Current Stock</span>
                <span className={`text-sm font-medium inline-flex items-center gap-1 ${lowStock ? "text-destructive" : "text-foreground"}`}>
                  {lowStock && <AlertTriangle className="h-3.5 w-3.5" />}
                  {product.stock} {product.unit?.includes("sheet") ? "sheets" : "units"}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block">Availability</span>
                <span className="text-sm font-medium text-emerald-600 inline-flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> In Showroom
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to={`/inquiry?summary=Interested in ${encodeURIComponent(product.name)} (SKU: ${product.sku})`}
                className="flex-1 inline-flex items-center justify-center bg-accent text-accent-foreground py-3.5 text-sm font-medium rounded-sm hover:bg-accent/90 transition-colors shadow-sm"
              >
                Inquire for pricing &amp; sample
              </Link>
              <Link
                to="/estimate"
                className="flex-1 inline-flex items-center justify-center border border-border py-3.5 text-sm font-medium rounded-sm hover:border-accent transition-colors"
              >
                Calculate room estimate
              </Link>
            </div>

            <div className="mt-8 space-y-3 text-xs text-muted-foreground">
              <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-accent" /> Local delivery across Surat, Navsari, Valsad &amp; Vapi</p>
              <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> Guaranteed authentic grade materials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
