import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy, limit as fbLimit } from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLLECTION_NAME = "inquiries";

export const inquiryService = {
  async list(sort = "-created_date", maxLimit = 200) {
    try {
      const q = query(collection(db, COLLECTION_NAME), fbLimit(maxLimit));
      const snapshot = await getDocs(q);
      let items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      // Sort client-side (Firestore composite indexes not needed for FY project)
      if (sort === "-created_date") {
        items.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      }

      return items;
    } catch (e) {
      console.error("Firestore error listing inquiries:", e);
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
      console.error("Firestore error fetching inquiry:", e);
      return null;
    }
  },

  async create(data) {
    const newId = "inq_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4);
    const newItem = {
      ...data,
      id: newId,
      status: data.status || "New",
      source: data.source || "Website",
      created_date: new Date().toISOString(),
    };
    await setDoc(doc(db, COLLECTION_NAME, newId), newItem);
    return newItem;
  },

  async updateStatus(id, status) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = { status, updated_date: new Date().toISOString() };
    await updateDoc(docRef, updateData);
    return { id, ...updateData };
  },

  async delete(id) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  }
};
