import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "next-themes";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from '@/pages/public/PageNotFound';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import UserNotRegisteredError from '@/components/common/UserNotRegisteredError';
import ScrollToTop from '@/components/common/ScrollToTop';
import SiteLayout from '@/components/layout/SiteLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import Home from '@/pages/public/Home';
import Catalog from '@/pages/public/Catalog';
import ProductDetail from '@/pages/public/ProductDetail';
import Gallery from '@/pages/public/Gallery';
import About from '@/pages/public/About';
import Visualizer from '@/pages/public/Visualizer';
import Estimate from '@/pages/public/Estimate';
import Inquiry from '@/pages/public/Inquiry';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import Dashboard from '@/pages/admin/Dashboard';
import Inventory from '@/pages/admin/Inventory';
import Inquiries from '@/pages/admin/Inquiries';
import GalleryManager from '@/pages/admin/GalleryManager';
import Settings from '@/pages/admin/Settings';
import AdminRoute from '@/components/common/AdminRoute';

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

  // Render the main app
  return (
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
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App