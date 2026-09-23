import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/services/firebase";
import { GALLERY_SEED } from "@/lib/interiorData";

const COLLECTION_NAME = "gallery";

export const galleryService = {
  async list(sortKey = "-created_date", maxLimit = 60) {
    try {
      const q = query(collection(db, COLLECTION_NAME), limit(maxLimit));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return items;
    } catch (e) {
      console.error("Firestore error listing gallery:", e);
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
      console.error("Firestore error fetching gallery item:", e);
      return null;
    }
  },

  async create(data) {
    const newId = "gal_" + Date.now();
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
  },

  async reset() {
    // Delete all existing gallery items
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, COLLECTION_NAME, d.id)));
    await Promise.all(deletePromises);
    // Re-seed from local data
    const seedPromises = GALLERY_SEED.map((item, i) => {
      const newId = "gal_seed_" + i;
      return setDoc(doc(db, COLLECTION_NAME, newId), { ...item, created_date: new Date().toISOString() });
    });
    await Promise.all(seedPromises);
    return GALLERY_SEED.map((item, i) => ({ id: "gal_seed_" + i, ...item }));
  }
};

