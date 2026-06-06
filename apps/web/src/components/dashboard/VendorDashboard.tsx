'use client';

import { useEffect, useState } from 'react';
import { FileText, Inbox, Receipt, Building2, RefreshCw } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { api } from '@/lib/api';

interface RFQ {
  id: string;
  title: string;
  deadline: string;
  createdBy?: { name: string };
}

interface PO {
  id: string;
  poNumber?: string;
  totalAmount?: number;
  status: string;
  createdBy?: { name: string };
}

export function VendorDashboard() {
  const [rfqs, setRFQs] = useState<RFQ[]>([]);
  const [pos, setPOs] = useState<PO[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [rfqRes, poRes] = await Promise.all([
        api.get('/rfqs?status=PUBLISHED&limit=3').catch(() => null),
        api.get('/purchase-orders?limit=3').catch(() => null),
      ]);
      const rfqList = rfqRes?.data?.data ?? rfqRes?.data?.rfqs ?? [];
      if (Array.isArray(rfqList)) setRFQs(rfqList.slice(0, 3));
      const poList = poRes?.data?.data ?? poRes?.data?.pos ?? [];
      if (Array.isArray(poList)) setPOs(poList.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const stats = [
    { title: 'Open Invitations', value: loading ? '…' : rfqs.length, change: 1, icon: Inbox, color: 'indigo' as const },
    { title: 'Active POs', value: loading ? '…' : pos.length, change: 0, icon: Building2, color: 'emerald' as const },
    { title: 'Quotes Submitted', value: loading ? '…' : '—', change: 4, icon: FileText, color: 'teal' as const },
    { title: 'Pending Invoices', value: loading ? '…' : '—', change: -1, icon: Receipt, color: 'amber' as const },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Vendor Portal</h2>
          <p className="text-sm text-muted-foreground">Manage your bids, purchase orders, and invoices.</p>
        </div>
        <button onClick={load} className="p-2.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm" title="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Open RFQ Invitations */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">Open RFQ Invitations</h3>
              <p className="text-xs text-muted-foreground mt-1">Live from database</p>
            </div>
            <Link href="/vendor-portal/rfqs" className="text-[#14B8A6] text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-5"><div className="h-4 bg-muted rounded animate-pulse" /></div>
              ))
            ) : rfqs.length > 0 ? rfqs.map((rfq) => (
              <div key={rfq.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-muted/30 transition-colors gap-4">
                <div>
                  <p className="text-foreground text-sm font-medium">{rfq.title}</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    By <span className="font-semibold">{rfq.createdBy?.name ?? 'Procurement'}</span> · Due {rfq.deadline ? formatDate(rfq.deadline) : '—'}
                  </p>
                </div>
                <Link
                  href="/vendor-portal/quotations/new"
                  className="text-xs font-bold bg-[#14B8A6] text-white px-4 py-2 rounded-lg hover:bg-[#109A8B] transition-colors whitespace-nowrap"
                >
                  Submit Quote
                </Link>
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground text-sm">No open RFQ invitations right now.</div>
            )}
          </div>
        </div>

        {/* Recent POs */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">Recent Purchase Orders</h3>
              <p className="text-xs text-muted-foreground mt-1">POs issued to your organization</p>
            </div>
            <Link href="/vendor-portal/purchase-orders" className="text-[#14B8A6] text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-5"><div className="h-4 bg-muted rounded animate-pulse" /></div>
              ))
            ) : pos.length > 0 ? pos.map((po) => (
              <div key={po.id} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors">
                <div>
                  <p className="text-foreground text-sm font-medium font-mono">{po.poNumber ?? po.id}</p>
                  <p className="text-muted-foreground text-xs mt-1">{po.createdBy?.name ?? 'Organization'}</p>
                </div>
                <div className="text-right">
                  <p className="text-foreground text-sm font-semibold mb-2">{formatCurrency(Number(po.totalAmount ?? 0))}</p>
                  <StatusBadge status={po.status} size="sm" />
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground text-sm">No purchase orders received yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
