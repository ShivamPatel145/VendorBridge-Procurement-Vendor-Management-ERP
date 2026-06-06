'use client';

import { CheckCircle2, TrendingUp, AlertTriangle, FileText } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import { formatCurrency } from '@/lib/utils';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import Link from 'next/link';

const stats = [
  { title: 'Total Spend (YTD)', value: formatCurrency(1284000), change: 8, icon: TrendingUp, color: 'indigo' as const },
  { title: 'Pending Approvals', value: 12, change: 0, icon: CheckCircle2, color: 'amber' as const },
  { title: 'Budget Variance', value: '-2.4%', change: -1, icon: AlertTriangle, color: 'emerald' as const },
  { title: 'Active Contracts', value: 34, change: 2, icon: FileText, color: 'teal' as const },
];

const chartData = [
  { name: 'Jan', spend: 120000 },
  { name: 'Feb', spend: 150000 },
  { name: 'Mar', spend: 110000 },
  { name: 'Apr', spend: 180000 },
  { name: 'May', spend: 220000 },
  { name: 'Jun', spend: 284000 },
];

export function ManagerDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Executive Dashboard</h2>
        <p className="text-sm text-muted-foreground">Monitor procurement spend, budget adherence, and approve requests.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Procurement Spend Trend</h3>
              <p className="text-xs text-muted-foreground mt-1">Monthly aggregate spend over 6 months</p>
            </div>
            <button className="text-xs font-semibold text-foreground border border-border px-3 py-1.5 rounded bg-background hover:bg-muted transition-colors">
              Download Report
            </button>
          </div>
          <div className="flex-1 p-6 min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px', color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: '#14B8A6', fontWeight: 600 }}
                  formatter={(value: number) => [formatCurrency(value), 'Spend']}
                />
                <Area type="monotone" dataKey="spend" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Approval Queue */}
        <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Action Required</h3>
              <p className="text-xs text-muted-foreground mt-1">Pending items needing review</p>
            </div>
            <Link href="/approvals" className="text-[#14B8A6] text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {[1, 2, 3].map((i) => (
               <div key={i} className="p-4 border border-border rounded-lg bg-background hover:border-amber-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Approval Request</span>
                    <span className="text-xs text-muted-foreground">2 hrs ago</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">PO-2025-00{i} for IT Equipment</p>
                  <p className="text-xs text-muted-foreground mb-4">Submitted by Procurement Officer</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 py-2 rounded-md text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">Review Request</button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
