# Shree Mangalam Interior Studio

This is a comprehensive full-stack (simulated backend) React + Vite web application built as a final year diploma project for a 5th-semester student. It serves as an interior design storefront, 3D visualizer, and an administrative dashboard for an interior and material showroom.

## Project Highlights

- **3D Room Visualizer:** Built with `Three.js` (React + vanilla three.js implementation), allowing users to switch room types, apply custom textures (walls, flooring, upholstery, cabinetry), modify lighting (warm/cool), and orbit/zoom the scene in real time.
- **Admin Dashboard:** Includes inventory tracking, project gallery management, lead/inquiries handling, global settings, and sales analytics/charts using `recharts`.
- **Estimate Generator:** Lets customers generate PDF quotations for interior setups using `jspdf` and `html2canvas`.
- **Responsive & Modern UI:** Styled meticulously with Tailwind CSS and Radix UI primitives, featuring custom loaders (Skeleton), interactive dialogs, toasts, and a fully polished dark mode experience.
- **Robust State & Auth:** Uses React Context API for global authentication simulation and standard hooks (`useState`, `useEffect`, `useMemo`) for component-level state.
- **Data Layer:** Uses a simulated backend service structure (`productService`, `galleryService`, `inquiryService`) which can be seamlessly replaced with a real REST API or Firebase setup.

## Technologies Used

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui (Radix Primitives), Lucide Icons
- **3D Rendering:** Three.js
- **Charts:** Recharts
- **PDF Generation:** jsPDF, html2canvas
- **Routing:** React Router DOM

## Prerequisites

- Node.js 18+
- npm

## Setup & Running

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server locally:
   ```bash
   npm run dev
   ```

3. Open the local Vite URL printed in the terminal (usually `http://localhost:5173`).

## Project Structure

- `src/pages` — Public pages (Home, Catalog, Gallery, Estimate, Visualizer, About) and Admin pages (Dashboard, Inventory, GalleryManager, Inquiries, Settings)
- `src/components` — Reusable UI components (`site/`, `admin/`, `visualizer/`, `ui/`, `layout/`)
- `src/services` — Simulated backend API wrappers
- `src/lib` — Shared utilities, mock database schemas, and configuration
- `src/contexts` — React contexts (e.g., AuthContext)

