import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="wood-panel-dark border-t border-border/40 relative text-white">
      <div className="container-px max-w-7xl mx-auto py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12">
          {/* Studio Info (4 cols) */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <Logo tone="light" className="h-10 w-10 sm:h-11 sm:w-11" />
              <div>
                <span className="font-display text-xl font-bold tracking-tight text-white block leading-tight">
                  Shree Mangalam
                </span>
                <span className="text-[9px] uppercase font-semibold tracking-widest text-accent block">
                  Ply &amp; Interiors
                </span>
              </div>
            </div>
            <p className="text-xs text-white/75 leading-relaxed mb-6 max-w-sm">
              Distributor and dealer of premium BWP marine plywood, decorative laminates, natural veneers, custom architectural millwork, and brass hardware.
            </p>
            <p className="text-[11px] text-white/60 uppercase tracking-widest flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-4 w-4 text-accent" /> Authentic Quality Certified
            </p>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-accent mb-4">Navigation</p>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li><Link to="/catalog" className="hover:text-accent transition-colors">Material Archive</Link></li>
              <li><Link to="/visualizer" className="hover:text-accent transition-colors">3D Studio</Link></li>
              <li><Link to="/estimate" className="hover:text-accent transition-colors">Cost Estimator</Link></li>
              <li><Link to="/gallery" className="hover:text-accent transition-colors">Spatial Case Studies</Link></li>
              <li><Link to="/inquiry" className="hover:text-accent transition-colors">Site Visit Request</Link></li>
              <li><Link to="/login" className="hover:text-accent transition-colors">Staff &amp; Admin Portal</Link></li>
            </ul>
          </div>

          {/* Product Categories (3 cols) */}
          <div className="lg:col-span-3">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-accent mb-4">Material Finishes</p>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li><Link to="/catalog?category=Laminates" className="hover:text-accent transition-colors">Matt &amp; Glossy Laminates</Link></li>
              <li><Link to="/catalog?category=Plywood" className="hover:text-accent transition-colors">18mm BWP Marine Plywood</Link></li>
              <li><Link to="/catalog?category=Veneer" className="hover:text-accent transition-colors">Natural Teak &amp; Walnut Veneer</Link></li>
              <li><Link to="/catalog?category=Hardware" className="hover:text-accent transition-colors">Brass Fittings &amp; Soft-close Hinges</Link></li>
              <li><Link to="/catalog?category=Custom+Pieces" className="hover:text-accent transition-colors">Quartz Countertops &amp; Wall Panels</Link></li>
            </ul>
          </div>

          {/* Showroom Location & Contact (3 cols) */}
          <div className="lg:col-span-3">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-accent mb-4">Showroom Visit</p>
            <ul className="space-y-3 text-xs text-white/85">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span className="leading-snug">Shop No. 6, Kusum Vihar 'A', Beside Banjara Hotel, Old Viva College Road, Virar West - 401303</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <span>+91 87886 09224 / +91 98250 12345</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <span className="truncate">contact@mangalaminterior.in</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>Mon – Sat: 10:00 AM – 8:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/60">
          <p>© {new Date().getFullYear()} Shree Mangalam Interior Studio.</p>
          <div className="flex gap-6">
            <Link to="/inquiry" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/inquiry" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/admin" className="hover:text-accent transition-colors">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
