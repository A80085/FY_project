import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Search, CheckCircle } from "lucide-react";
import { supplierService } from "@/services/supplierService";
import { productService } from "@/services/productService";
import { useToast } from "@/components/ui/use-toast";
import { formatINR } from "@/lib/interiorData";

const EMPTY = { supplierId: "", productId: "", quantity: 1, expectedDate: "" };

export default function PurchaseOrders() {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
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
        totalAmount: (prod?.price || 0) * form.quantity
      };

      await supplierService.createPurchaseOrder(payload);
      toast({ title: "Purchase Order created" });
      
      await load();
      close();
    } catch (err) {
      toast({ title: "Error", description: "Failed to create PO.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function markReceived(p) {
    if(!window.confirm(`Mark PO for ${p.productName} as received? This will update the inventory stock.`)) return;
    try {
      // Update PO Status
      await supplierService.updatePurchaseOrderStatus(p.id, "received");
      
      // Update Inventory Stock
      const prod = products.find(prod => prod.id === p.productId);
      if (prod) {
        await productService.update(prod.id, { stock: prod.stock + parseInt(p.quantity, 10) });
      }

      toast({ title: "Order received", description: "Inventory stock has been updated." });
      await load();
    } catch (err) {
      toast({ title: "Error", description: "Failed to receive order.", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
        <div className="flex gap-2">
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 text-sm font-medium rounded-sm hover:bg-accent/90 shadow-sm"><Plus className="h-4 w-4" /> Create PO</button>
        </div>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading orders...</div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-muted-foreground">
                <tr className="text-left border-b border-border">
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Supplier</th>
                  <th className="p-3 font-medium">Product</th>
                  <th className="p-3 font-medium text-right">Qty</th>
                  <th className="p-3 font-medium text-right">Total</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium w-20"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                    <td className="p-3 text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 font-medium text-foreground">{p.supplierName}</td>
                    <td className="p-3 text-muted-foreground">{p.productName}</td>
                    <td className="p-3 text-right">{p.quantity}</td>
                    <td className="p-3 text-right">{formatINR(p.totalAmount)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${p.status === 'received' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                        {p.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-3">
                      {p.status !== 'received' && (
                        <div className="flex items-center justify-end gap-1">
                          <button aria-label="Mark Received" onClick={() => markReceived(p)} className="p-1 text-green-600 hover:text-green-700"><CheckCircle className="h-4 w-4" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!items.length && <p className="p-6 text-center text-sm text-muted-foreground">No purchase orders found.</p>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" onClick={close}>
          <form onSubmit={save} className="bg-background w-full max-w-lg rounded-sm border border-border my-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display text-xl font-bold text-primary">Create Purchase Order</h2>
              <button aria-label="Close" type="button" onClick={close}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 grid gap-4">
              <F label="Supplier *">
                <select required value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} className="ainput">
                  <option value="">Select Supplier...</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </F>
              <F label="Product *">
                <select required value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className="ainput">
                  <option value="">Select Product...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                </select>
              </F>
              <div className="grid grid-cols-2 gap-4">
                <F label="Quantity"><input type="number" min="1" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} className="ainput" /></F>
                <F label="Expected Date"><input type="date" value={form.expectedDate} onChange={(e) => setForm({ ...form, expectedDate: e.target.value })} className="ainput" /></F>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-2 bg-secondary/30">
              <button type="button" onClick={close} className="px-4 py-2 text-sm border border-border rounded-sm">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-sm disabled:opacity-50">{saving ? "Saving…" : "Create PO"}</button>
            </div>
          </form>
        </div>
      )}
      <style>{`.ainput{width:100%;padding:0.5rem 0.7rem;font-size:0.875rem;background:#fff;border:1px solid hsl(var(--border));border-radius:0.125rem;}.ainput:focus{outline:none;border-color:hsl(var(--accent));}`}</style>
    </div>
  );
}

function F({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5 font-medium">{label}</span>
      {children}
    </label>
  );
}
