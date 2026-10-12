import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "next-themes";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import PageNotFound from '@/pages/PageNotFound';
import { AuthProvider, useAuth } from '@/AuthContext';
import ScrollToTop from '@/components/ScrollToTop';
import SiteLayout from '@/components/SiteLayout';
import AuthLayout from '@/components/AuthLayout';
import AdminLayout from '@/components/AdminLayout';
import AdminRoute from '@/components/AdminRoute';

// Eagerly loaded core public routes
import Home from '@/pages/Home';
import Catalog from '@/pages/Catalog';
import ProductDetail from '@/pages/ProductDetail';
import Gallery from '@/pages/Gallery';
import About from '@/pages/About';
import Inquiry from '@/pages/Inquiry';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';

// Code-split heavy interactive tools and management portal pages
const Visualizer = lazy(() => import('@/pages/Visualizer'));
const Estimate = lazy(() => import('@/pages/Estimate'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Inventory = lazy(() => import('@/pages/Inventory'));
const Inquiries = lazy(() => import('@/pages/Inquiries'));
const GalleryManager = lazy(() => import('@/pages/GalleryManager'));
const Settings = lazy(() => import('@/pages/Settings'));
const Suppliers = lazy(() => import('@/pages/Suppliers'));
const PurchaseOrders = lazy(() => import('@/pages/PurchaseOrders'));
const RoleManagement = lazy(() => import('@/pages/RoleManagement'));

const PageFallbackLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-8">
    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth();

  // Show loading spinner while checking auth
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render the main app with Suspense fallback for code-split chunks
  return (
    <Suspense fallback={<PageFallbackLoader />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<ProductDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/visualizer" element={<Visualizer />} />
          <Route path="/estimate" element={<Estimate />} />
          <Route path="/inquiry" element={<Inquiry />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="settings" element={<Settings />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route path="roles" element={<RoleManagement />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};


function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;