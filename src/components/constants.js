export const FINISH_PROPS = {
  matt: { roughness: 0.82, metalness: 0.0 },
  gloss: { roughness: 0.14, metalness: 0.0 },
  wood: { roughness: 0.48, metalness: 0.0 },
  metal: { roughness: 0.28, metalness: 0.88 },
  fabric: { roughness: 1.0, metalness: 0.0 },
  stone: { roughness: 0.32, metalness: 0.04 },
};

export const FINISH_MAP = {
  Matt: "matt", Glossy: "gloss", Natural: "wood", Sanded: "wood",
  Textured: "matt", Brushed: "metal", Plated: "metal", Polished: "stone",
};

export const COLOR_FAMILY_MAP = {
  Walnut: "#483220",
  Ivory: "#ede6d8",
  Brass: "#b08a4f",
  Nickel: "#9a9a9e",
  Natural: "#c9a97a",
  Teak: "#8a5a32",
  Charcoal: "#2c2a29",
  White: "#f4f1ec",
  Sage: "#88997a",
  Oak: "#b79263",
  Gold: "#c59b27",
};

export const BUILTIN_SLOTS = {
  floor: {
    label: "Floor",
    swatches: [
      { name: "Smoked Walnut Plank", brand: "Merino Laminated Flooring", code: "FLR-WN01", color: "#5a4329", finish: "wood", substrate: "High-Density Core" },
      { name: "Natural White Oak", brand: "Century Wood Flooring", code: "FLR-OK02", color: "#b79263", finish: "wood", substrate: "Brushed Timber Plank" },
      { name: "Calacatta Honed Quartz", brand: "Engineered Stone Slab", code: "QTZ-01", color: "#e8e4dc", finish: "stone", substrate: "Seamless 15mm Slab" },
      { name: "Charcoal Basalt Tile", brand: "Matte Porcelain", code: "TL-CH03", color: "#2b2b2e", finish: "stone", substrate: "Anti-Skid Matte Slab" },
      { name: "Ivory Botticino Marble", brand: "Imported Composite", code: "MRB-IV04", color: "#e9e2d4", finish: "stone", substrate: "Honed Finish Surface" },
    ],
  },
  walls: {
    label: "Walls",
    swatches: [
      { name: "Charcoal Slatted Paneling", brand: "Custom Millwork Slat", code: "WAL-SL01", color: "#2c2a29", finish: "wood", substrate: "Fluted Teak on 18mm BWP" },
      { name: "Warm Ivory Acrylic", brand: "Merino Anti-Fingerprint", code: "ACR-IV02", color: "#ede6d8", finish: "matt", substrate: "1.5mm Matte Acrylic Sheet" },
      { name: "Book-Matched Teak Veneer", brand: "Century Natural Veneer", code: "VEN-TK03", color: "#7a4d28", finish: "wood", substrate: "Natural Teak on Marine Ply" },
      { name: "Sage Heritage Velvet Matt", brand: "Textured Wall Finish", code: "WAL-SG04", color: "#88997a", finish: "matt", substrate: "Low-VOC Acoustic Texture" },
      { name: "Royal Navy High-Gloss", brand: "Greenlam Lacquered", code: "LAM-NV05", color: "#203045", finish: "gloss", substrate: "1mm High-Gloss Laminate" },
    ],
  },
  primary: {
    label: "Upholstery",
    swatches: [
      { name: "Warm Oatmeal Linen", brand: "Commercial Grade Textile", code: "FAB-OT01", color: "#cfc3a7", finish: "fabric", substrate: "Stain-Resistant Woven Linen" },
      { name: "Cognac Full-Grain Leather", brand: "Saddle Leather", code: "LTH-CG02", color: "#854823", finish: "fabric", substrate: "Supple Top-Grain Hide" },
      { name: "Charcoal Bouclé", brand: "Architectural Weave", code: "FAB-CH03", color: "#303033", finish: "fabric", substrate: "Heavy Textured Loop Bouclé" },
      { name: "Olive Drab Suede", brand: "Performance Velvet", code: "FAB-OL04", color: "#4a5342", finish: "fabric", substrate: "Microfiber Resilient Suede" },
      { name: "Terracotta Melange", brand: "Woven Textile", code: "FAB-TC05", color: "#924c38", finish: "fabric", substrate: "Natural Cotton Blend" },
    ],
  },
  cabinetry: {
    label: "Cabinetry",
    swatches: [
      { name: "Ivory Matte Acrylic", brand: "Merino Anti-Fingerprint", code: "CAB-ACR01", color: "#ece7de", finish: "matt", substrate: "18mm BWP + 1.5mm Acrylic" },
      { name: "Smoked Walnut Natural Veneer", brand: "Century Natural Veneer", code: "CAB-WN02", color: "#483220", finish: "wood", substrate: "Book-Matched 18mm Marine Ply" },
      { name: "Classic Burma Teak", brand: "Greenply Gold Veneer", code: "CAB-TK03", color: "#8a5a32", finish: "wood", substrate: "18mm BWP Core + Zero-Joint" },
      { name: "Graphite Anti-Scratch", brand: "Greenlam Laminates", code: "CAB-GR04", color: "#34363a", finish: "matt", substrate: "1mm Ultra-Matte Surface" },
      { name: "Aged Antique Brass Profile", brand: "Häfele Hardware", code: "HW-BR05", color: "#b08a4f", finish: "metal", substrate: "Extruded Aluminium Brass" },
    ],
  },
};

export const CATALOG_TO_SLOT = {
  floor: ["Laminates"],
  walls: ["Laminates", "Veneer"],
  cabinetry: ["Laminates", "Veneer", "Hardware", "Custom Pieces"],
};

