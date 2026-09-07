import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { productService } from "@/services/productService";
import ProductCard from "@/components/site/ProductCard";
import PageHero from "@/components/layout/PageHero";
import { PRODUCT_SEED } from "@/lib/interiorData";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["All", "Laminates", "Plywood", "Hardware", "Veneer", "Custom Pieces", "Accessories"];

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [params] = useSearchParams();

  useEffect(() => {
    productService.list("-created_date", 200)
      .then((data) => {
        setProducts(data.length ? data : PRODUCT_SEED);
        setLoading(false);
      })
      .catch(() => {
        setProducts(PRODUCT_SEED);
        setLoading(false);
      });
    const c = params.get("category");
    if (c) setCategory(c);
  }, [params]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const okCat = category === "All" || p.category === category;
      const okQ = !query || `${p.name} ${p.color_family || ""} ${p.finish || ""} ${p.subcategory || ""}`.toLowerCase().includes(query.toLowerCase());
      return okCat && okQ;
    });
  }, [products, category, query]);

  return (
    <div className="pb-24">
      <PageHero
        eyebrow="Material Catalog"
        title="Browse our full range"
        description="Filter by category and search by finish, colour family or name. Prices are indicative and may vary with custom sizing."
        image="https://loremflickr.com/1200/800/interior,design?lock=18"
      />
      <div className="container-px max-w-7xl mx-auto pt-10">
        {/* controls */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 text-xs tracking-wide font-medium rounded-sm border transition-colors ${
                  category === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search finishes, colours…"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="w-full aspect-[4/5] rounded-sm" />
                <Skeleton className="h-4 w-3/4 mt-2" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-1/4 mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-5">{filtered.length} item{filtered.length !== 1 && "s"}</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            {!filtered.length && (
              <p className="text-center text-muted-foreground py-20 text-sm">No materials match your search.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
