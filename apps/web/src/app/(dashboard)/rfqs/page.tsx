'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, FileText, ArrowRight, RefreshCw } from 'lucide-react';
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

export default function RFQsPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRFQs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await rfqAPI.list();
      const data = res.data?.data ?? res.data;
      const list = Array.isArray(data) ? data : data?.rfqs ?? [];
      setRfqs(list);
    } catch (error) {
      console.error('Failed to fetch RFQs:', error);
      setRfqs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRFQs(); }, [fetchRFQs]);

  const filtered = rfqs.filter(r =>
    (r.title ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.rfqNumber ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Request for Quotations</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage procurement events and vendor invitations.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchRFQs} className="p-2.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link href="/rfqs/new" className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> New RFQ
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search RFQs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all shadow-sm" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-sm shrink-0">
          <Filter className="w-4 h-4 text-muted-foreground" /> Filters
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">RFQ</th>
                <th className="px-6 py-4">Created By</th>
                <th className="px-6 py-4 text-center">Quotes</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
              )) : filtered.map((rfq) => (
                <tr key={rfq.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[#14B8A6]" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{rfq.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">{rfq.rfqNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">{rfq.createdBy?.name ?? '—'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-bold text-foreground">
                      {rfq._count?.quotations ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{rfq.deadline ? formatDate(rfq.deadline) : '—'}</td>
                  <td className="px-6 py-4"><StatusBadge status={rfq.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/rfqs/${rfq.id}`} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-[#14B8A6] hover:border-[#14B8A6]/40 transition-colors">
                        View <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No RFQs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
