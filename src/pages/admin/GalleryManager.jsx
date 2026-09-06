import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Star, RefreshCw } from "lucide-react";
import { galleryService } from "@/services/galleryService";
import { Image } from "@/components/ui/image";
import { GALLERY_SEED } from "@/lib/interiorData";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const EMPTY = { title: "", room_type: "Living Room", category: "Modern", image_url: "", description: "", location: "Surat", year: "2024", is_featured: false };
const ROOM_TYPES = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Dining", "Full Home"];
const STYLES = ["Modern", "Classic", "Minimalist", "Industrial", "Scandinavian", "Luxury"];

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await galleryService.list("-created_date", 60).catch(() => []);
    setItems(data.length ? data : GALLERY_SEED);
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
        await galleryService.create(form);
        toast({ title: "Project added", description: "The project has been added to the gallery." });
      } else {
        await galleryService.update(editing.id, form);
        toast({ title: "Project updated", description: "Changes have been saved." });
      }
      await load();
      close();
    } catch (err) {
      toast({ title: "Error", description: "Failed to save project.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  const [confirmState, setConfirmState] = useState({ open: false, title: "", description: "", action: null });

  function remove(p) {
    setConfirmState({
      open: true,
      title: `Delete project "${p.title}"?`,
      description: "This action cannot be undone. This will permanently delete the project from the gallery.",
      action: async () => {
        try {
          await galleryService.delete(p.id);
          setItems((arr) => arr.filter((x) => x.id !== p.id));
          toast({ title: "Project deleted", description: `${p.title} removed from gallery.` });
        } catch (err) {
          toast({ title: "Error", description: "Failed to delete project.", variant: "destructive" });
        }
      }
    });
  }

  function resetData() {
    setConfirmState({
      open: true,
      title: "Reset gallery?",
      description: "Reset gallery to initial seed projects? All custom edits will be lost.",
      action: async () => {
        try {
          const resetSeed = await galleryService.reset();
          setItems(resetSeed);
          toast({ title: "Gallery reset", description: "Gallery has been reset to seed data." });
        } catch (err) {
          toast({ title: "Error", description: "Failed to reset gallery.", variant: "destructive" });
        }
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary">Project Gallery Manager</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage portfolio projects displayed on the public gallery</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetData} title="Reset to seed projects" className="p-2 border border-border rounded-sm hover:bg-secondary">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </button>
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 text-sm font-medium rounded-sm hover:bg-accent/90 shadow-sm">
            <Plus className="h-4 w-4" /> Add project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-sm overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <Skeleton className="w-full aspect-[4/3] rounded-none" />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
              <div className="p-4 border-t border-border flex items-center justify-end gap-2 bg-secondary/30">
                <Skeleton className="h-7 w-7 rounded-sm" />
                <Skeleton className="h-7 w-7 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <div key={p.id || p.title} className="bg-card border border-border rounded-sm overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {p.image_url ? (
                    <Image src={p.image_url} alt="" className="h-full w-full object-cover" fittingType="fill" />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-xs text-muted-foreground">No Image</div>
                  )}
                  {p.is_featured && (
                    <span className="absolute top-2 right-2 bg-accent text-accent-foreground p-1 rounded-full shadow">
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{p.room_type}</span>
                    <span>{p.location}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-primary">{p.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                </div>
              </div>

              <div className="p-4 border-t border-border flex items-center justify-end gap-2 bg-secondary/30">
                <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-secondary rounded-sm text-muted-foreground hover:text-primary">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(p)} className="p-1.5 hover:bg-destructive/10 rounded-sm text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" onClick={close}>
          <form onSubmit={save} className="bg-background w-full max-w-xl rounded-sm border border-border my-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display text-xl font-bold text-primary">{editing === "new" ? "Add project" : "Edit project"}</h2>
              <button type="button" onClick={close}><X className="h-5 w-5 text-muted-foreground hover:text-primary" /></button>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-4">
              <F label="Project Title *"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="ainput" /></F>
              <F label="Room Type">
                <select value={form.room_type} onChange={(e) => setForm({ ...form, room_type: e.target.value })} className="ainput">
                  {ROOM_TYPES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </F>
              <F label="Style / Category">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="ainput">
                  {STYLES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </F>
              <F label="Location"><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="ainput" placeholder="e.g. Surat" /></F>
              <F label="Year"><input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="ainput" placeholder="2024" /></F>
              <F label="Image URL" full><input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="ainput" placeholder="https://…" /></F>
              <F label="Description" full><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="ainput resize-none" /></F>
              <label className="flex items-center gap-2 sm:col-span-2 text-sm font-medium">
                <input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
                Feature on home page hero
              </label>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-2 bg-secondary/30">
              <button type="button" onClick={close} className="px-4 py-2 text-sm border border-border rounded-sm">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-sm disabled:opacity-50">{saving ? "Saving…" : "Save project"}</button>
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