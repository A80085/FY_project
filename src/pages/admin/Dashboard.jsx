import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Package, AlertTriangle, MessageSquare, TrendingUp, ArrowRight, Boxes, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { productService } from "@/services/productService";
import { inquiryService } from "@/services/inquiryService";
import { galleryService } from "@/services/galleryService";
import { formatINR } from "@/lib/interiorData";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#16a34a', '#d97706', '#dc2626', '#9333ea', '#0891b2'];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: [], inquiries: [], gallery: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productService.list("-created_date", 200).catch(() => []),
      inquiryService.list("-created_date", 200).catch(() => []),
      galleryService.list("-created_date", 60).catch(() => []),
    ]).then(([products, inquiries, gallery]) => {
      setStats({ products, inquiries, gallery });
      setLoading(false);
    });
  }, []);

  const lowStock = stats.products.filter((p) => p.stock <= p.min_threshold);
  const newInquiries = stats.inquiries.filter((i) => i.status === "New");
  const inventoryValue = stats.products.reduce((s, p) => s + (p.price || 0) * (p.stock || 0), 0);

  const cards = [
    { label: "Total Products", value: stats.products.length, icon: Package, to: "/admin/inventory" },
    { label: "Low-stock Items", value: lowStock.length, icon: AlertTriangle, to: "/admin/inventory", warn: lowStock.length > 0 },
    { label: "Pending Inquiries", value: newInquiries.length, icon: MessageSquare, to: "/admin/inquiries", highlight: newInquiries.length > 0 },
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

  // Mock trend data for inquiries over the week
  const trendData = useMemo(() => {
    return [
      { name: 'Mon', inquiries: 2 },
      { name: 'Tue', inquiries: 5 },
      { name: 'Wed', inquiries: 3 },
      { name: 'Thu', inquiries: Math.max(1, stats.inquiries.length - 10) },
      { name: 'Fri', inquiries: 7 },
      { name: 'Sat', inquiries: Math.max(2, stats.inquiries.length - 2) },
      { name: 'Sun', inquiries: stats.inquiries.length }
    ];
  }, [stats.inquiries]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-primary text-primary-foreground p-6 sm:p-8 rounded-sm shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="eyebrow text-accent mb-2">Showroom Management</p>
          <h1 className="font-display text-3xl sm:text-4xl">Welcome back, {user?.name?.split(" ")[0] || "Admin"}</h1>
          <p className="mt-2 text-primary-foreground/75 text-sm max-w-xl">
            Shree Mangalam Interior Studio live metrics. Track catalog stock levels, process customer inquiries, and update project gallery.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/inventory"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 text-xs font-medium rounded-sm hover:bg-accent/90 transition-colors shadow-sm"
          >
            <Package className="h-4 w-4" /> Manage Inventory
          </Link>
          <Link
            to="/admin/inquiries"
            className="inline-flex items-center gap-2 border border-primary-foreground/30 px-4 py-2.5 text-xs font-medium rounded-sm hover:bg-primary-foreground/10 transition-colors"
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
          ) : categoryData.length === 0 ? (
            <div className="h-[250px] grid place-items-center border border-dashed border-border text-muted-foreground text-sm rounded-sm">No data</div>
          ) : (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: "hsl(var(--secondary))" }}
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "4px", fontSize: "12px" }} 
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
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
            <p className="text-xs text-muted-foreground mt-0.5">Customer leads over the last 7 days (Simulated)</p>
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

      {/* Grid: Low Stock Alert & Recent Inquiries */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Low Stock Alerts */}
        <div className="bg-card border border-border rounded-sm p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl text-primary font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" /> Low Stock Alerts
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Products at or below reorder threshold</p>
            </div>
            <Link to="/admin/inventory" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
              View inventory <ArrowRight className="h-3.5 w-3.5" />
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
            <div className="space-y-3">
              {lowStock.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-secondary/40 rounded-sm border border-border/60 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category} · SKU: {p.sku}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-destructive px-2 py-0.5 bg-destructive/10 rounded-sm">
                      {p.stock} remaining
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Threshold: {p.min_threshold}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="bg-card border border-border rounded-sm p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl text-primary font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-accent" /> Recent Inquiries
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Submissions from website and showroom</p>
            </div>
            <Link to="/admin/inquiries" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
              All inquiries <ArrowRight className="h-3.5 w-3.5" />
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
            <div className="space-y-3">
              {stats.inquiries.slice(0, 5).map((inq) => (
                <div key={inq.id} className="p-3 bg-secondary/40 rounded-sm border border-border/60">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-foreground">{inq.customer_name}</span>
                    <span className={`px-2 py-0.5 rounded-sm font-medium ${
                      inq.status === "New"
                        ? "bg-accent/20 text-accent-foreground"
                        : inq.status === "Closed"
                        ? "bg-muted text-muted-foreground"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-primary">{inq.subject}</p>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{inq.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}