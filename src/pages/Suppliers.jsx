import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import { supplierService } from "@/services/supplierService";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";

const EMPTY = { name: "", contactPerson: "", email: "", phone: "", address: "" };

export default function Suppliers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | supplier
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirmState, setConfirmState] = useState({ open: false, title: "", description: "", action: null });
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await supplierService.getAllSuppliers().catch(() => []);
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
        await supplierService.createSupplier(form);
        toast({ title: "Supplier created" });
      } else {
        await supplierService.updateSupplier(editing.id, form);
        toast({ title: "Supplier updated" });
      }
      await load();
      close();
    } catch (_err) {
      toast({ title: "Error", description: "Failed to save supplier.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function remove(p) {
    setConfirmState({
      open: true,
      title: `Delete "${p.name}"?`,
      description: "This action cannot be undone. This will permanently delete the supplier.",
      action: async () => {
        try {
          await supplierService.deleteSupplier(p.id);
          setItems((arr) => arr.filter((x) => x.id !== p.id));
          toast({ title: "Supplier deleted" });
        } catch (_err) {
          toast({ title: "Error", description: "Failed to delete supplier.", variant: "destructive" });
        }
      }
    });
  }

  const filtered = items.filter((p) => (!query || `${p.name} ${p.email} ${p.contactPerson}`.toLowerCase().includes(query.toLowerCase())));

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-primary">Suppliers</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage material suppliers, contact details, and procurement partners.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search suppliers…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent bg-card"
            />
          </div>
          <button onClick={openNew} className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 text-sm font-semibold rounded-sm hover:bg-accent/90 shadow-sm">
            <Plus className="h-4 w-4" /> Add Supplier
          </button>
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
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-sm p-8 sm:p-12 text-center text-sm text-muted-foreground">
          No suppliers found. Click "Add Supplier" to add a new vendor.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm min-w-[650px]">
              <thead className="bg-secondary/60 text-muted-foreground">
                <tr className="text-left border-b border-border text-xs uppercase tracking-wider font-semibold">
                  <th className="p-3">Supplier Name</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Email & Phone</th>
                  <th className="p-3">Address</th>
                  <th className="p-3 text-center w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                    <td className="p-3 font-semibold text-foreground">{p.name}</td>
                    <td className="p-3 text-muted-foreground font-medium">{p.contactPerson || "N/A"}</td>
                    <td className="p-3">
                      <div className="text-foreground">{p.email || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">{p.phone || ""}</div>
                    </td>
                    <td className="p-3 text-muted-foreground truncate max-w-[200px]">{p.address || "N/A"}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit/Create Supplier Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto" onClick={close}>
          <form onSubmit={save} className="bg-background w-full max-w-lg rounded-sm border border-border my-6 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
              <h2 className="font-display text-lg sm:text-xl font-bold text-primary">{editing === "new" ? "Add supplier" : "Edit supplier"}</h2>
              <button aria-label="Close modal" type="button" onClick={close} className="p-1 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-4 sm:p-5 space-y-3.5">
              <label className="block">
                <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Supplier Name *</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent bg-card" />
              </label>
              <label className="block">
                <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Contact Person</span>
                <input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent bg-card" />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Email</span>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent bg-card" />
                </label>
                <label className="block">
                  <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Phone</span>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent bg-card" />
                </label>
              </div>
              <label className="block">
                <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Address</span>
                <textarea rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent bg-card resize-none" />
              </label>
            </div>
            <div className="p-4 sm:p-5 border-t border-border flex justify-end gap-2 bg-secondary/30">
              <button type="button" onClick={close} className="px-4 py-2 text-xs sm:text-sm border border-border rounded-sm font-medium">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2 text-xs sm:text-sm bg-primary text-primary-foreground font-semibold rounded-sm disabled:opacity-50">{saving ? "Saving…" : "Save supplier"}</button>
            </div>
          </form>
        </div>
      )}

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
