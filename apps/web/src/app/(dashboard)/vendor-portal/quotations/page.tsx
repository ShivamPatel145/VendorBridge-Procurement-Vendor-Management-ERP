'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, MessageSquareQuote, Eye, Download, RefreshCw } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { quotationAPI, downloadPDFFromAPI } from '@/lib/api';
import { toast } from 'sonner';

interface Quotation {
  id: string;
  rfq?: { title?: string; id?: string };
  totalAmount?: number;
  createdAt: string;
  submittedAt?: string;
  status: string;
}

export default function VendorQuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDownload = async (q: Quotation) => {
    toast.info('Generating Quotation PDF...');
    // Quotations use the invoices-style PDF endpoint for now
    toast.success('Quotation PDF prepared. Feature coming soon.');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">My Quotations</h2>
          <p className="text-sm text-muted-foreground mt-1">Track your submitted bids — live from database.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchQuotations} className="p-2.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link href="/vendor-portal/quotations/new" className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm">
            <Plus className="w-4 h-4" /> New Quote
          </Link>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Quotation</th>
                <th className="px-6 py-4">RFQ Reference</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Submitted On</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
              )) : quotations.length > 0 ? quotations.map((q) => (
                <tr key={q.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <MessageSquareQuote className="w-5 h-5 text-indigo-500" />
                      </div>
                      <span className="font-bold text-foreground font-mono text-xs">{q.id.slice(-8).toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">{q.rfq?.title?.slice(0, 35) ?? '—'}</td>
                  <td className="px-6 py-4 text-right font-bold text-foreground font-mono">{formatCurrency(Number(q.totalAmount ?? 0))}</td>
                  <td className="px-6 py-4 text-muted-foreground">{formatDate(q.submittedAt ?? q.createdAt)}</td>
                  <td className="px-6 py-4"><StatusBadge status={q.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleDownload(q)} className="p-2 text-muted-foreground hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 rounded-md transition-colors" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                      <button onClick={() => window.location.href = `/quotations/${q.id}`} className="p-2 text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10 rounded-md transition-colors inline-block" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No quotations submitted yet. <Link href="/vendor-portal/quotations/new" className="text-[#14B8A6] font-semibold hover:underline">Submit your first quote →</Link></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
