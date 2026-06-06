'use client';

import { MessageSquareQuote, Download, Eye } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';

const MOCK_QUOTATIONS = [
  { id: 'QT-2025-081', rfqRef: 'RFQ-2025-008', title: 'Office Furniture Procurement Q2', amount: 200010, submittedOn: '2025-06-05', status: 'EVALUATING' },
  { id: 'QT-2025-075', rfqRef: 'RFQ-2025-012', title: 'IT Hardware Refresh', amount: 450000, submittedOn: '2025-06-01', status: 'ACCEPTED' },
  { id: 'QT-2025-062', rfqRef: 'RFQ-2025-015', title: 'Janitorial Services 2025', amount: 120000, submittedOn: '2025-05-20', status: 'REJECTED' },
];

export default function VendorQuotationsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">My Quotations</h2>
          <p className="text-sm text-muted-foreground mt-1">Track the status of your submitted bids.</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Quote Ref</th>
                <th className="px-6 py-4">RFQ Title</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
                <th className="px-6 py-4">Submitted Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_QUOTATIONS.map((quote) => (
                <tr key={quote.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <MessageSquareQuote className="w-5 h-5 text-indigo-500" />
                      </div>
                      <span className="font-bold text-foreground font-mono">{quote.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">{quote.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">Ref: {quote.rfqRef}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-foreground font-mono">
                    {formatCurrency(quote.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-muted-foreground">{formatDate(quote.submittedOn)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={quote.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => toast.success('Quotation document is being loaded...')}
                        className="p-2 text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10 rounded-md transition-colors" 
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          toast.success('Downloading Quotation PDF...');
                          setTimeout(() => window.print(), 500);
                        }}
                        className="p-2 text-muted-foreground hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 rounded-md transition-colors" 
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
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
