import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left side hero branding */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="/images/about_studio_1788941947938.jpg"
            alt="Interior Studio"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/30" />
        </div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-sm bg-accent text-accent-foreground grid place-items-center font-display font-bold text-xl">
              M
            </div>
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
          Final Year Diploma Project Evaluation
        </div>
      </div>

      {/* Right side form view */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="h-8 w-8 rounded-sm bg-accent text-accent-foreground grid place-items-center font-display font-bold text-lg">
                M
              </div>
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
