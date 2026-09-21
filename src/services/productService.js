import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, limit } from "firebase/firestore";
import { db } from "@/services/firebase";

const COLLECTION_NAME = "products";

export const productService = {
  async list(filters = {}, maxLimit = 50) {
    try {
      const q = query(collection(db, COLLECTION_NAME), limit(maxLimit));
      const snapshot = await getDocs(q);
      /** @type {any[]} */
      let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (filters.category) items = items.filter(p => p.category === filters.category);
      if (filters.search && typeof filters.search === 'string') items = items.filter(p => p.name?.toLowerCase().includes(filters.search.toLowerCase()) || p.sku?.toLowerCase().includes(filters.search.toLowerCase()));
      
      return items;
    } catch (e) {
      console.error("Firestore error listing products:", e);
      return [];
    }
  },

  async getById(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
      return null;
    } catch (e) {
      console.error("Firestore error fetching product:", e);
      return null;
    }
  },

  async create(data) {
    const newId = "p" + Date.now();
    const newItem = { ...data, created_date: new Date().toISOString() };
    await setDoc(doc(db, COLLECTION_NAME, newId), newItem);
    return { id: newId, ...newItem };
  },

  async update(id, data) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = { ...data, updated_date: new Date().toISOString() };
    await updateDoc(docRef, updateData);
    return { id, ...updateData };
  },

  async delete(id) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  }
};
