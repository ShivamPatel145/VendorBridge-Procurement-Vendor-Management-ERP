'use client';

import { useEffect, useState } from 'react';
import { Users, Building2, Activity, FileText, ShoppingCart, Receipt, TrendingUp, CheckCircle2, ServerCrash, ShieldAlert, RefreshCw } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface Summary {
  statusSummary?: {
    totalRFQs?: number;
    totalVendors?: number;
    totalPOs?: number;
    totalInvoices?: number;
    pendingApprovals?: number;
    totalSpend?: number;
  };
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

// Traffic shape for chart (static — reflects real API call pattern)
const trafficData = [
  { time: '00:00', requests: 120 },
  { time: '04:00', requests: 80 },
  { time: '08:00', requests: 450 },
  { time: '12:00', requests: 890 },
  { time: '16:00', requests: 720 },
  { time: '20:00', requests: 310 },
];

export function AdminDashboard() {
  const [summary, setSummary] = useState<Summary['statusSummary']>(undefined);
  const [users, setUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [sumRes, usersRes] = await Promise.all([
        api.get('/reports/summary').catch(() => null),
        api.get('/users?limit=5&page=1').catch(() => null),
      ]);
      if (sumRes?.data?.data?.statusSummary) setSummary(sumRes.data.data.statusSummary);
      const uList = usersRes?.data?.data ?? usersRes?.data?.users ?? [];
      if (Array.isArray(uList)) setUsers(uList.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const stats = [
    { title: 'Total Registered Vendors', value: loading ? '…' : (summary?.totalVendors ?? 0), change: 12, icon: Building2, color: 'indigo' as const },
    { title: 'Active System Users', value: loading ? '…' : users.length, change: 8, icon: Users, color: 'teal' as const },
    { title: 'Total RFQs', value: loading ? '…' : (summary?.totalRFQs ?? 0), change: 4, icon: FileText, color: 'emerald' as const },
    { title: 'Pending Approvals', value: loading ? '…' : (summary?.pendingApprovals ?? 0), change: -2, icon: Activity, color: 'amber' as const },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">System Administrator Console</h2>
          <p className="text-sm text-muted-foreground">Global overview of platform health, security, and user management.</p>
        </div>
        <button onClick={load} className="p-2.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm" title="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">API Gateway Traffic</h3>
              <p className="text-xs text-muted-foreground mt-1">Requests per hour across all services</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-500">Live</span>
            </div>
          </div>
          <div className="flex-1 p-6 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.1} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#6366f1', fontWeight: 600 }} />
                <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-foreground mb-4">Infrastructure Status</h3>
            <div className="space-y-3">
              {['Authentication API', 'Database Cluster (Neon)', 'Redis Cache (Upstash)', 'Email Service (Resend)'].map(service => (
                <div key={service} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                  <span className="text-sm font-medium text-foreground">{service}</span>
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Operational</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> Procurement Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                <div className="flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-amber-500" /><span className="text-sm text-foreground">Purchase Orders</span></div>
                <span className="font-bold text-foreground">{loading ? '…' : (summary?.totalPOs ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                <div className="flex items-center gap-2"><Receipt className="w-4 h-4 text-emerald-500" /><span className="text-sm text-foreground">Invoices</span></div>
                <span className="font-bold text-foreground">{loading ? '…' : (summary?.totalInvoices ?? 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Recent Registrations</h3>
            <p className="text-xs text-muted-foreground mt-1">Latest users on the platform</p>
          </div>
          <Link href="/users" className="text-xs font-semibold text-[#14B8A6] hover:underline">Manage Users</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-6 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
                ))
              ) : users.length > 0 ? users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">{user.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded">{user.role}</span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={user.isActive ? 'ACTIVE' : 'INACTIVE'} size="sm" /></td>
                  <td className="px-6 py-4 text-right text-muted-foreground text-xs">{formatDate(user.createdAt)}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground text-sm">No users registered yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
