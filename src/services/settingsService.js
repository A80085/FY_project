const SETTINGS_KEY = "shree_mangalam_settings";

const DEFAULT_SETTINGS = {
  showroomName: "Shree Mangalam Interior Studio",
  address: "Station Road, Surat — Gujarat 395003",
  phone: "+91 98250 12345",
  email: "contact@mangalaminterior.in",
  labourRate: 18,
  gstRate: 5,
};

export const settingsService = {
  getSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return DEFAULT_SETTINGS;
      return JSON.parse(raw);
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      return settings;
    } catch (e) {
      console.error("Error saving settings:", e);
      return DEFAULT_SETTINGS;
    }
  }
};
