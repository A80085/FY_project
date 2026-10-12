import React, { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { useAuth } from "@/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await userService.getAllUsers().catch(() => []);
    setUsers(data);
    setLoading(false);
  }

  async function updateRole(uid, newRole) {
    try {
      await userService.updateUserRole(uid, newRole);
      setUsers(users.map(u => u.id === uid ? { ...u, role: newRole } : u));
      toast({ title: "Role updated successfully" });
    } catch (_err) {
      toast({ title: "Error", description: "Failed to update role.", variant: "destructive" });
    }
  }

  async function resolveRequest(uid, approved, requestedRole) {
    try {
      await userService.resolveRoleRequest(uid, approved, requestedRole);
      setUsers(users.map(u => {
        if (u.id === uid) {
          const updatedUser = { ...u };
          delete updatedUser.requestedRole;
          if (approved && requestedRole) {
            updatedUser.role = requestedRole;
          }
          return updatedUser;
        }
        return u;
      }));
      toast({ title: approved ? "Request approved" : "Request denied" });
    } catch (_err) {
      toast({ title: "Error", description: "Failed to resolve request.", variant: "destructive" });
    }
  }

  const pendingUsers = users.filter(u => u.requestedRole);
  const teamUsers = users.filter(u => ['admin', 'manager', 'staff'].includes(u.role) && !u.requestedRole);
  const customerUsers = users.filter(u => u.role === 'customer' && !u.requestedRole);

  const displayedUsers = activeTab === "pending" ? pendingUsers : activeTab === "team" ? teamUsers : customerUsers;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-display text-primary">Role Management</h1>
        <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">Approve role requests and manage staff assignments. Note: You cannot downgrade your own role.</p>
      </div>

      <div className="flex items-center space-x-1 border-b border-border overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 shrink-0 transition-colors ${activeTab === "pending" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Pending Requests {pendingUsers.length > 0 && <span className="ml-1.5 bg-accent text-accent-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">{pendingUsers.length}</span>}
        </button>
        <button
          onClick={() => setActiveTab("team")}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 shrink-0 transition-colors ${activeTab === "team" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Staff & Admins ({teamUsers.length})
        </button>
        <button
          onClick={() => setActiveTab("customers")}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 shrink-0 transition-colors ${activeTab === "customers" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Customers ({customerUsers.length})
        </button>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm p-4 space-y-4">
          <div className="flex gap-4 border-b border-border pb-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/5" />
            <Skeleton className="h-4 w-1/5" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 items-center">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-sm" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-secondary/60 text-muted-foreground">
                <tr className="text-left border-b border-border text-xs uppercase tracking-wider font-semibold">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((u) => (
                  <tr key={u.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                    <td className="p-3 font-semibold text-foreground">{u.name || 'Unknown'}</td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 text-xs rounded-sm uppercase tracking-wide font-semibold border
                        ${u.role === 'admin' ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30' : 
                          u.role === 'manager' ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30' :
                          u.role === 'staff' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' :
                          'bg-secondary text-muted-foreground border-border'
                        }`}>
                        {u.role || 'customer'}
                      </span>
                    </td>
                    <td className="p-3">
                      {activeTab === "pending" ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground mr-1">Requested: <strong className="text-foreground capitalize">{u.requestedRole}</strong></span>
                          <button onClick={() => resolveRequest(u.id, true, u.requestedRole)} className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm">Approve</button>
                          <button onClick={() => resolveRequest(u.id, false, null)} className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-sm border border-border hover:bg-muted transition-colors">Deny</button>
                        </div>
                      ) : (
                        currentUser?.id === u.id ? (
                          <span className="px-2.5 py-0.5 text-xs rounded-sm bg-secondary text-muted-foreground font-semibold border border-border">You</span>
                        ) : (
                          <select 
                            value={u.role || "customer"}
                            onChange={(e) => updateRole(u.id, e.target.value)}
                            className="bg-card border border-border rounded px-2.5 py-1 text-xs sm:text-sm font-medium focus:outline-none focus:border-accent"
                          >
                            <option value="customer">Customer</option>
                            <option value="staff">Staff</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!displayedUsers.length && <p className="p-6 text-center text-sm text-muted-foreground">No users in this category.</p>}
        </div>
      )}
    </div>
  );
}
