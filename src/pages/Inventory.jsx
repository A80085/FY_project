import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Search, AlertTriangle, RefreshCw } from "lucide-react";
import { productService } from "@/services/productService";
import { formatINR } from "@/lib/interiorData";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const EMPTY = { name: "", sku: "", category: "Laminates", subcategory: "", price: 0, unit: "per sq.ft", stock: 0, min_threshold: 10, image_url: "", description: "", finish: "", color_family: "", is_featured: false };
const CATEGORIES = ["Laminates", "Plywood", "Hardware", "Veneer", "Custom Pieces", "Accessories"];

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [editing, setEditing] = useState(null); // null | "new" | product
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await productService.list("-created_date", 200).catch(() => []);
    setItems(data);
    setLoading(false);
  }

  function openNew() { setForm(EMPTY); setEditing("new"); }
  function openEdit(p) { setForm({ ...p }); setEditing(p); }
  function close() { setEditing(null); }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === "new") {
        await productService.create(form);
        toast({ title: "Product created", description: "The product has been added to inventory." });
      } else {
        await productService.update(editing.id, form);
        toast({ title: "Product updated", description: "Changes have been saved." });
      }
      await load();
      close();
    } catch (_err) {
      toast({ title: "Error", description: "Failed to save product.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  const [confirmState, setConfirmState] = useState({ open: false, title: "", description: "", action: null });

  function remove(p) {
    setConfirmState({
      open: true,
      title: `Delete "${p.name}"?`,
      description: "This action cannot be undone. This will permanently delete the product.",
      action: async () => {
        try {
          await productService.delete(p.id);
          setItems((arr) => arr.filter((x) => x.id !== p.id));
          toast({ title: "Product deleted", description: `${p.name} removed.` });
        } catch (_err) {
          toast({ title: "Error", description: "Failed to delete product.", variant: "destructive" });
        }
      }
    });
  }

  function resetData() {
    setConfirmState({
      open: true,
      title: "Reset inventory to seed products?",
      description: "This will restore the 8 default showcase products into Firestore.",
      action: async () => {
        try {
          const resetSeed = await productService.reset();
          setItems(resetSeed);
          toast({ title: "Inventory reset", description: "Product catalog restored to initial seed." });
        } catch (_err) {
          toast({ title: "Error", description: "Failed to reset products.", variant: "destructive" });
        }
      }
    });
  }

  const filtered = items.filter((p) => (cat === "All" || p.category === cat) && (!query || `${p.name} ${p.sku} ${p.color_family}`.toLowerCase().includes(query.toLowerCase())));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4">
        {/* Mobile touch scrollable category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm border shrink-0 transition-colors ${
                cat === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-accent bg-card text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Action controls header */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search inventory by name, SKU…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent bg-card"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Reset catalog to seed"
              onClick={resetData}
              title="Reset catalog to seed"
              className="p-2 border border-border rounded-sm hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors bg-card"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={openNew}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 text-sm font-semibold rounded-sm hover:bg-accent/90 shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add product
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm p-4 space-y-4">
          <div className="flex gap-4 border-b border-border pb-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 items-center">
              <Skeleton className="h-9 w-9 shrink-0" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm min-w-[650px]">
              <thead className="bg-secondary/60 text-muted-foreground">
                <tr className="text-left border-b border-border text-xs uppercase tracking-wider font-semibold">
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Stock</th>
                  <th className="p-3 text-right">Min Threshold</th>
                  <th className="p-3 text-center w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const low = p.stock <= p.min_threshold;
                  return (
                    <tr key={p.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-foreground">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.sku} {p.color_family ? `· ${p.color_family}` : ""}</div>
                      </td>
                      <td className="p-3">
                        <span className="inline-block px-2 py-0.5 text-xs bg-secondary border border-border rounded-sm font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3 text-right font-medium">{formatINR(p.price)} <span className="text-[11px] text-muted-foreground">{p.unit}</span></td>
                      <td className="p-3 text-right font-semibold">
                        <span className={`inline-flex items-center gap-1 ${low ? "text-destructive font-bold" : "text-foreground"}`}>
                          {low && <AlertTriangle className="h-3.5 w-3.5" />}
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-3 text-right text-muted-foreground">{p.min_threshold}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-sm hover:bg-secondary text-muted-foreground hover:text-foreground" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => remove(p)} className="p-1.5 rounded-sm hover:bg-destructive/10 text-muted-foreground hover:text-destructive" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!filtered.length && <p className="p-6 text-center text-sm text-muted-foreground">No products match your search or filter.</p>}
        </div>
      )}

      {/* Edit/Create Product Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto" onClick={close}>
          <form onSubmit={save} className="bg-background w-full max-w-2xl rounded-sm border border-border my-6 shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border shrink-0">
              <h2 className="font-display text-lg sm:text-xl font-bold text-primary">{editing === "new" ? "Add product" : "Edit product"}</h2>
              <button aria-label="Close modal" type="button" onClick={close} className="p-1.5 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-y-auto">
              <F label="Name *"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="ainput" /></F>
              <F label="SKU"><input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="ainput" /></F>
              <F label="Category">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="ainput">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </F>
              <F label="Sub-category"><input value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} className="ainput" /></F>
              <F label="Unit price (₹)"><input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="ainput" /></F>
              <F label="Unit"><input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="ainput" /></F>
              <F label="Stock"><input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="ainput" /></F>
              <F label="Low-stock threshold"><input type="number" min="0" value={form.min_threshold} onChange={(e) => setForm({ ...form, min_threshold: Number(e.target.value) })} className="ainput" /></F>
              <F label="Finish"><input value={form.finish} onChange={(e) => setForm({ ...form, finish: e.target.value })} className="ainput" /></F>
              <F label="Colour family"><input value={form.color_family} onChange={(e) => setForm({ ...form, color_family: e.target.value })} className="ainput" /></F>
              <F label="Image URL" full><input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="ainput" placeholder="https://…" /></F>
              <F label="Description" full><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="ainput resize-none" /></F>
              <label className="flex items-center gap-2 sm:col-span-2 text-sm font-medium pt-1">
                <input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="h-4 w-4 rounded accent-accent" />
                Feature on home catalog
              </label>
            </div>
            <div className="p-4 sm:p-5 border-t border-border flex justify-end gap-2 bg-secondary/30 shrink-0">
              <button type="button" onClick={close} className="px-4 py-2 text-xs sm:text-sm border border-border rounded-sm font-medium">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2 text-xs sm:text-sm bg-primary text-primary-foreground font-semibold rounded-sm disabled:opacity-50">{saving ? "Saving…" : "Save product"}</button>
            </div>
          </form>
        </div>
      )}

      <style>{`.ainput{width:100%;padding:0.5rem 0.7rem;font-size:0.875rem;background:hsl(var(--card));color:hsl(var(--foreground));border:1px solid hsl(var(--border));border-radius:0.125rem;}.ainput:focus{outline:none;border-color:hsl(var(--accent));}`}</style>
      
      <ConfirmDialog 
        open={confirmState.open} 
        onOpenChange={(open) => setConfirmState(prev => ({ ...prev, open }))}
        title={confirmState.title}
        description={confirmState.description}
        onConfirm={confirmState.action}
        confirmText="Confirm"
      />
    </div>
  );
}

function F({ label, children, full }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="block text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">{label}</span>
      {children}
    </label>
  );
}