import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="pt-32 pb-24 text-center container-px max-w-md mx-auto">
      <p className="font-display text-8xl font-bold text-accent">404</p>
      <h1 className="font-display text-3xl font-bold text-primary mt-2">Page Not Found</h1>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
        The page you are looking for might have been moved, deleted, or does not exist in the showroom directory.
      </p>
      <div className="mt-8 flex justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-medium rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
        >
          <Home className="h-4 w-4" /> Return to Home
        </Link>
      </div>
    </div>
  );
}
