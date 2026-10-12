import React, { useEffect, useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Printer, 
  MessageCircle, 
  Trash2, 
  X, 
  Phone
} from "lucide-react";
import { salesService } from "@/services/salesService";
import { productService } from "@/services/productService";
import { formatINR } from "@/lib/interiorData";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const PAYMENT_MODES = ["UPI", "Cash", "Bank Transfer / NEFT", "Cheque", "Card"];
const PAYMENT_STATUSES = ["Paid", "Partial", "Pending"];
const DELIVERY_STATUSES = ["Delivered", "Scheduled", "Pending Dispatch", "Handed Over in Store"];

const EMPTY_SALE_FORM = {
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  siteReference: "",
  paymentMode: "UPI",
  paymentStatus: "Paid",
  deliveryStatus: "Handed Over in Store",
  discount: 0,
  taxRate: 0,
  amountPaid: 0,
  deductStock: true,
  notes: "",
  items: [
    { productId: "", productName: "", category: "General", unit: "piece", quantity: 1, rate: 0, amount: 0 }
  ]
};

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_SALE_FORM);
  const [saving, setSaving] = useState(false);
  
  // Print / View Invoice modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Delete confirm dialog
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, invoiceNumber: "" });
  
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [salesData, productsData] = await Promise.all([
        salesService.list(),
        productService.list("-created_date", 200)
      ]);
      setSales(salesData);
      setProducts(productsData);
    } catch (e) {
      console.error("Failed to load sales data:", e);
      toast({ title: "Error", description: "Failed to load sales records.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  // Filtered sales
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const matchesSearch =
        !search ||
        s.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
        s.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        s.customerPhone?.includes(search) ||
        s.siteReference?.toLowerCase().includes(search.toLowerCase());
      
      const matchesPayment = paymentFilter === "All" || s.paymentStatus === paymentFilter;
      return matchesSearch && matchesPayment;
    });
  }, [sales, search, paymentFilter]);

  // Financial KPIs
  const kpis = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + (Number(s.amountPaid) || Number(s.totalAmount) || 0), 0);
    
    // Today's sales
    const today = new Date().toDateString();
    const todaySales = sales
      .filter(s => new Date(s.date || s.createdAt).toDateString() === today)
      .reduce((sum, s) => sum + (Number(s.amountPaid) || Number(s.totalAmount) || 0), 0);
    
    // Pending balances to collect
    const pendingDues = sales
      .filter(s => s.paymentStatus === "Partial" || s.paymentStatus === "Pending")
      .reduce((sum, s) => sum + (Number(s.balanceDue) || 0), 0);

    return {
      totalRevenue,
      todaySales,
      pendingDues,
      totalOrders: sales.length
    };
  }, [sales]);

  // Handle Item Row Changes
  function handleItemChange(index, field, value) {
    const updatedItems = [...form.items];
    const currentItem = { ...updatedItems[index], [field]: value };

    // If product was selected from dropdown, auto-fill name, rate, category, unit
    if (field === "productId") {
      const prod = products.find(p => p.id === value);
      if (prod) {
        currentItem.productName = prod.name;
        currentItem.rate = prod.price || 0;
        currentItem.category = prod.category || "General";
        currentItem.unit = prod.unit || "unit";
        currentItem.availableStock = prod.stock;
      }
    }

    // Auto-calculate line amount
    const qty = Number(currentItem.quantity) || 0;
    const rate = Number(currentItem.rate) || 0;
    currentItem.amount = qty * rate;

    updatedItems[index] = currentItem;
    
    // Recompute form totals
    computeFormTotals(updatedItems, form.discount, form.taxRate, form.paymentStatus, form.amountPaid);
  }

  function addItemRow() {
    setForm(f => ({
      ...f,
      items: [
        ...f.items,
        { productId: "", productName: "", category: "General", unit: "piece", quantity: 1, rate: 0, amount: 0 }
      ]
    }));
  }

  function removeItemRow(index) {
    if (form.items.length <= 1) return;
    const updated = form.items.filter((_, i) => i !== index);
    computeFormTotals(updated, form.discount, form.taxRate, form.paymentStatus, form.amountPaid);
  }

  function computeFormTotals(items, discount, taxRate, paymentStatus, customAmountPaid) {
    const subtotal = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
    const disc = Number(discount) || 0;
    const taxable = Math.max(0, subtotal - disc);
    const tax = (taxable * (Number(taxRate) || 0)) / 100;
    const total = Math.round(taxable + tax);

    let paid = total;
    if (paymentStatus === "Pending") {
      paid = 0;
    } else if (paymentStatus === "Partial") {
      paid = customAmountPaid !== undefined ? Number(customAmountPaid) : Math.round(total / 2);
    }
    const balance = Math.max(0, total - paid);

    setForm(f => ({
      ...f,
      items,
      subtotal,
      discount: disc,
      taxRate: Number(taxRate) || 0,
      taxAmount: tax,
      totalAmount: total,
      amountPaid: paid,
      balanceDue: balance
    }));
  }

  // Open modal
  function openNewSaleModal() {
    setForm({
      ...EMPTY_SALE_FORM,
      items: [
        { productId: "", productName: "", category: "General", unit: "piece", quantity: 1, rate: 0, amount: 0 }
      ]
    });
    setIsModalOpen(true);
  }

  // Submit sale
  async function handleSaveSale(e) {
    e.preventDefault();
    if (!form.customerName.trim()) {
      toast({ title: "Name required", description: "Please enter customer name.", variant: "destructive" });
      return;
    }
    if (form.items.length === 0 || !form.items[0].productName) {
      toast({ title: "Items required", description: "Please add at least one valid item.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      await salesService.create(form, form.deductStock);
      toast({
        title: "Sale Logged Successfully",
        description: `Invoice ${form.invoiceNumber || "created"} recorded${form.deductStock ? " & stock updated" : ""}.`
      });
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save sale:", err);
      toast({ title: "Error", description: "Failed to record sale.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  // Quick mark paid
  async function markBalancePaid(sale) {
    try {
      await salesService.update(sale.id, {
        paymentStatus: "Paid",
        amountPaid: sale.totalAmount,
        balanceDue: 0
      });
      toast({ title: "Balance Cleared", description: `Invoice ${sale.invoiceNumber} is marked fully Paid.` });
      await loadData();
    } catch (_e) {
      toast({ title: "Error", description: "Failed to update payment.", variant: "destructive" });
    }
  }

  // Delete sale
  async function executeDelete() {
    if (!confirmDelete.id) return;
    try {
      await salesService.delete(confirmDelete.id);
      toast({ title: "Record Deleted", description: `Invoice ${confirmDelete.invoiceNumber} removed.` });
      setConfirmDelete({ open: false, id: null, invoiceNumber: "" });
      await loadData();
    } catch (_e) {
      toast({ title: "Error", description: "Failed to delete record.", variant: "destructive" });
    }
  }

  // Send WhatsApp Receipt
  function sendWhatsAppBill(sale) {
    if (!sale.customerPhone) {
      toast({ title: "No Phone Number", description: "This customer does not have a phone number on file.", variant: "destructive" });
      return;
    }
    const cleanPhone = sale.customerPhone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const itemsText = sale.items.map(it => `• ${it.productName} (${it.quantity} ${it.unit || ""}) - ₹${it.amount}`).join("%0A");
    const msg = encodeURIComponent(
      `*Shree Mangalam Ply & Interiors - Receipt*\n\n` +
      `Invoice: *${sale.invoiceNumber}*\n` +
      `Customer: ${sale.customerName}\n` +
      `Date: ${new Date(sale.date || sale.createdAt).toLocaleDateString()}\n\n` +
      `*Items:*\n`
    ) + itemsText + encodeURIComponent(
      `\n\n*Total Amount:* ₹${sale.totalAmount}\n` +
      `*Amount Paid:* ₹${sale.amountPaid} (${sale.paymentMode})\n` +
      (sale.balanceDue > 0 ? `*Balance Due:* ₹${sale.balanceDue}\n` : `*Status:* Fully Paid ✓\n`) +
      `\nThank you for choosing Shree Mangalam! Visit us again at Old Viva College Road, Virar West.`
    );

    window.open(`https://wa.me/${formattedPhone}?text=${msg}`, "_blank");
  }

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            In-Store Sales &amp; POS
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Log walk-in sales, track cash/UPI payments, collect pending customer balances, and sync inventory.
          </p>
        </div>
        <button
          onClick={openNewSaleModal}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-md text-xs sm:text-sm font-semibold shadow-sm transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          Log In-Store Sale
        </button>
      </div>

      {/* ── KPI METRICS CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Total In-Store Revenue</p>
          <p className="text-xl sm:text-2xl font-display font-bold text-foreground mt-1">{formatINR(kpis.totalRevenue)}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Across all logged offline sales</p>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">Today's Sales</p>
          <p className="text-xl sm:text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatINR(kpis.todaySales)}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Cash &amp; UPI collected today</p>
        </div>

        <div className={`bg-card border rounded-xl p-4 sm:p-5 shadow-2xs ${kpis.pendingDues > 0 ? "border-amber-500/50 bg-amber-500/5" : "border-border/80"}`}>
          <p className="text-[11px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">Pending Dues to Collect</p>
          <p className="text-xl sm:text-2xl font-display font-bold text-amber-600 dark:text-amber-400 mt-1">{formatINR(kpis.pendingDues)}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Outstanding customer balances</p>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Total Invoices Logged</p>
          <p className="text-xl sm:text-2xl font-display font-bold text-foreground mt-1">{kpis.totalOrders}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Complete sales history</p>
        </div>
      </div>

      {/* ── TOOLBAR: SEARCH & FILTERS ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or invoice #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-md text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {["All", "Paid", "Partial", "Pending"].map((status) => (
            <button
              key={status}
              onClick={() => setPaymentFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                paymentFilter === status
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ── SALES TABLE ── */}
      <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/60 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[10px] sm:text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Delivery</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    Loading sales records...
                  </td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    No in-store sales found. Click "Log In-Store Sale" to record the first transaction!
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-foreground whitespace-nowrap">
                      {sale.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {new Date(sale.date || sale.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="py-3.5 px-4 min-w-[160px]">
                      <p className="font-semibold text-foreground leading-snug">{sale.customerName}</p>
                      {sale.customerPhone && (
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground/80" />
                          {sale.customerPhone}
                        </p>
                      )}
                      {sale.siteReference && (
                        <p className="text-[10px] text-accent font-medium mt-0.5 line-clamp-1">{sale.siteReference}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground max-w-[220px]">
                      <p className="truncate">
                        {sale.items?.map(it => `${it.quantity}x ${it.productName}`).join(", ") || "Custom materials"}
                      </p>
                      <span className="text-[10px] text-muted-foreground/75 font-mono">
                        {sale.items?.length || 1} item line(s)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-display font-semibold text-foreground">{formatINR(sale.totalAmount)}</p>
                      {sale.balanceDue > 0 && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                          Due: {formatINR(sale.balanceDue)}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        sale.paymentStatus === "Paid"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                          : sale.paymentStatus === "Partial"
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                          : "bg-destructive/15 text-destructive border border-destructive/30"
                      }`}>
                        {sale.paymentStatus}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{sale.paymentMode}</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-[11px] font-medium text-foreground">
                        {sale.deliveryStatus || "Delivered"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View & Print Receipt */}
                        <button
                          onClick={() => setSelectedInvoice(sale)}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="View & Print Invoice"
                        >
                          <Printer className="h-4 w-4" />
                        </button>

                        {/* WhatsApp Receipt */}
                        <button
                          onClick={() => sendWhatsAppBill(sale)}
                          className="p-1.5 rounded-md hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-colors"
                          title="Send Bill via WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>

                        {/* Clear balance button if partial */}
                        {sale.balanceDue > 0 && (
                          <button
                            onClick={() => markBalancePaid(sale)}
                            className="px-2 py-1 rounded-sm text-[10px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                            title="Mark Full Balance Received"
                          >
                            Clear Due
                          </button>
                        )}

                        {/* Delete sale */}
                        <button
                          onClick={() => setConfirmDelete({ open: true, id: sale.id, invoiceNumber: sale.invoiceNumber })}
                          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: LOG IN-STORE SALE ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-display font-semibold text-foreground">Log New In-Store Sale</h2>
                <p className="text-xs text-muted-foreground">Record walk-in purchase, customer invoice, and sync stock.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveSale} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Customer Information */}
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wider font-semibold text-accent">Customer &amp; Site Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs sm:text-sm text-foreground focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">WhatsApp Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9820198765"
                      value={form.customerPhone}
                      onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs sm:text-sm text-foreground focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Delivery / Site Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 301, Rustomjee Global City, Virar West"
                      value={form.customerAddress}
                      onChange={(e) => setForm({ ...form, customerAddress: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs sm:text-sm text-foreground focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Carpenter / Site Reference</label>
                    <input
                      type="text"
                      placeholder="e.g. Carpenter: Santosh Bhai (Wardrobe)"
                      value={form.siteReference}
                      onChange={(e) => setForm({ ...form, siteReference: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs sm:text-sm text-foreground focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-3 pt-3 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider font-semibold text-accent">Purchased Items &amp; Finishes</p>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Another Item
                  </button>
                </div>

                <div className="space-y-3">
                  {form.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-muted/30 border border-border/70 rounded-lg space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                        {/* Product selection from inventory */}
                        <div className="sm:col-span-5">
                          <label className="block text-[11px] font-medium text-muted-foreground mb-1">Select from Catalog</label>
                          <select
                            value={item.productId}
                            onChange={(e) => handleItemChange(idx, "productId", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-background border border-border rounded-md text-xs text-foreground focus:outline-none focus:border-accent"
                          >
                            <option value="">-- Choose Catalog Product --</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} (Stock: {p.stock ?? "N/A"})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Custom product name override / custom entry */}
                        <div className="sm:col-span-7">
                          <label className="block text-[11px] font-medium text-muted-foreground mb-1">Item Description</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 18mm BWP Marine Plywood"
                            value={item.productName}
                            onChange={(e) => handleItemChange(idx, "productName", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-background border border-border rounded-md text-xs text-foreground focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-3">
                          <label className="block text-[10px] text-muted-foreground mb-0.5">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            step="any"
                            required
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-background border border-border rounded-md text-xs text-foreground focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[10px] text-muted-foreground mb-0.5">Unit (sheet/sqft/pair)</label>
                          <input
                            type="text"
                            placeholder="sheet"
                            value={item.unit}
                            onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-background border border-border rounded-md text-xs text-foreground focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[10px] text-muted-foreground mb-0.5">Rate (₹ per unit)</label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            required
                            value={item.rate}
                            onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-background border border-border rounded-md text-xs text-foreground focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-muted-foreground mb-0.5">Line Total</label>
                          <p className="font-semibold text-xs text-foreground pt-1.5">{formatINR(item.amount)}</p>
                        </div>

                        <div className="sm:col-span-1 text-right">
                          {form.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItemRow(idx)}
                              className="text-muted-foreground hover:text-destructive p-1 rounded-sm"
                              title="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Status Section */}
              <div className="space-y-3 pt-3 border-t border-border/60">
                <p className="text-xs uppercase tracking-wider font-semibold text-accent">Payment &amp; Delivery</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Payment Mode</label>
                    <select
                      value={form.paymentMode}
                      onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs sm:text-sm text-foreground focus:outline-none focus:border-accent"
                    >
                      {PAYMENT_MODES.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Payment Status</label>
                    <select
                      value={form.paymentStatus}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        computeFormTotals(form.items, form.discount, form.taxRate, newStatus, form.amountPaid);
                      }}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs sm:text-sm text-foreground focus:outline-none focus:border-accent"
                    >
                      {PAYMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Delivery / Handover</label>
                    <select
                      value={form.deliveryStatus}
                      onChange={(e) => setForm({ ...form, deliveryStatus: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs sm:text-sm text-foreground focus:outline-none focus:border-accent"
                    >
                      {DELIVERY_STATUSES.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* If partial, show amount paid now input */}
                {form.paymentStatus === "Partial" && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-md grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">Advance Received Now (₹) *</label>
                      <input
                        type="number"
                        min="0"
                        max={form.totalAmount}
                        value={form.amountPaid}
                        onChange={(e) => computeFormTotals(form.items, form.discount, form.taxRate, "Partial", e.target.value)}
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-md text-xs sm:text-sm text-foreground focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Remaining Balance Due to Collect:</p>
                      <p className="text-base font-bold text-amber-600 dark:text-amber-400">{formatINR(form.balanceDue)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Financial Calculation Bar */}
              <div className="p-4 bg-muted/40 rounded-lg border border-border/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] text-muted-foreground">Discount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.discount}
                      onChange={(e) => computeFormTotals(form.items, e.target.value, form.taxRate, form.paymentStatus, form.amountPaid)}
                      className="w-24 px-2 py-1 bg-background border border-border rounded-md text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-muted-foreground">GST Tax (%)</label>
                    <select
                      value={form.taxRate}
                      onChange={(e) => computeFormTotals(form.items, form.discount, e.target.value, form.paymentStatus, form.amountPaid)}
                      className="px-2 py-1 bg-background border border-border rounded-md text-xs"
                    >
                      <option value="0">0% (Nil)</option>
                      <option value="5">5% (Composite)</option>
                      <option value="18">18% (Standard GST)</option>
                    </select>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-muted-foreground">Total Billable Amount:</span>
                  <p className="text-xl font-display font-bold text-foreground">{formatINR(form.totalAmount)}</p>
                </div>
              </div>

              {/* Inventory Sync Checkbox */}
              <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.deductStock}
                  onChange={(e) => setForm({ ...form, deductStock: e.target.checked })}
                  className="rounded text-accent focus:ring-accent"
                />
                <span className="font-medium">Automatically deduct item quantities from Inventory Stock</span>
              </label>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-md text-xs sm:text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-xs sm:text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
                >
                  {saving ? "Recording Sale..." : "Confirm & Save Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: PRINTABLE / VIEWABLE INVOICE ── */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white text-zinc-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Modal Controls */}
            <div className="px-6 py-3 bg-zinc-100 border-b border-zinc-200 flex items-center justify-between print:hidden">
              <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Showroom Tax Invoice</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 bg-zinc-900 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-zinc-800 transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" /> Print / PDF
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-zinc-500 hover:text-zinc-900 p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div className="p-8 overflow-y-auto space-y-6 text-sm" id="printable-invoice">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-zinc-200 pb-5">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wide text-zinc-900">
                    Shree Mangalam Ply &amp; Interiors
                  </h2>
                  <p className="text-xs text-zinc-600 mt-1">Shop No. 06, Kusum Vihar 'A', Beside Banjara Hotel</p>
                  <p className="text-xs text-zinc-600">Old Viva College Road, Virar West, Palghar - 401303</p>
                  <p className="text-xs text-zinc-600 font-mono mt-0.5">Tel: +91 87886 09224 / +91 98250 12345</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-0.5 bg-zinc-100 text-zinc-800 font-mono text-xs font-bold rounded-sm border border-zinc-300">
                    {selectedInvoice.invoiceNumber}
                  </span>
                  <p className="text-xs text-zinc-500 mt-1">
                    Date: {new Date(selectedInvoice.date || selectedInvoice.createdAt).toLocaleDateString("en-IN")}
                  </p>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    Mode: {selectedInvoice.paymentMode} ({selectedInvoice.paymentStatus})
                  </p>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-zinc-50 p-3.5 rounded-md border border-zinc-200">
                <div>
                  <p className="text-[10px] uppercase font-semibold text-zinc-400">Billed To:</p>
                  <p className="font-bold text-zinc-900 text-sm mt-0.5">{selectedInvoice.customerName}</p>
                  <p className="text-zinc-600">{selectedInvoice.customerPhone}</p>
                  {selectedInvoice.customerAddress && (
                    <p className="text-zinc-600 mt-0.5">{selectedInvoice.customerAddress}</p>
                  )}
                </div>
                <div>
                  {selectedInvoice.siteReference && (
                    <>
                      <p className="text-[10px] uppercase font-semibold text-zinc-400">Site / Reference:</p>
                      <p className="font-medium text-zinc-800 mt-0.5">{selectedInvoice.siteReference}</p>
                    </>
                  )}
                  <p className="text-[10px] uppercase font-semibold text-zinc-400 mt-2">Delivery Status:</p>
                  <p className="font-medium text-zinc-800">{selectedInvoice.deliveryStatus}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border border-zinc-200">
                <thead className="bg-zinc-100 text-zinc-700 font-semibold border-b border-zinc-200">
                  <tr>
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Item Description</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Rate (₹)</th>
                    <th className="py-2 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {selectedInvoice.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 text-zinc-400 font-mono">{idx + 1}</td>
                      <td className="py-2 px-3 font-medium text-zinc-900">{it.productName}</td>
                      <td className="py-2 px-3 text-center">{it.quantity} {it.unit || ""}</td>
                      <td className="py-2 px-3 text-right font-mono">₹{it.rate}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">₹{it.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Breakdown */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{selectedInvoice.subtotal}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount:</span>
                      <span className="font-mono">-₹{selectedInvoice.discount}</span>
                    </div>
                  )}
                  {selectedInvoice.taxAmount > 0 && (
                    <div className="flex justify-between text-zinc-600">
                      <span>GST ({selectedInvoice.taxRate}%):</span>
                      <span className="font-mono">+₹{selectedInvoice.taxAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-zinc-900 pt-1.5 border-t border-zinc-300">
                    <span>Grand Total:</span>
                    <span className="font-mono">₹{selectedInvoice.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-zinc-700 font-medium pt-1">
                    <span>Amount Paid:</span>
                    <span className="font-mono">₹{selectedInvoice.amountPaid}</span>
                  </div>
                  {selectedInvoice.balanceDue > 0 && (
                    <div className="flex justify-between text-amber-600 font-bold">
                      <span>Balance Due:</span>
                      <span className="font-mono">₹{selectedInvoice.balanceDue}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-6 border-t border-zinc-200 text-[11px] text-zinc-500 flex justify-between items-end">
                <div>
                  <p className="font-semibold text-zinc-700">Thank you for your business!</p>
                  <p>Quality tested BWP marine plywood &amp; architectural laminates.</p>
                </div>
                <div className="text-right">
                  <p className="border-t border-zinc-400 pt-1 font-mono text-[10px]">Authorized Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE DIALOG ── */}
      <ConfirmDialog
        open={confirmDelete.open}
        onOpenChange={(open) => !open && setConfirmDelete({ open: false, id: null, invoiceNumber: "" })}
        title="Delete In-Store Sale Record?"
        description={`Are you sure you want to delete invoice ${confirmDelete.invoiceNumber}? This action cannot be undone.`}
        confirmText="Delete Record"
        onConfirm={executeDelete}
        variant="destructive"
      />
    </div>
  );
}
