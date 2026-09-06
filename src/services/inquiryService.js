const STORAGE_KEY = "shree_mangalam_inquiries";

const INITIAL_INQUIRIES = [
  {
    id: "inq_101",
    customer_name: "Anand Patel",
    email: "anand.p@gmail.com",
    phone: "+91 98250 12345",
    subject: "Modular Kitchen Estimate Request",
    message: "Interested in Acrylic Ivory finish kitchen for a 3BHK flat in Vesu, Surat. Please contact for site visit.",
    interested_products: "Ivory Gloss Acrylic, BWP Marine Plywood 18mm",
    estimate_summary: "Estimated total: ₹1,45,000 for Modular Kitchen",
    status: "New",
    source: "Website",
    created_date: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: "inq_102",
    customer_name: "Priya Shah",
    email: "priya.shah@outlook.com",
    phone: "+91 99099 87654",
    subject: "Teak Veneer Panelling",
    message: "Need 400 sq.ft teak veneer sheets for living room wall panelling in Navsari.",
    interested_products: "Teak Natural Veneer",
    estimate_summary: "Estimated total: ₹92,000",
    status: "In Progress",
    source: "Showroom Visit",
    created_date: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  }
];

function getStoredInquiries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading inquiries from localStorage:", e);
    return INITIAL_INQUIRIES;
  }
}

function saveInquiries(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Error saving inquiries to localStorage:", e);
  }
}

export const inquiryService = {
  async list(sort = "-created_date", limit = 200) {
    const items = getStoredInquiries();
    let sorted = [...items];
    if (sort === "-created_date") {
      sorted.reverse();
    }
    return sorted.slice(0, limit);
  },

  async getById(id) {
    const items = getStoredInquiries();
    return items.find((i) => String(i.id) === String(id)) || null;
  },

  async create(data) {
    const items = getStoredInquiries();
    const newInquiry = {
      ...data,
      id: "inq_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      status: data.status || "New",
      source: data.source || "Website",
      created_date: new Date().toISOString(),
    };
    items.unshift(newInquiry);
    saveInquiries(items);
    return newInquiry;
  },

  async updateStatus(id, status) {
    const items = getStoredInquiries();
    const index = items.findIndex((i) => String(i.id) === String(id));
    if (index === -1) throw new Error("Inquiry not found");
    items[index].status = status;
    items[index].updated_date = new Date().toISOString();
    saveInquiries(items);
    return items[index];
  },

  async delete(id) {
    let items = getStoredInquiries();
    items = items.filter((i) => String(i.id) !== String(id));
    saveInquiries(items);
    return true;
  }
};
