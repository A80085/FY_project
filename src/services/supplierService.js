import { collection, doc, getDoc, setDoc, getDocs, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export const supplierService = {
  // --- Suppliers ---
  async getAllSuppliers() {
    try {
      const querySnapshot = await getDocs(collection(db, "suppliers"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting suppliers:", error);
      return [];
    }
  },

  async getSupplier(id) {
    try {
      const docRef = doc(db, "suppliers", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Error getting supplier:", error);
      return null;
    }
  },

  async createSupplier(data) {
    try {
      const docRef = await addDoc(collection(db, "suppliers"), {
        ...data,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error("Error creating supplier:", error);
      throw error;
    }
  },

  async updateSupplier(id, data) {
    try {
      const docRef = doc(db, "suppliers", id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating supplier:", error);
      throw error;
    }
  },

  async deleteSupplier(id) {
    try {
      await deleteDoc(doc(db, "suppliers", id));
    } catch (error) {
      console.error("Error deleting supplier:", error);
      throw error;
    }
  },

  // --- Purchase Orders ---
  async getAllPurchaseOrders() {
    try {
      const querySnapshot = await getDocs(collection(db, "purchase_orders"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting POs:", error);
      return [];
    }
  },

  async createPurchaseOrder(data) {
    try {
      const docRef = await addDoc(collection(db, "purchase_orders"), {
        ...data,
        status: "pending",
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error("Error creating PO:", error);
      throw error;
    }
  },

  async updatePurchaseOrderStatus(id, status) {
    try {
      const docRef = doc(db, "purchase_orders", id);
      await updateDoc(docRef, { 
        status,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating PO status:", error);
      throw error;
    }
  }
};
