import React, { useState, useEffect } from "react";
import { Store, Shield, Database, Save } from "lucide-react";
import { productService } from "@/services/productService";
import { galleryService } from "@/services/galleryService";
import { settingsService } from "@/services/settingsService";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function Settings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(settingsService.getSettings());

  useEffect(() => {
    setForm(settingsService.getSettings());
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    settingsService.saveSettings(form);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings saved",
        description: "Your changes have been updated globally.",
      });
    }, 500);
  }

  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleResetAll() {
    setConfirmOpen(true);
  }

  async function performReset() {
    await productService.reset();
    await galleryService.reset();
    toast({
      title: "Success",
      description: "Store database reset successfully to initial seed values!",
    });
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Store &amp; System Settings</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Configure showroom information, cost estimation rates, and database controls</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-sm p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Store className="h-5 w-5 text-accent" />
          <h3 className="font-display text-lg font-bold text-primary">Showroom Details</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Showroom Name</span>
            <input
              value={form.showroomName}
              onChange={(e) => setForm({ ...form, showroomName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Phone Number</span>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Address</span>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Email Address</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent"
            />
          </label>
        </div>

        <div className="flex items-center gap-2 border-b border-border pb-3 pt-4">
          <Shield className="h-5 w-5 text-accent" />
          <h3 className="font-display text-lg font-bold text-primary">Estimation Calculation Rates</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Labour &amp; Fitting Rate (%)</span>
            <input
              type="number"
              value={form.labourRate}
              onChange={(e) => setForm({ ...form, labourRate: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">GST Tax Rate (%)</span>
            <input
              type="number"
              value={form.gstRate}
              onChange={(e) => setForm({ ...form, gstRate: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent"
            />
          </label>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">Changes take effect immediately across all client tools</span>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save settings"}
          </button>
        </div>
      </form>

      {/* Reset Controls */}
      <div className="bg-card border border-border rounded-sm p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Database className="h-5 w-5 text-destructive" />
          <h3 className="font-display text-lg font-bold text-primary">Database Maintenance</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          If you want to restore all product inventory items and project gallery images back to the original initial seed data, click below.
        </p>
        <button
          onClick={handleResetAll}
          className="px-4 py-2 text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/30 rounded-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          Reset Store Seed Database
        </button>
      </div>

      <ConfirmDialog 
        open={confirmOpen} 
        onOpenChange={setConfirmOpen}
        title="Reset Store Seed Database"
        description="Are you sure you want to reset all store products and gallery items to original seed defaults? This action cannot be undone."
        onConfirm={performReset}
        confirmText="Yes, reset everything"
      />
    </div>
  );
}
