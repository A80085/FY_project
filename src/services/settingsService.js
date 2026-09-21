import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

const DOC_REF = doc(db, "settings", "showroom");

const DEFAULT_SETTINGS = {
  showroomName: "Shree Mangalam Interior Studio",
  address: "Station Road, Surat - Gujarat 395003",
  phone: "+91 98250 12345",
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
