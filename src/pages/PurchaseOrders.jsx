import React, { useEffect, useState } from "react";
import { Plus, X, CheckCircle } from "lucide-react";
import { supplierService } from "@/services/supplierService";
import { productService } from "@/services/productService";
import { useToast } from "@/components/ui/use-toast";
import { formatINR } from "@/lib/interiorData";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";

const EMPTY = { supplierId: "", productId: "", quantity: 1, expectedDate: "" };

export default function PurchaseOrders() {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirmState, setConfirmState] = useState({ open: false, title: "", description: "", action: null });
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [poData, supData, prodData] = await Promise.all([
      supplierService.getAllPurchaseOrders().catch(() => []),
      supplierService.getAllSuppliers().catch(() => []),
      productService.list("-created_date", 200).catch(() => [])
    ]);
    setItems(poData);
    setSuppliers(supData);
    setProducts(prodData);
    setLoading(false);
  }

  function openNew() { setForm(EMPTY); setEditing("new"); }
  function close() { setEditing(null); }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const prod = products.find(p => p.id === form.productId);
      const sup = suppliers.find(s => s.id === form.supplierId);

      const payload = {
        ...form,
        supplierName: sup?.name || "Unknown",
        productName: prod?.name || "Unknown",
        totalAmount: (prod?.price || 0) * Number(form.quantity)
      };

      await supplierService.createPurchaseOrder(payload);
      toast({ title: "Purchase Order created", description: `Order created for ${payload.productName}.` });
      await load();
      close();
    } catch (_err) {
      toast({ title: "Error", description: "Failed to create PO.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function markReceived(p) {
    setConfirmState({
      open: true,
      title: `Mark PO as received?`,
      description: `This will mark the order for "${p.productName}" as received and update the inventory stock.`,
      action: async () => {
        try {
          await supplierService.updatePurchaseOrderStatus(p.id, "received");
          const prod = products.find(prod => prod.id === p.productId);
          if (prod) {
            await productService.update(prod.id, { stock: (Number(prod.stock) || 0) + parseInt(p.quantity, 10) });
          }
          toast({ title: "Order received", description: "Inventory stock has been updated." });
          await load();
        } catch (_err) {
          toast({ title: "Error", description: "Failed to receive order.", variant: "destructive" });
        }
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-primary">Purchase Orders</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Track restock orders from suppliers and automatically update stock upon receipt.</p>
        </div>
        <button onClick={openNew} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 text-sm font-semibold rounded-sm hover:bg-accent/90 shadow-sm">
          <Plus className="h-4 w-4" /> Create PO
        </button>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm p-4 space-y-4">
          <div className="flex gap-4 border-b border-border pb-4">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-4 w-1/5" />)}
          </div>
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-card border border-border rounded-sm p-8 sm:p-12 text-center text-sm text-muted-foreground">
          No purchase orders found. Click "Create PO" to issue your first restock order.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm min-w-[680px]">
              <thead className="bg-secondary/60 text-muted-foreground">
                <tr className="text-left border-b border-border text-xs uppercase tracking-wider font-semibold">
                  <th className="p-3">PO Details</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3 text-right">Quantity</th>
                  <th className="p-3 text-right">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-foreground">{p.productName}</div>
                      <div className="text-xs text-muted-foreground">Exp: {p.expectedDate || "N/A"}</div>
                    </td>
                    <td className="p-3 font-medium text-foreground">{p.supplierName}</td>
                    <td className="p-3 text-right font-semibold">{p.quantity}</td>
                    <td className="p-3 text-right font-semibold text-primary">{formatINR(p.totalAmount || 0)}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-sm capitalize ${
                        p.status === "received"
                          ? "bg-green-500/15 text-green-700 dark:text-green-300 border border-green-500/30"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                      }`}>
                        {p.status || "pending"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {p.status !== "received" && (
                        <button
                          onClick={() => markReceived(p)}
                          className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-2.5 py-1 text-xs font-semibold rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                          title="Mark PO as Received"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Receive
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto" onClick={close}>
          <form onSubmit={save} className="bg-background w-full max-w-lg rounded-sm border border-border my-6 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
              <h2 className="font-display text-lg sm:text-xl font-bold text-primary">Create Purchase Order</h2>
              <button aria-label="Close modal" type="button" onClick={close} className="p-1 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              <label className="block">
                <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Select Supplier *</span>
                <select
                  required
                  value={form.supplierId}
                  onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-sm focus:outline-none focus:border-accent bg-card"
                >
                  <option value="">Select a supplier…</option>
                  {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Select Product *</span>
                <select
                  required
                  value={form.productId}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-sm focus:outline-none focus:border-accent bg-card"
                >
                  <option value="">Select a product to restock…</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name} (Current Stock: {p.stock})</option>)}
                </select>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Quantity *</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-sm focus:outline-none focus:border-accent bg-card"
                  />
                </label>

                <label className="block">
                  <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">Expected Date</span>
                  <input
                    type="date"
                    value={form.expectedDate}
                    onChange={(e) => setForm({ ...form, expectedDate: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-sm focus:outline-none focus:border-accent bg-card"
                  />
                </label>
              </div>
            </div>
            <div className="p-4 sm:p-5 border-t border-border flex justify-end gap-2 bg-secondary/30">
              <button type="button" onClick={close} className="px-4 py-2 text-xs sm:text-sm border border-border rounded-sm font-medium">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2 text-xs sm:text-sm bg-primary text-primary-foreground font-semibold rounded-sm disabled:opacity-50">{saving ? "Creating…" : "Issue Order"}</button>
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
