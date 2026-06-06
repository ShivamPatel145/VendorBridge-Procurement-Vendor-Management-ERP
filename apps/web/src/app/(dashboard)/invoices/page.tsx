'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, Receipt, Download, Eye, RefreshCw } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { invoiceAPI } from '@/lib/api';
import { generatePDFById } from '@/lib/generatePDF';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Invoice {
  id: string;
  invoiceNumber?: string;
  totalAmount?: number;
  status: string;
  createdAt: string;
  po?: {
    quotation?: {
      vendor?: {
        companyName?: string;
      };
    };
  };
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await invoiceAPI.list();
      const data = res.data?.data ?? res.data;
      const list = Array.isArray(data) ? data : data?.invoices ?? [];
      setInvoices(list);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const filtered = invoices.filter(i =>
    (i.invoiceNumber ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.po?.quotation?.vendor?.companyName ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (inv: Invoice) => {
    // Navigate to detail page; user clicks 'Download PDF' there (uses html2pdf)
    router.push(`/invoices/${inv.id}`);
    toast.info('Opening invoice for PDF download…');
  };

  const handleResend = () => {
    toast.success('Invoice resent to vendor via email.');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Invoices</h2>
          <p className="text-sm text-muted-foreground mt-1">Track and manage all procurement invoices.</p>
        </div>
        <button onClick={fetchInvoices} className="p-2.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm" title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search invoices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
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
                <th className="px-6 py-4">Invoice No</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
              )) : filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Receipt className="w-5 h-5 text-emerald-500" />
                      </div>
                      <span className="font-bold text-foreground font-mono">{inv.invoiceNumber ?? inv.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">{inv.po?.quotation?.vendor?.companyName ?? '—'}</td>
                  <td className="px-6 py-4 text-right font-bold text-foreground font-mono">{formatCurrency(inv.totalAmount ?? 0)}</td>
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
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No invoices found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
