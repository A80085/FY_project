// Central data for Shree Mangalam Interior — room types, materials, estimate logic.
// Prices in INR (₹). Rates are illustrative "rough estimate" figures tuned for a
// regional interior retail showroom.

export const ROOM_TYPES = [
  { id: "living", name: "Living Room", baseRate: 650, icon: "Sofa", defaultDims: { length: 14, width: 12, height: 10 } },
  { id: "bedroom", name: "Bedroom", baseRate: 720, icon: "BedDouble", defaultDims: { length: 12, width: 11, height: 10 } },
  { id: "kitchen", name: "Modular Kitchen", baseRate: 1100, icon: "UtensilsCrossed", defaultDims: { length: 10, width: 8, height: 9 } },
  { id: "office", name: "Home Office", baseRate: 800, icon: "Briefcase", defaultDims: { length: 10, width: 9, height: 9 } },
  { id: "wardrobe", name: "Wardrobe Unit", baseRate: 950, icon: "DoorOpen", defaultDims: { length: 8, width: 2, height: 9 } },
];

export const WALL_FINISHES = [
  { id: "laminate-matt", name: "Matt Laminate", multiplier: 1.0, group: "Laminates" },
  { id: "laminate-gloss", name: "Glossy Laminate", multiplier: 1.15, group: "Laminates" },
  { id: "veneer", name: "Natural Veneer", multiplier: 1.55, group: "Veneer" },
  { id: "paint-acrylic", name: "Acrylic Wall Paint", multiplier: 0.8, group: "Paint" },
  { id: "wallpaper", name: "Textured Wallpaper", multiplier: 1.05, group: "Wallpaper" },
];

export const FLOORING_OPTIONS = [
  { id: "laminate-floor", name: "Laminate Flooring", multiplier: 1.0, group: "Flooring" },
  { id: "vinyl", name: "Vinyl Plank", multiplier: 0.9, group: "Flooring" },
  { id: "engineered-wood", name: "Engineered Wood", multiplier: 1.6, group: "Flooring" },
  { id: "vitrified-tile", name: "Vitrified Tile", multiplier: 1.2, group: "Flooring" },
];

export const HARDWARE_OPTIONS = [
  { id: "standard", name: "Standard Hardware", multiplier: 1.0, addPerSqft: 0 },
  { id: "premium", name: "Premium Soft-close", multiplier: 1.0, addPerSqft: 45 },
  { id: "luxury", name: "Luxury Brass Fittings", multiplier: 1.0, addPerSqft: 95 },
];

export const FURNISHING_ADDONS = [
  { id: "false-ceiling", name: "False Ceiling", perSqft: 120 },
  { id: "cove-light", name: "Cove Lighting", perSqft: 80 },
  { id: "wall-panelling", name: "Wall Panelling", perSqft: 180 },
];

// One-tap templates for the power-user Custom tab — editable after adding.
export const CUSTOM_PRESETS = [
  { name: "Skirting (running ft)", qty: 1, unit: "ft", rate: 65 },
  { name: "Curtain track & fitting", qty: 1, unit: "set", rate: 1200 },
  { name: "Door polish (per side)", qty: 1, unit: "door", rate: 1800 },
  { name: "Electrical points", qty: 1, unit: "point", rate: 450 },
  { name: "Demolition & debris", qty: 1, unit: "lot", rate: 3500 },
];

import { settingsService } from "@/services/settingsService";

export const ROOM_DARK_TO_LIGHT = ["#2a2118", "#3b3023", "#6b5640", "#a78a66", "#cbb38a", "#e7dcc9", "#f4efe6"];

export function calcEstimate({ room, dims, wall, floor, hardware, addons, customItems }) {
  const roomType = ROOM_TYPES.find((r) => r.id === room);
  const wallOpt = WALL_FINISHES.find((w) => w.id === wall);
  const floorOpt = FLOORING_OPTIONS.find((f) => f.id === floor);
  const hwOpt = HARDWARE_OPTIONS.find((h) => h.id === hardware);
  if (!roomType || !wallOpt || !floorOpt || !hwOpt) return null;

  const floorArea = dims.length * dims.width;
  const wallArea = 2 * (dims.length + dims.width) * dims.height * 0.6; // openings factor
  const ceilingArea = floorArea;

  const wallCost = wallArea * roomType.baseRate * wallOpt.multiplier;
  const floorCost = floorArea * roomType.baseRate * floorOpt.multiplier * 0.9;
  const hwCost = (wallArea + floorArea) * hwOpt.addPerSqft;
  const addonTotal = (addons || []).reduce((sum, id) => {
    const a = FURNISHING_ADDONS.find((x) => x.id === id);
    return sum + (a ? a.perSqft * (a.id === "false-ceiling" ? ceilingArea : wallArea) : 0);
  }, 0);

  const customs = (customItems || []).filter((c) => c.name && c.qty > 0 && c.rate >= 0);
  const customTotal = customs.reduce((sum, c) => sum + Number(c.qty) * Number(c.rate), 0);

  const subtotal = wallCost + floorCost + hwCost + addonTotal + customTotal;
  
  const settings = settingsService.getSettings();
  const labourRate = (settings.labourRate || 18) / 100;
  const gstRate = (settings.gstRate || 5) / 100;

  const labour = subtotal * labourRate;
  const gst = (subtotal + labour) * gstRate;
  const total = subtotal + labour + gst;

  return {
    breakdown: [
      { label: `${wallOpt.name} (walls · ${wallArea.toFixed(0)} sq.ft)`, value: Math.round(wallCost) },
      { label: `${floorOpt.name} (floor · ${floorArea.toFixed(0)} sq.ft)`, value: Math.round(floorCost) },
      { label: `${hwOpt.name} (hardware)`, value: Math.round(hwCost) },
      ...((addons || []).map((id) => {
        const a = FURNISHING_ADDONS.find((x) => x.id === id);
        return { label: a.name, value: Math.round(a.perSqft * (a.id === "false-ceiling" ? ceilingArea : wallArea)) };
      })),
      ...(customs.map((c) => ({ label: `${c.name} (${c.qty} ${c.unit})`, value: Math.round(Number(c.qty) * Number(c.rate)) }))),
      { label: `Labour & installation (${settings.labourRate || 18}%)`, value: Math.round(labour) },
      { label: `GST (${settings.gstRate || 5}%)`, value: Math.round(gst) },
    ],
    subtotal: Math.round(subtotal),
    labour: Math.round(labour),
    gst: Math.round(gst),
    customTotal: Math.round(customTotal),
    total: Math.round(total),
    perSqft: Math.round(total / floorArea),
  };
}

export function formatINR(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

// Curated gallery imagery (Unsplash). Reused across gallery + home.
export const GALLERY_SEED = [
  { title: "Walnut Living Suite", room_type: "Living Room", category: "Modern", location: "Surat", year: "2024", is_featured: true, image_url: "https://loremflickr.com/1200/800/interior,design?lock=2", description: "A warm walnut-and-ivory living room with fluted panelling and brushed-brass accents." },
  { title: "Ivory Modular Kitchen", room_type: "Kitchen", category: "Minimalist", location: "Navsari", year: "2024", is_featured: true, image_url: "https://loremflickr.com/1200/800/interior,design?lock=3", description: "Handleless acrylic kitchen with quartz countertop and integrated appliances." },
  { title: "Tranquil Master Bedroom", room_type: "Bedroom", category: "Scandinavian", location: "Bardoli", year: "2023", is_featured: true, image_url: "https://loremflickr.com/1200/800/interior,design?lock=4", description: "Soft oak wardrobe, linen headboard and layered warm lighting." },
  { title: "Industrial Dining Nook", room_type: "Dining", category: "Industrial", location: "Surat", year: "2023", is_featured: false, image_url: "https://loremflickr.com/1200/800/interior,design?lock=5", description: "Exposed concrete, blackened-steel frames and a reclaimed-teak table." },
  { title: "Heritage Veneer Lounge", room_type: "Living Room", category: "Classic", location: "Valsad", year: "2022", is_featured: false, image_url: "https://loremflickr.com/1200/800/interior,design?lock=6", description: "Book-matched teak veneer with classical cornices and brass inlay." },
  { title: "Minimalist Home Office", room_type: "Office", category: "Minimalist", location: "Surat", year: "2024", is_featured: false, image_url: "https://loremflickr.com/1200/800/interior,design?lock=7", description: "Floating desk, matt laminate storage and a calm neutral palette." },
];

export const PRODUCT_SEED = [
  { id: "p1", name: "Royal Walnut Laminate", sku: "LAM-RW-102", category: "Laminates", subcategory: "Matt", price: 145, unit: "per sq.ft", stock: 320, min_threshold: 80, finish: "Matt", color_family: "Walnut", is_featured: true, image_url: "https://loremflickr.com/1200/800/interior,design?lock=8", description: "Deep walnut-tone matt laminate with a subtle linear grain. Ideal for wardrobes and living panelling." },
  { id: "p2", name: "Ivory Gloss Acrylic", sku: "LAM-IG-204", category: "Laminates", subcategory: "Glossy", price: 210, unit: "per sq.ft", stock: 140, min_threshold: 60, finish: "Glossy", color_family: "Ivory", is_featured: true, image_url: "https://loremflickr.com/1200/800/interior,design?lock=9", description: "High-gloss acrylic sheet with mirror finish. Premium choice for modular kitchens." },
  { id: "p3", name: "Brushed Brass Handle", sku: "HW-BH-330", category: "Hardware", subcategory: "Drawer Handle", price: 480, unit: "per piece", stock: 24, min_threshold: 30, finish: "Brushed", color_family: "Brass", is_featured: false, image_url: "https://loremflickr.com/1200/800/interior,design?lock=10", description: "Solid brushed-brass bar handle. 128mm centres. Premium soft-touch grip." },
  { id: "p4", name: "Soft-close Hinge (Pair)", sku: "HW-SCH-018", category: "Hardware", subcategory: "Hinge", price: 260, unit: "per piece", stock: 18, min_threshold: 40, finish: "Plated", color_family: "Nickel", is_featured: false, image_url: "https://loremflickr.com/1200/800/interior,design?lock=11", description: "Full-overlay soft-close hinge with 110° opening. 35mm cup." },
  { id: "p5", name: "BWP Marine Plywood 18mm", sku: "PLY-MP-18", category: "Plywood", subcategory: "Marine", price: 1850, unit: "per sheet", stock: 45, min_threshold: 20, finish: "Sanded", color_family: "Natural", is_featured: true, image_url: "https://loremflickr.com/1200/800/interior,design?lock=12", description: "BWP-grade marine plywood, 18mm. Boiling-water proof, ideal for kitchens and bathrooms." },
  { id: "p6", name: "Teak Natural Veneer", sku: "VEN-TN-011", category: "Veneer", subcategory: "Natural", price: 620, unit: "per sq.ft", stock: 88, min_threshold: 25, finish: "Natural", color_family: "Teak", is_featured: true, image_url: "https://loremflickr.com/1200/800/interior,design?lock=13", description: "Book-matched natural teak veneer sheet. Warm tone with cathedral grain." },
  { id: "p7", name: "Charcoal Fluted Panel", sku: "ACC-CF-505", category: "Accessories", subcategory: "Wall Panel", price: 540, unit: "per sq.ft", stock: 12, min_threshold: 15, finish: "Textured", color_family: "Charcoal", is_featured: false, image_url: "https://loremflickr.com/1200/800/interior,design?lock=14", description: "Pre-finished fluted MDF panel in deep charcoal. For feature walls." },
  { id: "p8", name: "Quartz Countertop Slab", sku: "CUS-QC-700", category: "Custom Pieces", subcategory: "Countertop", price: 1450, unit: "per sq.ft", stock: 7, min_threshold: 5, finish: "Polished", color_family: "White", is_featured: true, image_url: "https://loremflickr.com/1200/800/interior,design?lock=15", description: "Calacatta-vein quartz slab, 20mm. Non-porous, stain-resistant countertop." },
];