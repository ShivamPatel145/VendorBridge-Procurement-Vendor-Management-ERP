'use client';

import { Receipt, Download, Eye, Plus } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

const MOCK_INVOICES = [
  { id: 'INV-2025-001', poRef: 'PO-2025-081', amount: 450000, date: '2025-06-25', status: 'PAID' },
  { id: 'INV-2025-002', poRef: 'PO-2025-045', amount: 85000, date: '2025-06-10', status: 'PENDING' },
];

export default function VendorInvoicesPage() {

  const handleUpload = () => {
    toast.success('Invoice uploaded successfully and sent to the buyer for approval.');
  };

  const handleDownload = () => {
    toast.success('Preparing Invoice PDF...');
    setTimeout(() => window.print(), 500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">My Invoices</h2>
          <p className="text-sm text-muted-foreground mt-1">Track payments and submit new invoices.</p>
        </div>
        <button 
          onClick={handleUpload}
          className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Upload Invoice
        </button>
      </div>

      {/* List */}
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
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Receipt className="w-5 h-5 text-emerald-500" />
                      </div>
                      <span className="font-bold text-foreground font-mono">{inv.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-muted-foreground font-mono">{inv.poRef}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-foreground font-mono">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-muted-foreground">{formatDate(inv.date)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={handleDownload}
                        className="p-2 text-muted-foreground hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 rounded-md transition-colors" 
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <Link 
                        href={`/invoices/${inv.id}`}
                        className="p-2 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors inline-block" 
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
