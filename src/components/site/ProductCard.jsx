import React from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Image } from "@/components/ui/image";
import { formatINR } from "@/lib/interiorData";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/catalog/${product.id}`}
      className="group flex flex-col bg-card border border-border hover:border-accent/50 transition-colors"
    >
      <div className="aspect-[4/5] overflow-hidden bg-muted relative">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            fittingType="fill"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-muted-foreground">
            <Package className="h-8 w-8" />
          </div>
        )}
        <span className="absolute top-3 left-3 bg-background/90 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground">
          {product.category}
        </span>
        {typeof product.stock === "number" && product.min_threshold && product.stock <= product.min_threshold && (
          <span className="absolute top-3 right-3 bg-destructive/90 text-destructive-foreground px-2 py-1 text-[10px] uppercase tracking-[0.2em]">
            Low stock
          </span>
        )}
        {product.is_featured && !(typeof product.stock === "number" && product.min_threshold && product.stock <= product.min_threshold) && (
          <span className="absolute top-3 right-3 bg-accent text-accent-foreground px-2 py-1 text-[10px] uppercase tracking-[0.2em]">
            Featured
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{product.finish || product.subcategory}</p>
        <h3 className="font-display text-lg text-foreground leading-snug">{product.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{product.description}</p>
        <div className="mt-3 flex items-end justify-between">
          <p className="text-primary font-medium">{formatINR(product.price)} <span className="text-xs text-muted-foreground font-normal">{product.unit}</span></p>
          <span className="text-[11px] text-muted-foreground">{product.color_family}</span>
        </div>
      </div>
    </Link>
  );
}