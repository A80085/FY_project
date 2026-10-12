import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

const DOC_REF = doc(db, "settings", "showroom");

const DEFAULT_SETTINGS = {
  showroomName: "Shree Mangalam Ply & Interiors",
  address: "Shop No. 06, Kusum Vihar 'A', Beside Banjara Hotel, Old Viva College Road, Virar West - 401303",
  phone: "+91 87886 09224 / +91 98250 12345",
  email: "contact@mangalaminterior.in",
  labourRate: 18,
  gstRate: 5,
};

export const settingsService = {
  async getSettings() {
    try {
      const docSnap = await getDoc(DOC_REF);
      if (docSnap.exists()) return { ...DEFAULT_SETTINGS, ...docSnap.data() };
      return DEFAULT_SETTINGS;
    } catch (e) {
      console.error("Firestore error reading settings:", e);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings) {
    try {
      await setDoc(DOC_REF, settings, { merge: true });
      return settings;
    } catch (e) {
      console.error("Firestore error saving settings:", e);
      return DEFAULT_SETTINGS;
    }
  }
};
