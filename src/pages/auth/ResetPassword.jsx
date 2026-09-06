import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="h-12 w-12 text-accent mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-primary">Password Updated</h1>
        <p className="text-xs text-muted-foreground mt-2">Your password has been updated successfully.</p>
        <Link to="/login" className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-xs font-medium rounded-sm">
          Sign in now
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-primary">Set new password</h1>
        <p className="text-xs text-muted-foreground mt-1">Please enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">New Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-sm focus:outline-none focus:border-accent"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3 text-sm font-medium rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
