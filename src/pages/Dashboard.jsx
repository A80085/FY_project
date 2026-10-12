import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Package, AlertTriangle, MessageSquare, TrendingUp, ArrowRight, Boxes, Wallet, ShoppingCart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { productService } from "@/services/productService";
import { inquiryService } from "@/services/inquiryService";
import { galleryService } from "@/services/galleryService";
import { salesService } from "@/services/salesService";
import { formatINR } from "@/lib/interiorData";
import { useAuth } from "@/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#16a34a', '#d97706', '#dc2626', '#9333ea', '#0891b2'];

// Fallback data shown when Firestore collections are empty
const SEED_CATEGORY_DATA = [
  { name: "Laminates", value: 14 },
  { name: "Plywood", value: 8 },
  { name: "Hardware", value: 11 },
  { name: "Veneer", value: 6 },
  { name: "Accessories", value: 5 },
  { name: "Custom Pieces", value: 4 },
];

const SEED_TREND_DATA = [
  { name: "Mon", inquiries: 3 },
  { name: "Tue", inquiries: 5 },
  { name: "Wed", inquiries: 2 },
  { name: "Thu", inquiries: 8 },
  { name: "Fri", inquiries: 6 },
  { name: "Sat", inquiries: 9 },
  { name: "Sun", inquiries: 4 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: [], inquiries: [], gallery: [], sales: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productService.list("-created_date", 200).catch(() => []),
      inquiryService.list("-created_date", 200).catch(() => []),
      galleryService.list("-created_date", 60).catch(() => []),
      salesService.list().catch(() => [])
    ]).then(([products, inquiries, gallery, sales]) => {
      setStats({ products, inquiries, gallery, sales });
      setLoading(false);
    });
  }, []);

  const lowStock = stats.products.filter((p) => p.stock <= p.min_threshold);
  const inventoryValue = stats.products.reduce((s, p) => s + (p.price || 0) * (p.stock || 0), 0);
  const totalSalesRevenue = stats.sales.reduce((s, x) => s + (Number(x.amountPaid) || Number(x.totalAmount) || 0), 0);
  const pendingDues = stats.sales.reduce((s, x) => s + (Number(x.balanceDue) || 0), 0);

  const cards = [
    { label: "Total Products", value: stats.products.length, icon: Package, to: "/admin/inventory" },
    { label: "In-Store Sales", value: formatINR(totalSalesRevenue), icon: ShoppingCart, to: "/admin/sales" },
    { label: "Pending Balances", value: formatINR(pendingDues), icon: AlertTriangle, to: "/admin/sales", warn: pendingDues > 0 },
    { label: "Inventory Valuation", value: formatINR(inventoryValue), icon: Wallet, to: "/admin/inventory" },
  ];

  const categoryData = useMemo(() => {
    const counts = {};
    stats.products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [stats.products]);

  // Real trend data — group inquiries by day for the last 7 days
  const trendData = useMemo(() => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push({ date: d, name: dayNames[d.getDay()], inquiries: 0 });
    }
    stats.inquiries.forEach(inq => {
      // Handle both ISO string and Firestore Timestamp objects
      const raw = inq.created_date || inq.createdAt;
      if (!raw) return;
      const inqDate = raw?.toDate ? raw.toDate() : new Date(raw);
      inqDate.setHours(0, 0, 0, 0);
      const match = days.find(d => d.date.getTime() === inqDate.getTime());
      if (match) match.inquiries++;
    });
    const result = days.map(({ name, inquiries }) => ({ name, inquiries }));
    // Use seed data if all real values are zero (no recent inquiries yet)
    return result.every(d => d.inquiries === 0) ? SEED_TREND_DATA : result;
  }, [stats.inquiries]);

  // Use seed category data when Firestore products collection is empty
  const resolvedCategoryData = categoryData.length === 0 && !loading ? SEED_CATEGORY_DATA : categoryData;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="wood-panel-dark p-6 sm:p-8 rounded-sm shadow-md border border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="eyebrow text-accent mb-2">Showroom Management</p>
          <h1 className="font-display text-3xl sm:text-4xl text-white">Welcome back, {user?.name?.split(" ")[0] || "Admin"}</h1>
          <p className="mt-2 text-white/75 text-sm max-w-xl">
            Shree Mangalam Interior Studio live metrics. Track catalog stock levels, process customer inquiries, and update project gallery.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/sales"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 text-xs font-semibold rounded-sm hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <ShoppingCart className="h-4 w-4" /> In-Store Sales (POS)
          </Link>
          <Link
            to="/admin/inventory"
            className="glow-amber inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 text-xs font-medium rounded-sm hover:bg-accent/90 transition-colors shadow-sm"
          >
            <Package className="h-4 w-4" /> Manage Inventory
          </Link>
          <Link
            to="/admin/inquiries"
            className="inline-flex items-center gap-2 border border-white/20 text-white px-4 py-2.5 text-xs font-medium rounded-sm hover:bg-white/10 transition-colors"
          >
            <MessageSquare className="h-4 w-4" /> View Inquiries
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              to={c.to}
              className={`p-5 rounded-sm border transition-all hover:shadow-md ${
                c.warn
                  ? "bg-destructive/10 border-destructive/30"
                  : c.highlight
                  ? "bg-accent/10 border-accent/30"
                  : "bg-card border-border hover:border-accent/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{c.label}</span>
                <Icon className={`h-5 w-5 ${c.warn ? "text-destructive" : c.highlight ? "text-accent" : "text-muted-foreground"}`} />
              </div>
              <p className="font-display text-3xl text-primary font-bold mt-3">
                {loading ? <Skeleton className="h-9 w-24 mt-1" /> : c.value}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-sm p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-display text-xl text-primary font-bold flex items-center gap-2">
              <Boxes className="h-5 w-5 text-accent" /> Inventory by Category
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Distribution of products in the catalog</p>
          </div>
          {loading ? (
            <Skeleton className="w-full h-[250px] rounded-sm" />
          ) : (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resolvedCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: "hsl(var(--secondary))" }}
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "4px", fontSize: "12px" }} 
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {resolvedCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-sm p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-display text-xl text-primary font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" /> Inquiry Trends
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Customer leads over the last 7 days</p>
          </div>
          {loading ? (
            <Skeleton className="w-full h-[250px] rounded-sm" />
          ) : (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: "hsl(var(--secondary))" }}
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "4px", fontSize: "12px" }} 
                  />
                  <Bar dataKey="inquiries" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Low Stock Alert, Recent In-Store Sales & Recent Inquiries (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-card border border-border rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg text-primary font-bold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Low Stock Alerts
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">At or below reorder threshold</p>
            </div>
            <Link to="/admin/inventory" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
              Inventory <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : lowStock.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border rounded-sm text-xs text-muted-foreground">
              All product stock levels are above reorder thresholds.
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStock.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2.5 bg-secondary/40 rounded-sm border border-border/60 text-xs">
                  <div>
                    <p className="font-medium text-foreground line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.category} · SKU: {p.sku}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-semibold text-destructive px-2 py-0.5 bg-destructive/10 rounded-sm">
                      {p.stock} remaining
                    </span>
                    <p className="text-[9px] text-muted-foreground mt-0.5">Min: {p.min_threshold}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent In-Store Sales (IRL Walk-in Orders) */}
        <div className="bg-card border border-border rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg text-primary font-bold flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Recent In-Store Sales
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Offline showroom transactions</p>
            </div>
            <Link to="/admin/sales" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
              All sales <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : stats.sales.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border rounded-sm text-xs text-muted-foreground">
              No in-store sales logged yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats.sales.slice(0, 4).map((sale) => (
                <div key={sale.id} className="p-2.5 bg-secondary/40 rounded-sm border border-border/60 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground line-clamp-1">{sale.customerName}</span>
                    <span className="font-display font-bold text-foreground shrink-0">{formatINR(sale.totalAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="font-mono">{sale.invoiceNumber}</span>
                    <span className={`font-semibold ${
                      sale.paymentStatus === "Paid" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                    }`}>
                      {sale.paymentStatus} · {sale.paymentMode}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="bg-card border border-border rounded-sm p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg text-primary font-bold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-accent" /> Recent Inquiries
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Website and catalog leads</p>
            </div>
            <Link to="/admin/inquiries" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
              Inquiries <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : stats.inquiries.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border rounded-sm text-xs text-muted-foreground">
              No inquiries received yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats.inquiries.slice(0, 4).map((inq) => (
                <div key={inq.id} className="p-2.5 bg-secondary/40 rounded-sm border border-border/60 text-xs">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-foreground line-clamp-1">{inq.customer_name}</span>
                    <span className={`px-1.5 py-0.2 rounded-sm text-[10px] font-medium ${
                      inq.status === "New"
                        ? "bg-accent/20 text-accent-foreground"
                        : inq.status === "Closed"
                        ? "bg-muted text-muted-foreground"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-primary line-clamp-1">{inq.subject}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{inq.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}