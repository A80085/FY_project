import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import { supplierService } from "@/services/supplierService";
import { useToast } from "@/components/ui/use-toast";

const EMPTY = { name: "", contactPerson: "", email: "", phone: "", address: "" };

export default function Suppliers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | supplier
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
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
    } catch (err) {
      toast({ title: "Error", description: "Failed to save supplier.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function remove(p) {
    if(!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await supplierService.deleteSupplier(p.id);
      setItems((arr) => arr.filter((x) => x.id !== p.id));
      toast({ title: "Supplier deleted" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete supplier.", variant: "destructive" });
    }
  }

  const filtered = items.filter((p) => (!query || `${p.name} ${p.email}`.toLowerCase().includes(query.toLowerCase())));

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search suppliers…" className="pl-8 pr-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent" />
          </div>
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 text-sm font-medium rounded-sm hover:bg-accent/90 shadow-sm"><Plus className="h-4 w-4" /> Add Supplier</button>
        </div>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading suppliers...</div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-muted-foreground">
                <tr className="text-left border-b border-border">
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Contact Person</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Phone</th>
                  <th className="p-3 font-medium w-20"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">{p.name}</td>
                    <td className="p-3 text-muted-foreground">{p.contactPerson}</td>
                    <td className="p-3 text-muted-foreground">{p.email}</td>
                    <td className="p-3 text-muted-foreground">{p.phone}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <button aria-label="Edit" onClick={() => openEdit(p)} className="p-1 hover:text-accent"><Pencil className="h-4 w-4" /></button>
                        <button aria-label="Delete" onClick={() => remove(p)} className="p-1 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && <p className="p-6 text-center text-sm text-muted-foreground">No suppliers found.</p>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" onClick={close}>
          <form onSubmit={save} className="bg-background w-full max-w-lg rounded-sm border border-border my-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display text-xl font-bold text-primary">{editing === "new" ? "Add Supplier" : "Edit Supplier"}</h2>
              <button aria-label="Close" type="button" onClick={close}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-4">
              <F label="Name *"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="ainput" /></F>
              <F label="Contact Person"><input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} className="ainput" /></F>
              <F label="Email"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="ainput" /></F>
              <F label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="ainput" /></F>
              <F label="Address" full><textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="ainput resize-none" /></F>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-2 bg-secondary/30">
              <button type="button" onClick={close} className="px-4 py-2 text-sm border border-border rounded-sm">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-sm disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
            </div>
          </form>
        </div>
      )}
      <style>{`.ainput{width:100%;padding:0.5rem 0.7rem;font-size:0.875rem;background:#fff;border:1px solid hsl(var(--border));border-radius:0.125rem;}.ainput:focus{outline:none;border-color:hsl(var(--accent));}`}</style>
    </div>
  );
}

function F({ label, children, full = false }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="block text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">{label}</span>
      {children}
    </label>
  );
}
