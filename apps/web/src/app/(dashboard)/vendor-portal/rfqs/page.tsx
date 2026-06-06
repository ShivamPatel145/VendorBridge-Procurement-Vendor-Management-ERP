'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, FileText, ArrowRight, RefreshCw } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils';
import { rfqAPI } from '@/lib/api';

interface RFQ {
  id: string;
  rfqNumber?: string;
  title: string;
  status: string;
  deadline?: string;
  createdAt: string;
  _count?: { quotations: number };
  createdBy?: { name: string };
}

export default function VendorRFQsPage() {
  const [rfqs, setRFQs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRFQs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await rfqAPI.list({ status: 'PUBLISHED' });
      const data = res.data?.data ?? res.data;
      const list = Array.isArray(data) ? data : data?.rfqs ?? [];
      setRFQs(list);
    } catch {
      setRFQs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRFQs(); }, [fetchRFQs]);

  const filtered = rfqs.filter(r =>
    (r.title ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Open RFQ Invitations</h2>
          <p className="text-sm text-muted-foreground mt-1">Live RFQs from the database where you can submit quotations.</p>
        </div>
        <button onClick={fetchRFQs} className="p-2.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm" title="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="Search RFQs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all shadow-sm" />
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">RFQ</th>
                <th className="px-6 py-4">Posted By</th>
                <th className="px-6 py-4 text-center">Bids</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
              )) : filtered.length > 0 ? filtered.map((rfq) => (
                <tr key={rfq.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[#14B8A6]" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{rfq.title}</p>
                        {rfq.rfqNumber && <p className="text-xs text-muted-foreground font-mono mt-0.5">{rfq.rfqNumber}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{rfq.createdBy?.name ?? '—'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-bold text-foreground">
                      {rfq._count?.quotations ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{rfq.deadline ? formatDate(rfq.deadline) : '—'}</td>
                  <td className="px-6 py-4"><StatusBadge status={rfq.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <Link href="/vendor-portal/quotations/new" className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-[#14B8A6] text-white rounded-lg hover:bg-[#109A8B] transition-colors justify-end ml-auto w-fit">
                      Submit Quote <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No open RFQ invitations at this time.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
