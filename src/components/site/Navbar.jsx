import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Catalog" },
  { to: "/gallery", label: "Projects" },
  { to: "/visualizer", label: "3D Visualiser" },
  { to: "/estimate", label: "Estimate" },
  { to: "/inquiry", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || !isHome ? "bg-background/85 backdrop-blur-md border-b border-border/70" : "bg-transparent"
      }`}
    >
      <div className="container-px max-w-7xl mx-auto flex items-center justify-between h-16 lg:h-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="h-8 w-8 rounded-sm bg-primary text-primary-foreground grid place-items-center font-display text-lg leading-none">
            M
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg sm:text-xl text-primary tracking-wide">Shree Mangalam</span>
            <span className="text-[9px] uppercase tracking-[0.32em] text-muted-foreground">Interior Studio</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `text-[13px] tracking-wide transition-colors hover:text-accent ${
                  isActive ? "text-accent" : "text-foreground/80"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/estimate"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-[13px] tracking-wide hover:bg-accent hover:text-accent-foreground transition-colors rounded-sm"
          >
            Get Estimate
          </Link>
        </div>

        <button
          className="lg:hidden p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-b border-border">
          <div className="container-px max-w-7xl mx-auto py-5 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `py-3 border-b border-border/60 text-sm ${isActive ? "text-accent" : "text-foreground"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/estimate" className="mt-3 text-center bg-primary text-primary-foreground py-3 rounded-sm text-sm">
              Get Estimate
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}