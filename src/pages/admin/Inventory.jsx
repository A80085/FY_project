import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Search, AlertTriangle, Package, RefreshCw } from "lucide-react";
import { productService } from "@/services/productService";
import { formatINR, PRODUCT_SEED } from "@/lib/interiorData";
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
    setItems(data.length ? data : PRODUCT_SEED);
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
    } catch (err) {
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
          toast({ title: "Product deleted", description: `${p.name} removed from inventory.` });
        } catch (err) {
          toast({ title: "Error", description: "Failed to delete product.", variant: "destructive" });
        }
      }
    });
  }

  function resetData() {
    setConfirmState({
      open: true,
      title: "Reset catalog?",
      description: "Reset catalog to initial seed data? Custom edits will be overwritten.",
      action: async () => {
        try {
          const resetSeed = await productService.reset();
          setItems(resetSeed);
          toast({ title: "Catalog reset", description: "Inventory has been reset to seed data." });
        } catch (err) {
          toast({ title: "Error", description: "Failed to reset catalog.", variant: "destructive" });
        }
      }
    });
  }

  const filtered = items.filter((p) => (cat === "All" || p.category === cat) && (!query || `${p.name} ${p.sku} ${p.color_family}`.toLowerCase().includes(query.toLowerCase())));

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 text-xs font-medium rounded-sm border ${cat === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-accent"}`}>{c}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search inventory…" className="pl-8 pr-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent" />
          </div>
          <button onClick={resetData} title="Reset catalog to seed" className="p-2 border border-border rounded-sm hover:bg-secondary"><RefreshCw className="h-4 w-4 text-muted-foreground" /></button>
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 text-sm font-medium rounded-sm hover:bg-accent/90 shadow-sm"><Plus className="h-4 w-4" /> Add product</button>
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-muted-foreground">
                <tr className="text-left border-b border-border">
                  <th className="p-3 font-medium">Product</th>
                  <th className="p-3 font-medium">Category</th>
                  <th className="p-3 font-medium text-right">Price</th>
                  <th className="p-3 font-medium text-right">Stock</th>
                  <th className="p-3 font-medium text-right">Min Threshold</th>
                  <th className="p-3 font-medium w-20"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const low = p.stock <= p.min_threshold;
                  return (
                    <tr key={p.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <span className="h-9 w-9 rounded-sm bg-muted grid place-items-center overflow-hidden shrink-0">
                            {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : <Package className="h-4 w-4 text-muted-foreground" />}
                          </span>
                          <div>
                            <p className="font-medium text-foreground">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{p.category}</td>
                      <td className="p-3 text-right font-medium">{formatINR(p.price)} <span className="text-xs text-muted-foreground font-normal">{p.unit}</span></td>
                      <td className="p-3 text-right">
                        <span className={`inline-flex items-center gap-1 ${low ? "text-destructive font-semibold" : ""}`}>
                          {low && <AlertTriangle className="h-3.5 w-3.5" />}{p.stock}
                        </span>
                      </td>
                      <td className="p-3 text-right text-muted-foreground">{p.min_threshold}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-secondary rounded-sm text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => remove(p)} className="p-1.5 hover:bg-destructive/10 rounded-sm text-destructive"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!filtered.length && <p className="p-6 text-center text-sm text-muted-foreground">No products found.</p>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" onClick={close}>
          <form onSubmit={save} className="bg-background w-full max-w-2xl rounded-sm border border-border my-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display text-xl font-bold text-primary">{editing === "new" ? "Add product" : "Edit product"}</h2>
              <button type="button" onClick={close}><X className="h-5 w-5 text-muted-foreground hover:text-primary" /></button>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-4">
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
              <label className="flex items-center gap-2 sm:col-span-2 text-sm font-medium">
                <input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
                Feature on home catalog
              </label>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-2 bg-secondary/30">
              <button type="button" onClick={close} className="px-4 py-2 text-sm border border-border rounded-sm">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-sm disabled:opacity-50">{saving ? "Saving…" : "Save product"}</button>
            </div>
          </form>
        </div>
      )}

      <style>{`.ainput{width:100%;padding:0.5rem 0.7rem;font-size:0.875rem;background:#fff;border:1px solid hsl(var(--border));border-radius:0.125rem;}.ainput:focus{outline:none;border-color:hsl(var(--accent));}`}</style>
      
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