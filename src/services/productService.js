import { PRODUCT_SEED } from "@/lib/interiorData";

const STORAGE_KEY = "shree_mangalam_products";

function getStoredProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUCT_SEED));
      return PRODUCT_SEED;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading products from localStorage:", e);
    return PRODUCT_SEED;
  }
}

function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error("Error saving products to localStorage:", e);
  }
}

export const productService = {
  async list(sort = "-created_date", limit = 200) {
    const items = getStoredProducts();
    // Simple sort support if requested
    let sorted = [...items];
    if (sort === "-created_date") {
      sorted.reverse();
    }
    return sorted.slice(0, limit);
  },

  async getById(id) {
    const items = getStoredProducts();
    return items.find((p) => String(p.id) === String(id)) || null;
  },

  async create(data) {
    const items = getStoredProducts();
    const newProduct = {
      ...data,
      id: "prod_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      created_date: new Date().toISOString(),
    };
    items.unshift(newProduct);
    saveProducts(items);
    return newProduct;
  },

  async update(id, data) {
    const items = getStoredProducts();
    const index = items.findIndex((p) => String(p.id) === String(id));
    if (index === -1) throw new Error("Product not found");
    items[index] = { ...items[index], ...data, updated_date: new Date().toISOString() };
    saveProducts(items);
    return items[index];
  },

  async delete(id) {
    let items = getStoredProducts();
    items = items.filter((p) => String(p.id) !== String(id));
    saveProducts(items);
    return true;
  },

  async reset() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUCT_SEED));
    return PRODUCT_SEED;
  }
};
