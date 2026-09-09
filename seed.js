import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDt9ZKTxNQTXS9ZQS09tFxxNihc4T_LBQI",
  authDomain: "mangalam-fy-2026-7c2e3.firebaseapp.com",
  projectId: "mangalam-fy-2026-7c2e3",
  storageBucket: "mangalam-fy-2026-7c2e3.firebasestorage.app",
  messagingSenderId: "658497909616",
  appId: "1:658497909616:web:b299e2ed6b775f1cdc55b5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const GALLERY_SEED = [
  { title: "Walnut Living Suite", room_type: "Living Room", category: "Modern", location: "Surat", year: "2024", is_featured: true, image_url: "/images/gallery_walnut_1788941961232.jpg", description: "A warm walnut-and-ivory living room with fluted panelling and brushed-brass accents." },
  { title: "Ivory Modular Kitchen", room_type: "Kitchen", category: "Minimalist", location: "Navsari", year: "2024", is_featured: true, image_url: "/images/gallery_kitchen_1788941976982.jpg", description: "Handleless acrylic kitchen with quartz countertop and integrated appliances." },
  { title: "Tranquil Master Bedroom", room_type: "Bedroom", category: "Scandinavian", location: "Bardoli", year: "2023", is_featured: true, image_url: "/images/gallery_bedroom_1788942008850.jpg", description: "Soft oak wardrobe, linen headboard and layered warm lighting." },
  { title: "Industrial Dining Nook", room_type: "Dining", category: "Industrial", location: "Surat", year: "2023", is_featured: false, image_url: "/images/gallery_dining_1788942028543.jpg", description: "Exposed concrete, blackened-steel frames and a reclaimed-teak table." },
  { title: "Heritage Veneer Lounge", room_type: "Living Room", category: "Classic", location: "Valsad", year: "2022", is_featured: false, image_url: "/images/gallery_lounge_1788942051775.jpg", description: "Book-matched teak veneer with classical cornices and brass inlay." },
  { title: "Minimalist Home Office", room_type: "Office", category: "Minimalist", location: "Surat", year: "2024", is_featured: false, image_url: "/images/gallery_office_1788942067114.jpg", description: "Floating desk, matt laminate storage and a calm neutral palette." },
];

const PRODUCT_SEED = [
  { id: "p1", name: "Royal Walnut Laminate", sku: "LAM-RW-102", category: "Laminates", subcategory: "Matt", price: 145, unit: "per sq.ft", stock: 320, min_threshold: 80, finish: "Matt", color_family: "Walnut", is_featured: true, image_url: "/images/prod_walnut_lam_1788942098886.jpg", description: "Deep walnut-tone matt laminate with a subtle linear grain. Ideal for wardrobes and living panelling." },
  { id: "p2", name: "Ivory Gloss Acrylic", sku: "LAM-IG-204", category: "Laminates", subcategory: "Glossy", price: 210, unit: "per sq.ft", stock: 140, min_threshold: 60, finish: "Glossy", color_family: "Ivory", is_featured: true, image_url: "/images/prod_ivory_acrylic_1788942113723.jpg", description: "High-gloss acrylic sheet with mirror finish. Premium choice for modular kitchens." },
  { id: "p3", name: "Brushed Brass Handle", sku: "HW-BH-330", category: "Hardware", subcategory: "Drawer Handle", price: 480, unit: "per piece", stock: 24, min_threshold: 30, finish: "Brushed", color_family: "Brass", is_featured: false, image_url: "/images/prod_brass_handle_1788942126754.jpg", description: "Solid brushed-brass bar handle. 128mm centres. Premium soft-touch grip." },
  { id: "p4", name: "Soft-close Hinge (Pair)", sku: "HW-SCH-018", category: "Hardware", subcategory: "Hinge", price: 260, unit: "per piece", stock: 18, min_threshold: 40, finish: "Plated", color_family: "Nickel", is_featured: false, image_url: "/images/prod_hinge_1788942139766.jpg", description: "Full-overlay soft-close hinge with 110 deg opening. 35mm cup." },
  { id: "p5", name: "BWP Marine Plywood 18mm", sku: "PLY-MP-18", category: "Plywood", subcategory: "Marine", price: 1850, unit: "per sheet", stock: 45, min_threshold: 20, finish: "Sanded", color_family: "Natural", is_featured: true, image_url: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80", description: "BWP-grade marine plywood, 18mm. Boiling-water proof, ideal for kitchens and bathrooms." },
  { id: "p6", name: "Teak Natural Veneer", sku: "VEN-TN-011", category: "Veneer", subcategory: "Natural", price: 620, unit: "per sq.ft", stock: 88, min_threshold: 25, finish: "Natural", color_family: "Teak", is_featured: true, image_url: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&w=900&q=80", description: "Book-matched natural teak veneer sheet. Warm tone with cathedral grain." },
  { id: "p7", name: "Charcoal Fluted Panel", sku: "ACC-CF-505", category: "Accessories", subcategory: "Wall Panel", price: 540, unit: "per sq.ft", stock: 12, min_threshold: 15, finish: "Textured", color_family: "Charcoal", is_featured: false, image_url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=900&q=80", description: "Pre-finished fluted MDF panel in deep charcoal. For feature walls." },
  { id: "p8", name: "Quartz Countertop Slab", sku: "CUS-QC-700", category: "Custom Pieces", subcategory: "Countertop", price: 1450, unit: "per sq.ft", stock: 7, min_threshold: 5, finish: "Polished", color_family: "White", is_featured: true, image_url: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=900&q=80", description: "Calacatta-vein quartz slab, 20mm. Non-porous, stain-resistant countertop." },
];

async function seed() {
  console.log("Seeding gallery...");
  for (let i = 0; i < GALLERY_SEED.length; i++) {
    const item = GALLERY_SEED[i];
    await setDoc(doc(db, "gallery", "gal_" + i), item);
  }
  
  console.log("Seeding products...");
  for (const item of PRODUCT_SEED) {
    await setDoc(doc(db, "products", item.id), item);
  }
  
  console.log("Done seeding!");
  process.exit(0);
}

seed().catch(console.error);
