import { GALLERY_SEED } from "@/lib/interiorData";

const STORAGE_KEY = "shree_mangalam_gallery";

function getStoredGallery() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(GALLERY_SEED));
      return GALLERY_SEED;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading gallery from localStorage:", e);
    return GALLERY_SEED;
  }
}

function saveGallery(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Error saving gallery to localStorage:", e);
  }
}

export const galleryService = {
  async list(sort = "-created_date", limit = 60) {
    const items = getStoredGallery();
    let sorted = [...items];
    if (sort === "-created_date") {
      sorted.reverse();
    }
    return sorted.slice(0, limit);
  },

  async getById(id) {
    const items = getStoredGallery();
    return items.find((g) => String(g.id) === String(id)) || null;
  },

  async create(data) {
    const items = getStoredGallery();
    const newItem = {
      ...data,
      id: "gal_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      created_date: new Date().toISOString(),
    };
    items.unshift(newItem);
    saveGallery(items);
    return newItem;
  },

  async update(id, data) {
    const items = getStoredGallery();
    const index = items.findIndex((g) => String(g.id) === String(id));
    if (index === -1) throw new Error("Gallery item not found");
    items[index] = { ...items[index], ...data, updated_date: new Date().toISOString() };
    saveGallery(items);
    return items[index];
  },

  async delete(id) {
    let items = getStoredGallery();
    items = items.filter((g) => String(g.id) !== String(id));
    saveGallery(items);
    return true;
  },

  async reset() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(GALLERY_SEED));
    return GALLERY_SEED;
  }
};
