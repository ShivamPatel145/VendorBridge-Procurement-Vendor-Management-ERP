'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Receipt, Download, Eye, RefreshCw } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { invoiceAPI } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Invoice {
  id: string;
  invoiceNumber?: string;
  po?: { poNumber?: string };
  totalAmount?: number;
  createdAt: string;
  status: string;
}

export default function VendorInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await invoiceAPI.list();
      const data = res.data?.data ?? res.data;
      const list = Array.isArray(data) ? data : data?.invoices ?? [];
      setInvoices(list);
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const handleDownload = (inv: Invoice) => {
    router.push(`/invoices/${inv.id}`);
    toast.info('Opening invoice for PDF download…');
  };

  const handleUpload = () => {
    toast.info('Invoice upload feature coming soon. Please contact procurement team.');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">My Invoices</h2>
          <p className="text-sm text-muted-foreground mt-1">Track payments and submit new invoices — live from database.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchInvoices} className="p-2.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={handleUpload} className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm">
            <Plus className="w-4 h-4" /> Upload Invoice
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Invoice No</th>
                <th className="px-6 py-4">PO Reference</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Date Submitted</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
              )) : invoices.length > 0 ? invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Receipt className="w-5 h-5 text-emerald-500" />
                      </div>
                      <span className="font-bold text-foreground font-mono">{inv.invoiceNumber ?? inv.id.slice(-8).toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground font-semibold">{inv.po?.poNumber ?? '—'}</td>
                  <td className="px-6 py-4 text-right font-bold text-foreground font-mono">{formatCurrency(Number(inv.totalAmount ?? 0))}</td>
                  <td className="px-6 py-4 text-muted-foreground">{formatDate(inv.createdAt)}</td>
                  <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleDownload(inv)} className="p-2 text-muted-foreground hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 rounded-md transition-colors" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                      <Link href={`/invoices/${inv.id}`} className="p-2 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors inline-block" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No invoices submitted yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
