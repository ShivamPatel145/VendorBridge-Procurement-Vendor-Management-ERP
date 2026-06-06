'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, MessageSquareQuote, Calendar, ArrowUpRight, Eye, Download, RefreshCw } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { quotationAPI, downloadPDFFromAPI } from '@/lib/api';
import { toast } from 'sonner';

interface Quotation {
  id: string;
  rfqId?: string;
  rfq?: { id: string; title?: string };
  vendor?: { companyName?: string };
  totalAmount?: number;
  createdAt: string;
  submittedAt?: string;
  status: string;
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchQuotations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await quotationAPI.list();
      const data = res.data?.data ?? res.data;
      const list = Array.isArray(data) ? data : data?.quotations ?? [];
      setQuotations(list);
    } catch {
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchQuotations(); }, [fetchQuotations]);

  const filtered = quotations.filter(q =>
    (q.id ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.vendor?.companyName ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.rfq?.title ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Quotations Directory</h2>
          <p className="text-sm text-muted-foreground mt-1">Review individual vendor bids and quotations — live from database.</p>
        </div>
        <button onClick={fetchQuotations} className="p-2.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm" title="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Quotation ID, Vendor, or RFQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all shadow-sm"
          />
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
                <th className="px-6 py-4">Quotation ID</th>
                <th className="px-6 py-4">RFQ Reference</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4 text-right">Bid Amount</th>
                <th className="px-6 py-4">Submitted On</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-6 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.length > 0 ? filtered.map((q) => (
                <tr key={q.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <MessageSquareQuote className="w-5 h-5 text-indigo-500" />
                      </div>
                      <span className="font-bold text-foreground font-mono text-xs">{q.id.slice(-8).toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {q.rfq ? (
                      <Link href={`/rfqs/${q.rfq.id}`} className="font-semibold text-[#14B8A6] hover:underline flex items-center gap-1">
                        {q.rfq.title?.slice(0, 30) ?? q.rfq.id} <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    ) : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground">{q.vendor?.companyName ?? '—'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-foreground font-mono">{formatCurrency(Number(q.totalAmount ?? 0))}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">{formatDate(q.submittedAt ?? q.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={q.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/quotations/${q.id}`} className="p-2 text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10 rounded-md transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    {loading ? 'Loading…' : 'No quotations found. Quotations will appear here once vendors submit bids.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
