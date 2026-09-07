import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="container-px max-w-7xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Studio Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-sm bg-accent text-accent-foreground grid place-items-center font-display font-bold text-lg">
                M
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                Shree Mangalam
              </span>
            </div>
            <p className="text-xs text-primary-foreground/70 leading-relaxed mb-6">
              South Gujarat&apos;s premier destination for laminates, marine plywood, natural veneers, custom brass hardware, and bespoke interior spaces.
            </p>
            <p className="text-[11px] text-primary-foreground/50 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-accent" /> Diploma Final Year Project
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-primary-foreground/50 mb-4">Navigation</p>
            <ul className="space-y-2.5 text-xs text-primary-foreground/80">
              <li><Link to="/catalog" className="hover:text-accent transition-colors">Material Catalog</Link></li>
              <li><Link to="/visualizer" className="hover:text-accent transition-colors">3D Room Visualiser</Link></li>
              <li><Link to="/estimate" className="hover:text-accent transition-colors">Cost Estimator Tool</Link></li>
              <li><Link to="/gallery" className="hover:text-accent transition-colors">Project Portfolio Gallery</Link></li>
              <li><Link to="/inquiry" className="hover:text-accent transition-colors">Inquiry &amp; Site Visit Request</Link></li>
              <li><Link to="/login" className="hover:text-accent transition-colors">Staff &amp; Admin Portal</Link></li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-primary-foreground/50 mb-4">Material Finishes</p>
            <ul className="space-y-2.5 text-xs text-primary-foreground/80">
              <li><Link to="/catalog?category=Laminates" className="hover:text-accent transition-colors">Matt &amp; Glossy Laminates</Link></li>
              <li><Link to="/catalog?category=Plywood" className="hover:text-accent transition-colors">18mm BWP Marine Plywood</Link></li>
              <li><Link to="/catalog?category=Veneer" className="hover:text-accent transition-colors">Natural Teak &amp; Walnut Veneer</Link></li>
              <li><Link to="/catalog?category=Hardware" className="hover:text-accent transition-colors">Brass Fittings &amp; Soft-close Hinges</Link></li>
              <li><Link to="/catalog?category=Custom+Pieces" className="hover:text-accent transition-colors">Quartz Countertops &amp; Wall Panels</Link></li>
            </ul>
          </div>

          {/* Showroom Location & Contact */}
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-primary-foreground/50 mb-4">Showroom Visit</p>
            <ul className="space-y-3 text-xs text-primary-foreground/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>Station Road, Surat — Gujarat 395003</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <span>+91 98250 12345</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <span>contact@mangalaminterior.in</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>Mon – Sat: 10:00 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Shree Mangalam Interior Studio. Developed for Final Year Diploma Evaluation.</p>
          <div className="flex gap-6">
            <Link to="/inquiry" className="hover:text-primary-foreground">Privacy Policy</Link>
            <Link to="/inquiry" className="hover:text-primary-foreground">Terms of Service</Link>
            <Link to="/admin" className="hover:text-accent">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
