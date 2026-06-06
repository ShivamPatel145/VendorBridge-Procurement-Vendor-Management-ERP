'use client';

import { useEffect, useState } from 'react';
import { FileText, Users, ShoppingCart, TrendingUp, RefreshCw } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { api } from '@/lib/api';

interface RFQ {
  id: string;
  title: string;
  status: string;
  deadline: string;
  _count?: { quotations: number };
}

interface Summary {
  totalRFQs?: number;
  totalVendors?: number;
  totalPOs?: number;
  pendingApprovals?: number;
  totalSpend?: number;
}

export function ProcurementDashboard() {
  const [rfqs, setRFQs] = useState<RFQ[]>([]);
  const [summary, setSummary] = useState<Summary>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [rfqRes, sumRes] = await Promise.all([
        api.get('/rfqs?limit=5&page=1').catch(() => null),
        api.get('/reports/summary').catch(() => null),
      ]);
      const rfqList = rfqRes?.data?.data ?? rfqRes?.data?.rfqs ?? [];
      if (Array.isArray(rfqList)) setRFQs(rfqList.slice(0, 3));
      if (sumRes?.data?.data?.statusSummary) setSummary(sumRes.data.data.statusSummary);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const stats = [
    { title: 'Active RFQs', value: loading ? '…' : (summary.totalRFQs ?? 0), change: 4, icon: FileText, color: 'indigo' as const },
    { title: 'Registered Vendors', value: loading ? '…' : (summary.totalVendors ?? 0), change: 2, icon: Users, color: 'teal' as const },
    { title: 'POs Issued', value: loading ? '…' : (summary.totalPOs ?? 0), change: -2, icon: ShoppingCart, color: 'amber' as const },
    { title: 'Pending Approvals', value: loading ? '…' : (summary.pendingApprovals ?? 0), change: 12, icon: TrendingUp, color: 'emerald' as const },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Procurement Desk</h2>
          <p className="text-sm text-muted-foreground">Manage your sourcing pipeline and active requests.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="p-2.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link href="/rfqs/new" className="bg-[#14B8A6] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#109A8B] transition-colors flex items-center">
            Create RFQ
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Active RFQs</h3>
              <p className="text-xs text-muted-foreground mt-1">Live from database</p>
            </div>
            <Link href="/rfqs" className="text-[#14B8A6] text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-5"><div className="h-4 bg-muted rounded animate-pulse" /></div>
              ))
            ) : rfqs.length > 0 ? rfqs.map((rfq) => (
              <div key={rfq.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-muted/30 transition-colors gap-4">
                <div>
                  <p className="text-foreground text-sm font-medium">{rfq.title}</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {rfq._count?.quotations ?? 0} bids · Closes {rfq.deadline ? formatDate(rfq.deadline) : '—'}
                  </p>
                </div>
                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <StatusBadge status={rfq.status} size="sm" />
                  <Link href={`/rfqs/${rfq.id}`} className="text-xs font-semibold text-foreground border border-border px-3 py-1.5 rounded bg-background hover:bg-muted transition-colors">
                    Manage
                  </Link>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No RFQs yet. <Link href="/rfqs/new" className="text-[#14B8A6] font-semibold hover:underline">Create your first RFQ →</Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col p-6">
          <h3 className="font-semibold text-foreground mb-1">Quick Links</h3>
          <p className="text-xs text-muted-foreground mb-6">Jump to key procurement modules</p>
          <div className="space-y-3">
            {[
              { href: '/rfqs', label: 'Open RFQs', color: 'indigo' },
              { href: '/quotations', label: 'Review Quotations', color: 'teal' },
              { href: '/approvals', label: 'Pending Approvals', color: 'amber' },
              { href: '/purchase-orders', label: 'Purchase Orders', color: 'emerald' },
              { href: '/invoices', label: 'Invoices', color: 'rose' },
            ].map(({ href, label, color }) => (
              <Link key={href} href={href as any} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-[#14B8A6]/40 hover:bg-[#14B8A6]/5 transition-all group">
                <span className="text-sm font-medium text-foreground group-hover:text-[#14B8A6] transition-colors">{label}</span>
                <span className="text-muted-foreground group-hover:text-[#14B8A6] text-xs">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
