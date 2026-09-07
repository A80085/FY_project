import React, { useEffect, useState } from "react";
import { galleryService } from "@/services/galleryService";
import PageHero from "@/components/layout/PageHero";
import { GALLERY_SEED } from "@/lib/interiorData";

const ROOM_TYPES = ["All", "Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Dining"];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("All");

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
    <div className="pb-24">
      <PageHero
        eyebrow="Project Gallery"
        title="Delivered interiors across South Gujarat"
        description="Explore finished living spaces, modular kitchens, master bedrooms and office setups fitted by Shree Mangalam Interior Studio."
        image="https://loremflickr.com/1200/800/interior,design?lock=20"
      />
      <div className="container-px max-w-7xl mx-auto pt-10">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {ROOM_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-4 py-2 text-xs tracking-wide rounded-sm border transition-colors ${
                activeType === t ? "bg-primary text-primary-foreground border-primary font-medium" : "border-border hover:border-accent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground text-sm py-12">Loading gallery…</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div key={item.id || item.title} className="group bg-card border border-border rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur text-primary-foreground px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-sm font-semibold">
                    {item.room_type}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>{item.category || "Modern"}</span>
                    <span>{item.location || "Surat"} {item.year ? `· ${item.year}` : ""}</span>
                  </div>
                  <h3 className="font-display text-xl text-primary font-bold">{item.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
