'use client';

import { useState } from 'react';
import { Search, Filter, Shield, MoreHorizontal, UserPlus, Mail } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';

const MOCK_USERS = [
  { id: 'usr-01', name: 'Admin User', email: 'admin@vendorbridge.com', role: 'ADMIN', status: 'ACTIVE', lastLogin: '2 mins ago' },
  { id: 'usr-02', name: 'Sarah Jenkins', email: 's.jenkins@vendorbridge.com', role: 'PROCUREMENT', status: 'ACTIVE', lastLogin: '1 hour ago' },
  { id: 'usr-03', name: 'Michael Chen', email: 'm.chen@vendorbridge.com', role: 'MANAGER', status: 'ACTIVE', lastLogin: '4 hours ago' },
  { id: 'usr-04', name: 'Acme Corp Contact', email: 'jane@acmecorp.com', role: 'VENDOR', status: 'ACTIVE', lastLogin: '1 day ago' },
  { id: 'usr-05', name: 'David Smith', email: 'd.smith@vendorbridge.com', role: 'PROCUREMENT', status: 'SUSPENDED', lastLogin: '2 weeks ago' },
  { id: 'usr-06', name: 'GlobalTech Onboarding', email: 'sales@globaltech.io', role: 'VENDOR', status: 'PENDING', lastLogin: 'Never' },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Users & Roles</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage system access, RBAC, and active sessions.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm">
          <UserPlus className="w-4 h-4" /> Invite User
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-sm shrink-0">
          <Filter className="w-4 h-4 text-muted-foreground" /> Roles
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">System Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 font-bold text-indigo-500">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{user.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-500/10 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-xs font-semibold text-foreground border border-border px-3 py-1.5 rounded bg-background hover:bg-muted transition-colors">
                        Edit Role
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
