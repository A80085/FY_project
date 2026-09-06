import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <p className="text-muted-foreground text-sm">Verifying admin permissions…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="pt-32 pb-24 text-center container-px max-w-lg mx-auto">
        <h1 className="font-display text-3xl text-primary">Access Restricted</h1>
        <p className="mt-3 text-muted-foreground text-sm">
          You must be logged in as an Administrator to access the Management Portal.
        </p>
      </div>
    );
  }

  return children;
}
