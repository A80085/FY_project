import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-px max-w-7xl mx-auto py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="h-8 w-8 rounded-sm bg-accent text-accent-foreground grid place-items-center font-display text-lg leading-none">M</span>
            <span className="font-display text-2xl">Shree Mangalam Interior</span>
          </div>
          <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-md">
            A regional interior retail studio crafting laminates, hardware, veneer and custom pieces.
            From digital discovery to in-store finish — interiors, made personal.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <a href="#" className="h-9 w-9 grid place-items-center border border-primary-foreground/20 hover:bg-accent hover:text-accent-foreground transition-colors rounded-sm"><Instagram className="h-4 w-4" /></a>
            <a href="#" className="h-9 w-9 grid place-items-center border border-primary-foreground/20 hover:bg-accent hover:text-accent-foreground transition-colors rounded-sm"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <p className="eyebrow text-primary-foreground/50 mb-5">Explore</p>
          <ul className="space-y-3 text-sm">
            {[["/catalog","Catalog"],["/gallery","Projects"],["/visualizer","3D Visualiser"],["/estimate","Estimate Tool"],["/admin","Admin Portal"]].map(([to,label])=>(
              <li key={to}><Link to={to} className="text-primary-foreground/70 hover:text-accent transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-primary-foreground/50 mb-5">Visit Us</p>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li className="flex items-start gap-2.5"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" /><span>Station Road, Surat — Gujarat 395003</span></li>
            <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 text-accent" /><span>+91 98XXX 210XX</span></li>
            <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 text-accent" /><span>hello@mangalaminterior.in</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-px max-w-7xl mx-auto py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-primary-foreground/50 tracking-wide">
          <p>© {new Date().getFullYear()} Shree Mangalam Interior. Crafted with intent.</p>
          <p>Final Year Project · IT Sem 5 · Bhavya · Jesal · Kanishk</p>
        </div>
      </div>
    </footer>
  );
}