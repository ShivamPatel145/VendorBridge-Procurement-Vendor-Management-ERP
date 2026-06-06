'use client';

import { Users, Building2, Activity, HardDrive, ShieldAlert, ServerCrash, CheckCircle2 } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const stats = [
  { title: 'Total Registered Vendors', value: 248, change: 12, icon: Building2, color: 'indigo' as const },
  { title: 'Active System Users', value: 1240, change: 8, icon: Users, color: 'teal' as const },
  { title: 'System Uptime (30d)', value: '99.99%', change: 0.01, icon: Activity, color: 'emerald' as const },
  { title: 'Database Storage Used', value: '45.2 GB', change: 5, icon: HardDrive, color: 'amber' as const },
];

const trafficData = [
  { time: '00:00', requests: 1200 },
  { time: '04:00', requests: 800 },
  { time: '08:00', requests: 4500 },
  { time: '12:00', requests: 8900 },
  { time: '16:00', requests: 7200 },
  { time: '20:00', requests: 3100 },
];

const recentSignups = [
  { id: '1', name: 'Acme Corp', role: 'VENDOR', status: 'ACTIVE', time: '2 mins ago', email: 'admin@acmecorp.com' },
  { id: '2', name: 'GlobalTech Ltd', role: 'VENDOR', status: 'PENDING', time: '1 hour ago', email: 'onboarding@globaltech.io' },
  { id: '3', name: 'Sarah Jenkins', role: 'PROCUREMENT', status: 'ACTIVE', time: '3 hours ago', email: 's.jenkins@vendorbridge.com' },
  { id: '4', name: 'Michael Chen', role: 'MANAGER', status: 'ACTIVE', time: '1 day ago', email: 'm.chen@vendorbridge.com' },
];

const systemAlerts = [
  { id: 1, message: 'High memory usage on Node-03', severity: 'warning', time: '10 mins ago', icon: ServerCrash },
  { id: 2, message: 'Failed login attempts from IP 192.168.1.5', severity: 'critical', time: '1 hour ago', icon: ShieldAlert },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">System Administrator Console</h2>
        <p className="text-sm text-muted-foreground">Global overview of platform health, security, and user management.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* API Traffic Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">API Gateway Traffic</h3>
              <p className="text-xs text-muted-foreground mt-1">Requests per hour across all microservices</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-500">Live</span>
            </div>
          </div>
          <div className="flex-1 p-6 min-h-[300px]">
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
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#6366f1', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health & Alerts */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col p-6">
            <h3 className="font-semibold text-foreground mb-4">Infrastructure Status</h3>
            <div className="space-y-3">
              {['Authentication API', 'Database Cluster (Primary)', 'File Storage (S3)', 'Email Service'].map(service => (
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

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> Active Alerts
            </h3>
            <div className="space-y-3">
              {systemAlerts.map(alert => (
                <div key={alert.id} className="flex gap-3 p-3 rounded-lg border border-rose-500/20 bg-rose-500/5">
                  <alert.icon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* User Management Quick View */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Recent Registrations</h3>
            <p className="text-xs text-muted-foreground mt-1">Latest users boarded onto the platform</p>
          </div>
          <button className="text-xs font-semibold text-foreground border border-border px-3 py-1.5 rounded bg-background hover:bg-muted transition-colors">
            Manage Users
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3">User / Entity</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Assigned Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentSignups.map((user) => (
                <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">{user.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={user.status} size="sm" /></td>
                  <td className="px-6 py-4 text-right text-muted-foreground text-xs">{user.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
