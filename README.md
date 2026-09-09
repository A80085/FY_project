# Shree Mangalam Interior Studio

This is a comprehensive full-stack React + Vite web application built as a final year diploma project. It serves as an interior design storefront, 3D visualizer, and an administrative dashboard for an interior and material showroom. 

The project is fully integrated with **Firebase** (Authentication + Firestore) for real-time cloud data persistence.

## Project Highlights

- **3D Room Visualizer:** Built with vanilla Three.js inside React, allowing users to switch room types, apply custom textures (walls, flooring, upholstery, cabinetry), modify lighting (warm/cool), orbit/zoom, and take high-resolution screenshots.
- **Firebase Backend:** 
  - **Auth:** Secure admin login system.
  - **Firestore:** Cloud persistence for the product catalog, gallery, customer inquiries, and global store settings.
- **Admin Dashboard:** Includes inventory tracking (CRUD), project gallery management, lead/inquiries handling, global settings, and sales analytics/charts using Recharts.
- **Estimate Generator:** Lets customers generate PDF quotations for interior setups using jsPDF and html2canvas.
- **Responsive & Modern UI:** Styled meticulously with Tailwind CSS and Radix UI primitives, featuring custom loaders, interactive dialogs, toasts, full mobile responsiveness, and accessibility (aria-labels).

## Technologies Used

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui (Radix Primitives), Lucide Icons
- **3D Rendering:** Three.js
- **Backend (BaaS):** Firebase (Auth + Firestore)
- **Charts:** Recharts
- **PDF Generation:** jsPDF, html2canvas
- **Routing:** React Router DOM

## Setup & Running Locally

1. **Install dependencies:**
   npm install

2. **Run the development server:**
   npm run dev

3. Open the local Vite URL (usually http://localhost:5173).

### Firebase Setup
The project uses Firebase for data persistence. A configuration file src/lib/firebase.js connects to a Firestore instance. Ensure your Firebase Firestore Security Rules are set to allow public reads and authenticated writes (as implemented in firestore.rules).

## Project Structure

- src/pages - Public pages (Home, Catalog, Gallery, Estimate, Visualizer, About) and Admin pages (Dashboard, Inventory, GalleryManager, Inquiries, Settings)
- src/components - Reusable UI components (admin, visualizer, ui, layout)
- src/services - Firebase API wrappers (productService, galleryService, inquiryService, settingsService, authService)
- src/lib - Shared utilities, constants, and Firebase configuration
- src/context - Global React contexts (e.g., AuthContext)
- public/images - AI-generated static assets and product images
