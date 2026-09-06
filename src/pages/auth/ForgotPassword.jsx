import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { authService } from "@/services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.resetPassword(email, "reset123");
      setDone(true);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="h-12 w-12 text-accent mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-primary">Password Reset</h1>
        <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto">
          Your password for <span className="font-medium text-foreground">{email}</span> has been reset to <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-accent">reset123</code> for testing purposes.
        </p>
        <Link to="/login" className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-xs font-medium rounded-sm">
          Return to Sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
        <h1 className="font-display text-3xl font-bold text-primary">Reset password</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Enter your registered email address to receive password reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Registered email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-sm focus:outline-none focus:border-accent"
            placeholder="admin@mangalam.com"
          />
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 text-sm font-medium rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 shadow-sm"
        >
          {loading ? "Sending reset request…" : "Reset password"}
        </button>
      </form>
    </div>
  );
}
