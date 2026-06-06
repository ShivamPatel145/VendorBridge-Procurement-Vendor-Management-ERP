'use client';

import { ShoppingCart, Download, Eye, CheckCircle2 } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

const MOCK_POS = [
  { id: 'PO-2025-081', org: 'GlobalTech Ltd', amount: 450000, issueDate: '2025-06-02', status: 'SENT' },
  { id: 'PO-2025-045', org: 'Acme Corp', amount: 85000, issueDate: '2025-05-15', status: 'APPROVED' },
  { id: 'PO-2025-012', org: 'Stark Industries', amount: 1200000, issueDate: '2025-04-10', status: 'CLOSED' },
];

export default function VendorPOsPage() {
  
  const handleAcknowledge = () => {
    toast.success('Purchase Order has been acknowledged.');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">My Purchase Orders</h2>
          <p className="text-sm text-muted-foreground mt-1">Contracts awarded to your organization.</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">PO Number</th>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_POS.map((po) => (
                <tr key={po.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                        <ShoppingCart className="w-5 h-5 text-amber-500" />
                      </div>
                      <span className="font-bold text-foreground font-mono">{po.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {po.org}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-foreground font-mono">
                    {formatCurrency(po.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-muted-foreground">{formatDate(po.issueDate)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={po.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {po.status === 'SENT' ? (
                        <button 
                          onClick={handleAcknowledge}
                          className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold px-3 py-1.5 rounded text-xs transition-colors shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledge
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            toast.success('Downloading Purchase Order PDF...');
                            setTimeout(() => window.print(), 500);
                          }}
                          className="p-2 text-muted-foreground hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 rounded-md transition-colors" 
                          title="Download PO PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <Link 
                        href={`/purchase-orders/${po.id}`}
                        className="p-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors inline-block" 
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
