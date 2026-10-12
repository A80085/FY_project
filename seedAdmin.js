const admin = require('firebase-admin');

// Initialize the Admin SDK
// It automatically picks up credentials if GOOGLE_APPLICATION_CREDENTIALS is set
try {
  admin.initializeApp({
    projectId: "mangalam-fy-2026-7c2e3"
  });
} catch (e) {
  // If app already initialized
}

const db = admin.firestore();

const seedData = async () => {
  try {
    console.log("Starting database seeding check...");

    // 1. SEED PRODUCTS (8 Documents)
    const productsRef = db.collection('products');
    const productsSnapshot = await productsRef.limit(1).get();

    if (productsSnapshot.empty) {
      console.log("Seeding 'products' collection...");
      const dummyProducts = [
        {
          name: "Premium Teak Plywood",
          sku: "PLY-TEAK-001",
          category: "Plywood",
          price: 4500,
          stock: 120,
          min_threshold: 15,
          unit: "per sheet",
          finish: "Matte",
          color_family: "Brown",
          is_featured: true,
          description: "High-grade water-resistant commercial teak plywood for premium furniture.",
          created_date: new Date().toISOString()
        },
        {
          name: "High-Gloss Acrylic Laminate",
          sku: "LAM-GLOS-002",
          category: "Laminates",
          price: 2800,
          stock: 80,
          min_threshold: 10,
          unit: "per sheet",
          finish: "Glossy",
          color_family: "White",
          is_featured: true,
          description: "1mm scratch-resistant acrylic laminate sheet for kitchen cabinets.",
          created_date: new Date().toISOString()
        },
        {
          name: "Soft-Close Hydraulic Hinge",
          sku: "HDW-HING-003",
          category: "Hardware",
          price: 350,
          stock: 500,
          min_threshold: 50,
          unit: "per pair",
          finish: "Metallic",
          color_family: "Silver",
          is_featured: false,
          description: "Stainless steel 3D adjustable soft-close hydraulic cabinet hinges.",
          created_date: new Date().toISOString()
        },
        {
          name: "Natural Oak Veneer",
          sku: "VEN-OAK-004",
          category: "Veneer",
          price: 8500,
          stock: 45,
          min_threshold: 8,
          unit: "per group",
          finish: "Natural Grain",
          color_family: "Beige",
          is_featured: true,
          description: "Imported American white oak natural wood veneer sheet.",
          created_date: new Date().toISOString()
        },
        {
          name: "Designer Wardrobe Handle",
          sku: "ACC-HAND-005",
          category: "Accessories",
          price: 750,
          stock: 150,
          min_threshold: 20,
          unit: "per piece",
          finish: "Brushed Brass",
          color_family: "Gold",
          is_featured: false,
          description: "Elegant 12-inch profile handle for modern wardrobe shutters.",
          created_date: new Date().toISOString()
        },
        {
          name: "Handcrafted Rosewood Console Table",
          sku: "CST-ROSE-006",
          category: "Custom Pieces",
          price: 32000,
          stock: 3,
          min_threshold: 1,
          unit: "per unit",
          finish: "Semi-Gloss PU",
          color_family: "Dark Brown",
          is_featured: true,
          description: "Custom-built solid rosewood entry console with brass inlays.",
          created_date: new Date().toISOString()
        },
        {
          name: "Marine Grade BWP Plywood",
          sku: "PLY-MARN-007",
          category: "Plywood",
          price: 5200,
          stock: 95,
          min_threshold: 20,
          unit: "per sheet",
          finish: "Unfinished",
          color_family: "Reddish Brown",
          is_featured: false,
          description: "Boiling Water Proof (BWP) marine plywood suitable for wet areas.",
          created_date: new Date().toISOString()
        },
        {
          name: "Textured Charcoal Louver Panel",
          sku: "LAM-LOUV-008",
          category: "Laminates",
          price: 1800,
          stock: 60,
          min_threshold: 12,
          unit: "per piece",
          finish: "Fluted Texture",
          color_family: "Charcoal Grey",
          is_featured: true,
          description: "Polystyrene wall cladding panel for TV units and bed backdrops.",
          created_date: new Date().toISOString()
        }
      ];

      const batch = db.batch();
      dummyProducts.forEach((product) => {
        const docRef = productsRef.doc();
        batch.set(docRef, product);
      });
      await batch.commit();
      console.log("Successfully seeded 8 products.");
    } else {
      console.log("'products' collection is already seeded.");
    }

    // 2. SEED INQUIRIES (6 Documents spread over last 7 days)
    const inquiriesRef = db.collection('inquiries');
    const inquiriesSnapshot = await inquiriesRef.limit(1).get();

    if (inquiriesSnapshot.empty) {
      console.log("Seeding 'inquiries' collection...");
      const getPastDate = (daysAgo) => {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        return d.toISOString();
      };

      const dummyInquiries = [
        {
          customer_name: "Rajesh Mehta",
          email: "rajesh.mehta@gmail.com",
          phone: "+91 98765 43210",
          subject: "Modular Kitchen Estimate",
          message: "Looking for an L-shaped kitchen design with acrylic finish and soft-close hardware.",
          status: "New",
          source: "Website",
          created_date: getPastDate(0)
        },
        {
          customer_name: "Anjali Sharma",
          email: "anjali.sharma@yahoo.com",
          phone: "+91 91234 56789",
          subject: "Teak Veneer Price Query",
          message: "Need 12 sheets of premium teak veneer. Please send quote and catalog.",
          status: "In Progress",
          source: "Website",
          created_date: getPastDate(1)
        },
        {
          customer_name: "Vikram Contractor",
          email: "vikram.woodworks@outlook.com",
          phone: "+91 99887 76655",
          subject: "Bulk BWP Plywood Order",
          message: "Do you offer additional discounts for commercial contractors buying 50+ sheets of 18mm BWP?",
          status: "New",
          source: "Website",
          created_date: getPastDate(3)
        },
        {
          customer_name: "Meera Patel",
          email: "meera.patel@gmail.com",
          phone: "+91 98989 12345",
          subject: "Custom Console Customization",
          message: "Can the rosewood console table be customized to 4 feet length instead of 5?",
          status: "Closed",
          source: "Website",
          created_date: getPastDate(4)
        },
        {
          customer_name: "Suresh G.",
          email: "suresh.g@rediffmail.com",
          phone: "+91 94440 55512",
          subject: "Showroom Visit Request",
          message: "Would like to schedule a physical walkthrough of the materials on Saturday morning.",
          status: "In Progress",
          source: "Website",
          created_date: getPastDate(5)
        },
        {
          customer_name: "Deepak Shah",
          email: "deepak.shah@live.com",
          phone: "+91 90001 22233",
          subject: "Hardware Warranty Info",
          message: "What is the warranty coverage on your soft-close hydraulic hinge line?",
          status: "Closed",
          source: "Website",
          created_date: getPastDate(7)
        }
      ];

      const batch = db.batch();
      dummyInquiries.forEach((inquiry) => {
        const docRef = inquiriesRef.doc();
        batch.set(docRef, inquiry);
      });
      await batch.commit();
      console.log("Successfully seeded 6 inquiries.");
    } else {
      console.log("'inquiries' collection is already seeded.");
    }

    // 3. SEED SETTINGS (1 Document with fixed ID "showroom")
    const settingsRef = db.collection('settings').doc('showroom');
    const settingsDoc = await settingsRef.get();

    if (!settingsDoc.exists) {
      console.log("Seeding 'settings/showroom' document...");
      await settingsRef.set({
        showroomName: "Shree Mangalam Timber & Plywood",
        address: "Near Jakat Naka, Agashi Road, Virar West, Palghar, Maharashtra - 401303",
        phone: "+91 98250 12345",
        email: "contact@shreemangalam.in",
        labourRate: 18,
        gstRate: 5
      });
      console.log("Successfully seeded settings/showroom.");
    } else {
      console.log("'settings/showroom' document already exists.");
    }

    console.log("Database check and seeding execution complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    process.exit();
  }
};

seedData();
