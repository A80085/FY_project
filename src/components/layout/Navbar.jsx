import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/catalog", label: "Catalog" },
    { to: "/visualizer", label: "3D Visualiser" },
    { to: "/estimate", label: "Cost Estimator" },
    { to: "/gallery", label: "Gallery" },
    { to: "/about", label: "About" },
    { to: "/inquiry", label: "Contact & Inquiry" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? "bg-background/70 backdrop-blur-md border-border py-4 shadow-sm"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="container-px max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="h-12 w-12 rounded-sm bg-primary text-primary-foreground grid place-items-center font-display font-bold text-2xl transition-transform duration-500 group-hover:scale-95">
            M
          </div>
          <div>
            <span className="font-display font-bold text-xl sm:text-2xl tracking-tight block text-foreground uppercase">
              Shree Mangalam
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest block text-muted-foreground">
              Interior Studio
            </span>
          </div>
        </Link>


        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `transition-colors hover:text-foreground ${
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Buttons / User Menu */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 bg-secondary text-foreground border border-border px-3.5 py-1.5 text-xs font-semibold rounded-sm hover:bg-muted transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" /> Admin
                </Link>
              )}
              <div className="flex items-center gap-2 border-l border-border pl-4">
                <div className="h-8 w-8 rounded-full grid place-items-center text-xs font-semibold bg-secondary text-foreground">
                  {user?.name?.[0] || "U"}
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold leading-none text-foreground">{user?.name?.split(" ")[0]}</p>
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">{user?.role}</p>
                </div>
                <button
                  onClick={logout}
                  title="Log out"
                  className="p-1.5 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-1"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-semibold px-4 py-2 rounded-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                Sign in
              </Link>
              <Link
                to="/inquiry"
                className="bg-primary text-primary-foreground px-5 py-2 text-xs font-semibold rounded-sm hover:bg-primary/90 transition-colors shadow-sm"
              >
                Get Quote
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-sm text-foreground hover:bg-secondary"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-background border-b border-border shadow-xl p-6 flex flex-col gap-4 text-foreground">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
                    isActive ? "bg-accent/15 text-accent" : "hover:bg-secondary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-border pt-4 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between px-3 py-2 bg-secondary/50 rounded-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">{user?.name} ({user?.role})</span>
                  </div>
                  <button onClick={logout} className="text-xs text-destructive font-medium flex items-center gap-1">
                    <LogOut className="h-3.5 w-3.5" /> Logout
                  </button>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="w-full bg-accent text-accent-foreground py-2.5 text-center text-xs font-medium rounded-sm"
                  >
                    Go to Admin Dashboard
                  </Link>
                )}
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="flex-1 text-center border border-border py-2 text-xs font-medium rounded-sm">
                  Log in
                </Link>
                <Link to="/register" className="flex-1 text-center bg-primary text-primary-foreground py-2 text-xs font-medium rounded-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
