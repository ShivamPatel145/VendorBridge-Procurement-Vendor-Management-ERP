'use client';

import { Building2, FileText, ShoppingCart, Receipt, CheckCircle2 } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

// Mock data
const stats = [
  { title: 'Total Vendors',      value: 48,                    change: 12,  icon: Building2,    color: 'indigo'  as const },
  { title: 'Active RFQs',        value: 7,                     change: -2,  icon: FileText,     color: 'teal'    as const },
  { title: 'Purchase Orders',    value: formatCurrency(284000), change: 8,  icon: ShoppingCart, color: 'emerald' as const },
  { title: 'Pending Approvals',  value: 3,                     change: 0,   icon: CheckCircle2, color: 'amber'   as const },
];

const recentRFQs = [
  { id: '1', title: 'Office Stationery Q3 2025', status: 'PUBLISHED', deadline: '2025-07-15', vendors: 5 },
  { id: '2', title: 'IT Equipment Procurement',  status: 'EVALUATING', deadline: '2025-07-01', vendors: 3 },
  { id: '3', title: 'Cleaning Supplies Annual',  status: 'DRAFT',      deadline: '2025-07-30', vendors: 0 },
];

const recentPOs = [
  { id: '1', poNumber: 'PO-2025-001', vendor: 'Tech Supplies Ltd',    amount: 85000,  status: 'APPROVED' },
  { id: '2', poNumber: 'PO-2025-002', vendor: 'Office World Pvt Ltd', amount: 23500,  status: 'SENT' },
  { id: '3', poNumber: 'PO-2025-003', vendor: 'CleanPro Services',    amount: 12000,  status: 'COMPLETED' },
];

const chartData = [
  { name: 'Jan', spend: 120000 },
  { name: 'Feb', spend: 150000 },
  { name: 'Mar', spend: 110000 },
  { name: 'Apr', spend: 180000 },
  { name: 'May', spend: 220000 },
  { name: 'Jun', spend: 284000 },
];

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Overview</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Track your procurement metrics and recent activities.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">Procurement Spend Trend</h3>
              <p className="text-xs text-zinc-500 mt-1">Monthly aggregate spend over 6 months</p>
            </div>
          </div>
          <div className="flex-1 p-6 min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                  itemStyle={{ color: '#10b981', fontWeight: 600 }}
                  formatter={(value: number) => [formatCurrency(value), 'Spend']}
                />
                <Area type="monotone" dataKey="spend" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Approval Queue */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm flex flex-col">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-white">Action Required</h3>
            <p className="text-xs text-zinc-500 mt-1">Pending items needing your review</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {[1, 2, 3].map((i) => (
               <div key={i} className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Approval Request</span>
                    <span className="text-xs text-zinc-500">2 hrs ago</span>
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white mb-1">PO-2025-00{i} for IT Equipment</p>
                  <p className="text-xs text-zinc-500 mb-3">Submitted by John Doe</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 py-1.5 rounded-md text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">Review</button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Recent RFQs */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-white">Recent RFQs</h3>
            <a href="/rfqs" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium transition-colors">View all &rarr;</a>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {recentRFQs.map((rfq) => (
              <div key={rfq.id} className="flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div>
                  <p className="text-zinc-900 dark:text-white text-sm font-medium">{rfq.title}</p>
                  <p className="text-zinc-500 text-xs mt-1">
                    {rfq.vendors} vendors · Due {formatDate(rfq.deadline)}
                  </p>
                </div>
                <StatusBadge status={rfq.status} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent POs */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-white">Recent Purchase Orders</h3>
            <a href="/purchase-orders" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium transition-colors">View all &rarr;</a>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {recentPOs.map((po) => (
              <div key={po.id} className="flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div>
                  <p className="text-zinc-900 dark:text-white text-sm font-medium">{po.poNumber}</p>
                  <p className="text-zinc-500 text-xs mt-1">{po.vendor}</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-900 dark:text-white text-sm font-semibold">{formatCurrency(po.amount)}</p>
                  <div className="mt-1 flex justify-end">
                     <StatusBadge status={po.status} size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
