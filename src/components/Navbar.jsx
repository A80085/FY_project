import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, hasAdminAccess, logout } = useAuth();

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

  // Streamlined architectural navigation terms that give ample breathing room across all screen resolutions
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/catalog", label: "Catalog" },
    { to: "/visualizer", label: "3D Studio" },
    { to: "/estimate", label: "Estimator" },
    { to: "/gallery", label: "Gallery" },
    { to: "/about", label: "About" },
    { to: "/inquiry", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-border/80 py-2.5 sm:py-3.5 shadow-xs"
          : "bg-transparent border-transparent py-4 sm:py-5"
      }`}
    >
      <div className="container-px max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Studio Mark */}
        <Link to="/" className="flex items-center gap-3 group shrink-0 min-w-0">
          <Logo className="h-9 w-9 sm:h-11 sm:w-11" />
          <div className="min-w-0">
            <span className="font-display font-semibold text-sm sm:text-base xl:text-lg tracking-tight block text-foreground uppercase leading-tight truncate">
              Shree Mangalam
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase font-semibold tracking-[0.22em] block text-accent whitespace-nowrap">
              Ply &amp; Interiors
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links — visible from xl (1280px) up with balanced spacing */}
        <nav className="hidden xl:flex items-center gap-3 2xl:gap-5 text-xs 2xl:text-sm font-medium whitespace-nowrap px-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `px-2 py-1 rounded-2xs transition-colors hover:text-foreground whitespace-nowrap ${
                  isActive
                    ? "text-accent font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Buttons & Utility Strip — separated with subtle divider to guarantee clearance */}
        <div className="hidden xl:flex items-center gap-3.5 shrink-0">
          <ThemeToggle />

          <div className="h-4 w-px bg-border/60 mx-0.5 shrink-0" />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {hasAdminAccess && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 bg-secondary text-foreground border border-border px-3.5 py-1.5 text-xs font-semibold rounded-xs hover:bg-muted transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" /> Admin
                </Link>
              )}
              <div className="flex items-center gap-2 border-l border-border pl-3">
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
                  className="p-1.5 rounded-xs hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-1"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/60 whitespace-nowrap shrink-0"
              >
                Sign in
              </Link>
              <Link
                to="/inquiry"
                className="glow-amber bg-accent text-accent-foreground px-4 py-2 text-xs font-semibold rounded-xs hover:bg-accent/90 transition-colors shadow-xs whitespace-nowrap shrink-0"
              >
                Get Quote
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Controls — shown below xl */}
        <div className="flex items-center gap-2 xl:hidden shrink-0">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-xs text-foreground hover:bg-secondary border border-border/80"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer — sits directly below the header, no hardcoded pixel offset */}
      {mobileMenuOpen && (
        <div className="xl:hidden absolute inset-x-0 top-full bg-background/95 backdrop-blur-lg border-b border-border shadow-2xl p-5 flex flex-col gap-4 text-foreground max-h-[calc(100dvh-100%)] overflow-y-auto animate-in slide-in-from-top-2 duration-200 z-40">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                    isActive ? "bg-accent/15 text-accent font-semibold" : "hover:bg-secondary text-foreground/80"
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
                <div className="flex items-center justify-between px-3 py-2.5 bg-secondary/60 rounded-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-accent text-accent-foreground grid place-items-center text-xs font-bold">
                      {user?.name?.[0] || "U"}
                    </div>
                    <div>
                      <span className="text-xs font-semibold block">{user?.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-medium">{user?.role}</span>
                    </div>
                  </div>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-xs text-destructive font-semibold flex items-center gap-1 hover:underline">
                    <LogOut className="h-3.5 w-3.5" /> Logout
                  </button>
                </div>
                {hasAdminAccess && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-accent text-accent-foreground py-2.5 text-center text-xs font-semibold rounded-sm shadow-sm flex items-center justify-center gap-2"
                  >
                    <Shield className="h-4 w-4" /> Go to Management Portal
                  </Link>
                )}
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center border border-border py-2.5 text-xs font-semibold rounded-sm hover:bg-secondary">
                  Sign in
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center bg-primary text-primary-foreground py-2.5 text-xs font-semibold rounded-sm hover:bg-primary/90">
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
