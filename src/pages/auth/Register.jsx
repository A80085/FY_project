import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!form.name || !form.email || !form.password) {
      return setError("Please fill in all required fields.");
    }
    if (!/^\\S+@\\S+\\.\\S+$/.test(form.email)) {
      return setError("Please enter a valid email address.");
    }
    if (form.phone && !/^\\+?[0-9\\s\\-()]{7,15}$/.test(form.phone)) {
      return setError("Please enter a valid phone number.");
    }
    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      return setError("Password must contain at least one uppercase letter and one number.");
    }
    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-primary">Create account</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Join Shree Mangalam Interior Studio to save room estimates and request site visits.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Full Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-sm focus:outline-none focus:border-accent"
            placeholder="Rahul Sharma"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Email address *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-sm focus:outline-none focus:border-accent"
            placeholder="you@email.com"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Phone number</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-sm focus:outline-none focus:border-accent"
            placeholder="+91 98XXX XXXX"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Password *</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-sm focus:outline-none focus:border-accent"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Account Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-3 py-2.5 text-sm bg-card border border-border rounded-sm focus:outline-none focus:border-accent"
          >
            <option value="customer">Customer / Client</option>
            <option value="admin">Showroom Staff / Admin</option>
          </select>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 text-sm font-medium rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 shadow-sm"
        >
          {loading ? "Creating account…" : "Register account"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-accent font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
