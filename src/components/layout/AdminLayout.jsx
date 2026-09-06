import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, MessageSquare, Images, Home, ChevronLeft, ChevronRight, Menu, X, Settings as SettingsIcon, LogOut, Shield
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/inventory", label: "Inventory", icon: Package },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/gallery", label: "Project Gallery", icon: Images },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
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
            <div className="h-8 w-8 rounded-sm bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center font-display font-bold text-base shrink-0">
              M
            </div>
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
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-sm hover:bg-secondary text-muted-foreground"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="font-display text-xl font-bold text-primary">
              Management Portal
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="text-right hidden sm:block ml-2">
              <p className="text-xs font-medium text-foreground">{user?.name || "Admin User"}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Showroom Manager</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-accent text-accent-foreground grid place-items-center text-sm font-semibold">
              {user?.name?.[0] || "A"}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="md:hidden bg-sidebar text-sidebar-foreground border-b border-sidebar-border p-4 space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <div className="pt-2 border-t border-sidebar-border flex gap-2">
              <Link to="/" className="flex-1 text-center bg-secondary text-secondary-foreground py-2 text-xs rounded-sm">
                View Store
              </Link>
              <button onClick={logout} className="flex-1 text-center bg-destructive text-destructive-foreground py-2 text-xs rounded-sm">
                Logout
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-secondary/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
