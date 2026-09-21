import React, { useEffect, useState } from "react";
import { Trash2, Mail, Phone, Calendar, Search } from "lucide-react";
import { inquiryService } from "@/services/inquiryService";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

export default function Inquiries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await inquiryService.list("-created_date", 200).catch(() => []);
    setItems(data);
    setLoading(false);
  }

  async function updateStatus(item, status) {
    try {
      await inquiryService.updateStatus(item.id, status);
      setItems((arr) => arr.map((x) => (x.id === item.id ? { ...x, status } : x)));
      toast({ title: "Status updated", description: `Inquiry marked as ${status}.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  }

  const [confirmState, setConfirmState] = useState({ open: false, title: "", description: "", action: null });

  function remove(item) {
    setConfirmState({
      open: true,
      title: `Delete inquiry from ${item.customer_name}?`,
      description: "This action cannot be undone.",
      action: async () => {
        try {
          await inquiryService.delete(item.id);
          setItems((arr) => arr.filter((x) => x.id !== item.id));
          toast({ title: "Inquiry deleted", description: "The inquiry has been removed." });
        } catch (err) {
          toast({ title: "Error", description: "Failed to delete inquiry.", variant: "destructive" });
        }
      }
    });
  }

  const filtered = items.filter((i) => {
    const okStatus = statusFilter === "All" || i.status === statusFilter;
    const okQ = !query || `${i.customer_name} ${i.email} ${i.phone} ${i.subject}`.toLowerCase().includes(query.toLowerCase());
    return okStatus && okQ;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {["All", "New", "In Progress", "Closed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm border ${
                statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search inquiries…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-accent bg-card"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-sm p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-sm p-12 text-center text-sm text-muted-foreground">
          No customer inquiries found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-sm p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-bold text-primary">{item.customer_name}</span>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-sm ${
                    item.status === "New"
                      ? "bg-accent/20 text-accent-foreground border border-accent/30"
                      : item.status === "In Progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(item.created_date || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent shrink-0" />
                  <a href={`mailto:${item.email}`} className="hover:text-primary">{item.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent shrink-0" />
                  <a href={`tel:${item.phone}`} className="hover:text-primary">{item.phone}</a>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Subject</p>
                <p className="text-sm font-semibold text-primary">{item.subject}</p>
              </div>

              {item.interested_products && (
                <div className="p-3 bg-secondary/50 rounded-sm text-xs">
                  <span className="font-medium text-muted-foreground block mb-0.5">Interested Materials:</span>
                  <span className="text-foreground">{item.interested_products}</span>
                </div>
              )}

              {item.estimate_summary && (
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-sm text-xs">
                  <span className="font-medium text-accent block mb-0.5">Attached Estimate Summary:</span>
                  <span className="text-foreground">{item.estimate_summary}</span>
                </div>
              )}

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Message</p>
                <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">{item.message}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Status:</span>
                  {["New", "In Progress", "Closed"].map((st) => (
                    <button
                      key={st}
                      onClick={() => updateStatus(item, st)}
                      className={`px-2.5 py-1 text-xs rounded-sm border ${
                        item.status === st ? "bg-primary text-primary-foreground border-primary font-medium" : "border-border hover:border-accent"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => remove(item)}
                  className="p-1.5 text-destructive hover:bg-destructive/10 rounded-sm transition-colors"
                  title="Delete inquiry"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
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