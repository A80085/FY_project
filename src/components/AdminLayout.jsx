import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Package, MessageSquare, Images, Home, ChevronLeft, ChevronRight, Menu, X, Settings as SettingsIcon, LogOut, Users, Truck, FileText
} from "lucide-react";
import { useAuth } from "@/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/inventory", label: "Inventory", icon: Package },
  { to: "/admin/suppliers", label: "Suppliers", icon: Truck },
  { to: "/admin/purchase-orders", label: "Purchase Orders", icon: FileText },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/gallery", label: "Project Gallery", icon: Images },
  { to: "/admin/roles", label: "Roles", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ${
          collapsed ? "w-[68px]" : "w-64"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <Logo className="h-8 w-8" />
            {!collapsed && (
              <span className="font-display font-semibold text-base whitespace-nowrap text-sidebar-foreground">
                Mangalam Studio
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  } ${collapsed ? "justify-center px-2" : ""}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-1">
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-sm text-xs font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent ${
              collapsed ? "justify-center px-2" : ""
            }`}
            title="View Public Store"
          >
            <Home className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Back to Store</span>}
          </Link>
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-xs font-medium text-destructive hover:bg-destructive/10 ${
              collapsed ? "justify-center px-2" : ""
            }`}
            title="Log Out"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-sm hover:bg-secondary text-muted-foreground border border-border"
              aria-label="Toggle Navigation"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="font-display text-lg sm:text-xl font-bold text-primary truncate">
              Management Portal
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="text-right hidden sm:block ml-2">
              <p className="text-xs font-medium text-foreground">{user?.name || "Admin User"}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{user?.role || "Staff"}</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-accent text-accent-foreground grid place-items-center text-xs sm:text-sm font-semibold">
              {user?.name?.[0] || "A"}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileNavOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="md:hidden fixed inset-x-0 top-16 z-50 bg-sidebar text-sidebar-foreground border-b border-sidebar-border p-4 space-y-1 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileNavOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
              <div className="pt-3 border-t border-sidebar-border flex gap-2">
                <Link
                  to="/"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex-1 text-center bg-sidebar-accent text-sidebar-foreground py-2 text-xs font-medium rounded-sm flex items-center justify-center gap-1.5"
                >
                  <Home className="h-3.5 w-3.5" /> Back to Store
                </Link>
                <button
                  onClick={() => { logout(); setMobileNavOpen(false); }}
                  className="flex-1 text-center bg-destructive text-destructive-foreground py-2 text-xs font-medium rounded-sm flex items-center justify-center gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </button>
              </div>
            </div>
          </>
        )}

        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto bg-secondary/30 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
