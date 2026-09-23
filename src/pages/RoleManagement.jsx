import React, { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { useAuth } from "@/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Role Management</h1>
      <p className="text-muted-foreground text-sm">Assign administrative or staff roles to users. Note: You cannot downgrade your own role.</p>

      {loading ? (
        <div className="text-muted-foreground">Loading users...</div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-muted-foreground">
                <tr className="text-left border-b border-border">
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Current Role</th>
                  <th className="p-3 font-medium">Change Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
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
                      {currentUser?.id === u.id ? (
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
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!users.length && <p className="p-6 text-center text-sm text-muted-foreground">No users found.</p>}
        </div>
      )}
    </div>
  );
}
