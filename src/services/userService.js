import { collection, doc, getDoc, setDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export const userService = {
  async getUser(uid) {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  async createUser(uid, userData) {
    try {
      const docRef = doc(db, "users", uid);
      await setDoc(docRef, {
        ...userData,
        createdAt: new Date().toISOString()
      });
      return { id: uid, ...userData };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async getAllUsers() {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  },

  async updateUserRole(uid, role) {
    try {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, { role });
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  }
};
