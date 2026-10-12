import React from "react";
import { Link } from "react-router-dom";
import { Package, ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { formatINR } from "@/lib/interiorData";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/catalog/${product.id}`}
      className="group flex flex-col bg-card border border-border/70 hover:border-accent/60 transition-all duration-300 rounded-sm overflow-hidden shadow-xs hover:shadow-lg card-lift"
    >
      <div className="aspect-[3/4] overflow-hidden bg-muted/40 relative">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            fittingType="fill"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-muted-foreground/60 bg-muted/20">
            <Package className="h-8 w-8 stroke-1" />
          </div>
        )}

        {/* Ambient subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="bg-background/90 backdrop-blur-md px-2.5 py-1 text-[9px] uppercase tracking-[0.22em] text-foreground font-semibold border border-border/40 shadow-xs">
            {product.category}
          </span>

          <div className="flex items-center gap-1.5">
            {typeof product.stock === "number" && product.min_threshold && product.stock <= product.min_threshold ? (
              <span className="bg-destructive/90 backdrop-blur-sm text-destructive-foreground px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] font-medium border border-destructive/30">
                Low stock
              </span>
            ) : product.is_featured ? (
              <span className="bg-accent text-accent-foreground px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] font-bold shadow-xs">
                Featured
              </span>
            ) : product.finish ? (
              <span className="bg-background/80 backdrop-blur-sm text-muted-foreground px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] font-medium border border-border/30">
                {product.finish}
              </span>
            ) : null}
          </div>
        </div>

        {/* Quick View Corner Hover Arrow */}
        <div className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-background/90 backdrop-blur-md border border-border/60 text-foreground grid place-items-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">
          <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-card">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent font-semibold">
              {product.subcategory || product.finish || "Architectural Spec"}
            </span>
            {product.color_family && (
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/80 font-mono">
                {product.color_family}
              </span>
            )}
          </div>

          <h3 className="font-display text-base sm:text-lg text-foreground font-medium leading-snug group-hover:text-accent transition-colors line-clamp-1">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 font-light leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-border/50 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-light mr-1.5">From</span>
            <span className="text-foreground font-display font-semibold text-base sm:text-lg">
              {formatINR(product.price)}
            </span>
            <span className="text-[11px] text-muted-foreground font-normal ml-1">
              /{product.unit || "unit"}
            </span>
          </div>

          {product.dimensions && (
            <span className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded-xs border border-border/30">
              {product.dimensions}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}