import React from "react";
import { Link } from "react-router-dom";

export default function OAuthConsent() {
  return (
    <div className="text-center py-6">
      <h1 className="font-display text-2xl font-bold text-primary">OAuth Authentication</h1>
      <p className="text-xs text-muted-foreground mt-2">Connecting to authentication provider…</p>
      <Link to="/login" className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-xs font-medium rounded-sm">
        Return to Login
      </Link>
    </div>
  );
}
