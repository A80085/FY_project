# Shree Mangalam Ply and Interiors

Website for Shree Mangalam Ply and Interiors, a material showroom in Virar West, Mumbai. Built as a final year project.

The site has a public storefront for customers and a private management portal for the shop owner/staff.

## What it does

**Public side (for customers):**
- Browse the product catalog — plywood, laminates, veneer, hardware
- View project gallery
- Use the 3D room visualizer to preview finishes (Three.js)
- Generate a rough cost estimate and download it as a PDF
- Submit an inquiry / contact form

**Admin side (for shop staff):**
- Dashboard with sales stats and charts
- Inventory management (add/edit/delete products)
- View and manage customer inquiries
- Record in-store sales and generate invoices
- Manage suppliers and purchase orders
- Upload/remove gallery images
- User role management (admin, manager, staff, customer)
- Edit store settings (showroom details, labour rate, GST rate)

## Tech used

- React 18 + Vite
- Tailwind CSS + shadcn/ui
- Firebase (Auth + Firestore)
- Three.js (3D visualizer)
- Recharts (dashboard charts)
- jsPDF + html2canvas (PDF estimates)
- React Router DOM
- Framer Motion

## Running locally

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your Firebase credentials
3. Run:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## Environment variables

Create a `.env` file (see `.env.example`):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_MASTER_ADMIN_EMAIL=
```

## Firebase setup

- Firestore rules are in `firestore.rules` — products and gallery are publicly readable, everything else requires auth
- To deploy rules: `firebase deploy --only firestore:rules`
- To deploy the site: `npm run build` then `firebase deploy --only hosting`

## Project structure

```
src/
  pages/       — all page components (public + admin)
  components/  — reusable components and UI
  services/    — Firebase data access (one file per collection)
  lib/         — shared utilities and seed data
  utils/       — PDF generator
public/
  images/      — static image assets
```

## Admin login

The master admin email is set via `VITE_MASTER_ADMIN_EMAIL` in `.env`. Register with that email and it gets auto-assigned the admin role.
