'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, TrendingUp, AlertTriangle, FileText, RefreshCw } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import { formatCurrency } from '@/lib/utils';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import Link from 'next/link';
import { api } from '@/lib/api';
import StatusBadge from '@/components/shared/StatusBadge';

interface Approval {
  id: string;
  status: string;
  createdAt: string;
  quotation?: { rfq?: { title?: string }; totalAmount?: number };
}

interface Summary {
  totalPOs?: number;
  pendingApprovals?: number;
  totalSpend?: number;
  totalRFQs?: number;
}

export function ManagerDashboard() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [summary, setSummary] = useState<Summary>({});
  const [spendData, setSpendData] = useState<{ name: string; spend: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [apprRes, sumRes] = await Promise.all([
        api.get('/approvals?limit=3&status=PENDING').catch(() => null),
        api.get('/reports/summary').catch(() => null),
      ]);
      const apprList = apprRes?.data?.data ?? apprRes?.data?.approvals ?? [];
      if (Array.isArray(apprList)) setApprovals(apprList.slice(0, 3));
      const s = sumRes?.data?.data;
      if (s?.statusSummary) setSummary(s.statusSummary);
      if (Array.isArray(s?.spendByVendor) && s.spendByVendor.length > 0) {
        setSpendData(s.spendByVendor.slice(0, 6).map((v: any, i: number) => ({
          name: v.vendorName ?? `Vendor ${i + 1}`,
          spend: Number(v.totalSpend ?? 0),
        })));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const chartData = spendData.length > 0 ? spendData : [
    { name: 'Jan', spend: 0 }, { name: 'Feb', spend: 0 }, { name: 'Mar', spend: 0 },
  ];

  const stats = [
    { title: 'Total Spend (YTD)', value: loading ? '…' : formatCurrency(summary.totalSpend ?? 0), change: 8, icon: TrendingUp, color: 'indigo' as const },
    { title: 'Pending Approvals', value: loading ? '…' : (summary.pendingApprovals ?? 0), change: 0, icon: CheckCircle2, color: 'amber' as const },
    { title: 'Total RFQs', value: loading ? '…' : (summary.totalRFQs ?? 0), change: -1, icon: AlertTriangle, color: 'emerald' as const },
    { title: 'Purchase Orders', value: loading ? '…' : (summary.totalPOs ?? 0), change: 2, icon: FileText, color: 'teal' as const },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Executive Dashboard</h2>
          <p className="text-sm text-muted-foreground">Monitor procurement spend, budget adherence, and approve requests.</p>
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
              <h3 className="font-semibold text-foreground">Procurement Spend by Vendor</h3>
              <p className="text-xs text-muted-foreground mt-1">Live data from database</p>
            </div>
            <Link href="/reports" className="text-xs font-semibold text-foreground border border-border px-3 py-1.5 rounded bg-background hover:bg-muted transition-colors">
              Full Report
            </Link>
          </div>
          <div className="flex-1 p-6 min-h-[280px]">
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
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#14B8A6', fontWeight: 600 }} formatter={(value: number) => [formatCurrency(value), 'Spend']} />
                <Area type="monotone" dataKey="spend" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Action Required</h3>
              <p className="text-xs text-muted-foreground mt-1">Pending approvals from DB</p>
            </div>
            <Link href="/approvals" className="text-[#14B8A6] text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 border border-border rounded-lg"><div className="h-4 bg-muted rounded animate-pulse" /></div>
              ))
            ) : approvals.length > 0 ? approvals.map((a) => (
              <div key={a.id} className="p-4 border border-border rounded-lg bg-background hover:border-amber-500/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Approval Request</span>
                  <StatusBadge status={a.status} size="sm" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">{a.quotation?.rfq?.title ?? 'Procurement Request'}</p>
                <p className="text-xs text-muted-foreground mb-3">{formatCurrency(Number(a.quotation?.totalAmount ?? 0))}</p>
                <Link href={`/approvals/${a.id}`} className="block w-full text-center bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 py-2 rounded-md text-xs font-bold hover:bg-amber-100 transition-colors">
                  Review Request
                </Link>
              </div>
            )) : (
              <div className="p-6 text-center text-muted-foreground text-sm">No pending approvals. ✅</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
