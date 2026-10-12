import React from "react";
import { Link, Outlet } from "react-router-dom";
import Logo from "@/components/Logo";

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left side hero branding */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 wood-panel-dark border-r border-border/40 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="/images/about_studio_1788941947938.jpg"
            alt="Interior Studio"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, hsl(24 25% 8%), hsla(24, 28%, 12%, 0.7), hsla(24, 28%, 12%, 0.4))' }} />
        </div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <span className="font-display text-2xl font-bold tracking-tight">
              Shree Mangalam
            </span>
          </Link>
        </div>
        <div className="relative z-10 max-w-lg">
          <h2 className="font-display text-4xl leading-tight">
            Interiors, crafted from the surface up.
          </h2>
          <p className="mt-4 text-primary-foreground/75 text-sm leading-relaxed">
            Access your account to manage store inventory, customer quote inquiries, project gallery, and rough estimate configurations.
          </p>
        </div>
        <div className="relative z-10 text-xs text-primary-foreground/50">
          System Access
        </div>
      </div>

      {/* Right side form view */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="font-display text-xl font-bold text-primary">
                Shree Mangalam
              </span>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
