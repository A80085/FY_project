import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const rawFrom = location.state?.from?.pathname;
  // Basic OpSec: sanitize redirect path to prevent open redirects (e.g. protocol-relative URLs or backslashes)
  const isValidRedirect = typeof rawFrom === "string" && rawFrom.startsWith("/") && !rawFrom.startsWith("//") && !rawFrom.includes("\\");
  const from = isValidRedirect ? rawFrom : (email.includes("admin") ? "/admin" : "/");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      if (from && from !== "/") {
        navigate(from, { replace: true });
      } else if (loggedUser.role === "admin" || loggedUser.role === "manager") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-primary">Sign in</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Access customer quotes, 3D visualizer configurations, or admin portal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-sm focus:outline-none focus:border-accent"
            placeholder="you@email.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs uppercase tracking-wide text-muted-foreground font-medium">Password</label>
            <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-sm focus:outline-none focus:border-accent"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 text-sm font-medium rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 shadow-sm"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>


      <p className="mt-6 text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-accent font-medium hover:underline">
          Create one now
        </Link>
      </p>
    </div>
  );
}
