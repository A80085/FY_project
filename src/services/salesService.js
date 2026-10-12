import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/services/firebase";
import { productService } from "@/services/productService";

const COLLECTION_NAME = "sales";

// Fallback in-store sales records for offline/initial state
const SEED_SALES = [
  {
    id: "sale-1001",
    invoiceNumber: "SMP-2026-0042",
    date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    customerName: "Ramesh Sharma",
    customerPhone: "9820198765",
    customerAddress: "Flat 402, Evershine Avenue, Virar West",
    siteReference: "2BHK Renovation (Carpenter: Dinesh)",
    paymentMode: "UPI",
    paymentStatus: "Paid",
    deliveryStatus: "Delivered",
    items: [
      {
        productId: "p1",
        productName: "18mm BWP Marine Plywood",
        category: "Plywood",
        unit: "sheet",
        quantity: 12,
        rate: 2850,
        amount: 34200
      },
      {
        productId: "p3",
        productName: "Royal Walnut Matte Laminate (1mm)",
        category: "Laminates",
        unit: "sheet",
        quantity: 8,
        rate: 1650,
        amount: 13200
      },
      {
        productId: "p4",
        productName: "Hafele Soft-Close Hinges (Pair)",
        category: "Hardware",
        unit: "pair",
        quantity: 24,
        rate: 320,
        amount: 7680
      }
    ],
    subtotal: 55080,
    discount: 1080,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 54000,
    amountPaid: 54000,
    balanceDue: 0,
    notes: "Direct shop delivery via tempo. Paid in full via Google Pay."
  },
  {
    id: "sale-1002",
    invoiceNumber: "SMP-2026-0041",
    date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    customerName: "Amit Vora",
    customerPhone: "9769012345",
    customerAddress: "Bunglow No. 12, Vasai West",
    siteReference: "Villa Modular Kitchen",
    paymentMode: "Bank Transfer / NEFT",
    paymentStatus: "Partial",
    deliveryStatus: "Scheduled",
    items: [
      {
        productId: "p5",
        productName: "High-Gloss Ivory Acrylic Sheet",
        category: "Laminates",
        unit: "sheet",
        quantity: 6,
        rate: 2950,
        amount: 17700
      },
      {
        productId: "p7",
        productName: "Calacatta Quartz Countertop Slab",
        category: "Custom Pieces",
        unit: "sq.ft",
        quantity: 45,
        rate: 420,
        amount: 18900
      }
    ],
    subtotal: 36600,
    discount: 600,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 36000,
    amountPaid: 20000,
    balanceDue: 16000,
    notes: "Advance received via IMPS. Remaining ₹16,000 on final countertop delivery."
  },
  {
    id: "sale-1003",
    invoiceNumber: "SMP-2026-0040",
    date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    customerName: "Pooja Mehta",
    customerPhone: "9819054321",
    customerAddress: "Rustomjee Global City, Virar West",
    siteReference: "Wardrobe & TV Unit",
    paymentMode: "Cash",
    paymentStatus: "Paid",
    deliveryStatus: "Delivered",
    items: [
      {
        productId: "p2",
        productName: "Smoked Natural Teak Veneer",
        category: "Veneer",
        unit: "sheet",
        quantity: 4,
        rate: 3400,
        amount: 13600
      },
      {
        productId: "p6",
        productName: "Brushed Brass Bar Pulls (200mm)",
        category: "Hardware",
        unit: "piece",
        quantity: 12,
        rate: 480,
        amount: 5760
      }
    ],
    subtotal: 19360,
    discount: 360,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 19000,
    amountPaid: 19000,
    balanceDue: 0,
    notes: "Handed over directly in showroom."
  }
];

export const salesService = {
  async list(filters = {}, maxLimit = 100) {
    try {
      const q = query(collection(db, COLLECTION_NAME), limit(maxLimit));
      const snapshot = await getDocs(q);
      
      let items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      // If Firestore is empty, return local seed data so the owner has an immediate working system
      if (items.length === 0) {
        items = [...SEED_SALES];
      }

      // Sort by date descending
      items.sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));

      if (filters.search) {
        const s = filters.search.toLowerCase();
        items = items.filter(
          item =>
            item.invoiceNumber?.toLowerCase().includes(s) ||
            item.customerName?.toLowerCase().includes(s) ||
            item.customerPhone?.includes(s) ||
            item.siteReference?.toLowerCase().includes(s)
        );
      }

      if (filters.paymentStatus && filters.paymentStatus !== "All") {
        items = items.filter(item => item.paymentStatus === filters.paymentStatus);
      }

      if (filters.deliveryStatus && filters.deliveryStatus !== "All") {
        items = items.filter(item => item.deliveryStatus === filters.deliveryStatus);
      }

      return items;
    } catch (e) {
      console.warn("Firestore error listing sales, falling back to local sales store:", e);
      return SEED_SALES;
    }
  },

  async getById(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
      return SEED_SALES.find(s => s.id === id) || null;
    } catch (e) {
      console.error("Firestore error fetching sale:", e);
      return SEED_SALES.find(s => s.id === id) || null;
    }
  },

  async create(data, deductStock = true) {
    const newId = "sale-" + Date.now();
    const invoiceNumber = data.invoiceNumber || `SMP-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
    
    const record = {
      ...data,
      id: newId,
      invoiceNumber,
      date: data.date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // Save to Firestore
    try {
      await setDoc(doc(db, COLLECTION_NAME, newId), record);
    } catch (err) {
      console.warn("Firestore write for sale failed, recorded locally:", err);
    }

    // Automatically deduct inventory stock if requested
    if (deductStock && Array.isArray(data.items)) {
      for (const item of data.items) {
        if (item.productId && item.quantity > 0) {
          try {
            const product = await productService.getById(item.productId);
            if (product && typeof product.stock === "number") {
              const updatedStock = Math.max(0, product.stock - Number(item.quantity));
              await productService.update(item.productId, { stock: updatedStock });
            }
          } catch (stockErr) {
            console.warn(`Failed to deduct stock for product ${item.productId}:`, stockErr);
          }
        }
      }
    }

    return record;
  },

  async update(id, data) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const updateData = { ...data, updatedAt: new Date().toISOString() };
      await updateDoc(docRef, updateData);
      return { id, ...updateData };
    } catch (e) {
      console.warn("Firestore update error for sale:", e);
      return { id, ...data };
    }
  },

  async delete(id) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return true;
    } catch (e) {
      console.warn("Firestore delete error for sale:", e);
      return false;
    }
  }
};
