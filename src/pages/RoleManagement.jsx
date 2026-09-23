import React, { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { useAuth } from "@/AuthContext";
import { useToast } from "@/components/ui/use-toast";

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
    } catch (err) {
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
    } catch (err) {
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
        <h1 className="text-2xl font-bold">Role Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Approve role requests and manage staff assignments. Note: You cannot downgrade your own role.</p>
      </div>

      <div className="flex space-x-1 border-b border-border">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "pending" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Pending Requests {pendingUsers.length > 0 && <span className="ml-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">{pendingUsers.length}</span>}
        </button>
        <button
          onClick={() => setActiveTab("team")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "team" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Staff & Admins ({teamUsers.length})
        </button>
        <button
          onClick={() => setActiveTab("customers")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "customers" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Customers ({customerUsers.length})
        </button>
      </div>

      {loading ? (
        <div className="text-muted-foreground text-sm">Loading users...</div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-muted-foreground">
                <tr className="text-left border-b border-border">
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Role</th>
                  <th className="p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((u) => (
                  <tr key={u.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">{u.name || 'Unknown'}</td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded-full uppercase tracking-wide font-medium
                        ${u.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 
                          u.role === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          u.role === 'staff' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                        }`}>
                        {u.role || 'customer'}
                      </span>
                    </td>
                    <td className="p-3">
                      {activeTab === "pending" ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground mr-2">Requested: <strong className="text-foreground capitalize">{u.requestedRole}</strong></span>
                          <button onClick={() => resolveRequest(u.id, true, u.requestedRole)} className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors">Approve</button>
                          <button onClick={() => resolveRequest(u.id, false, null)} className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-sm border border-border hover:bg-muted transition-colors">Deny</button>
                        </div>
                      ) : (
                        currentUser?.id === u.id ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 font-medium">You</span>
                        ) : (
                          <select 
                            value={u.role || "customer"}
                            onChange={(e) => updateRole(u.id, e.target.value)}
                            className="bg-transparent border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-accent"
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
