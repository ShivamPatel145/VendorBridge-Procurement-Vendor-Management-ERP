'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingCart, Eye, Download, CheckCircle2, RefreshCw } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { purchaseOrderAPI } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface PO {
  id: string;
  poNumber?: string;
  totalAmount?: number;
  status: string;
  createdAt: string;
  createdBy?: { name: string };
}

export default function VendorPurchaseOrdersPage() {
  const [pos, setPOs] = useState<PO[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPOs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await purchaseOrderAPI.list();
      const data = res.data?.data ?? res.data;
      const list = Array.isArray(data) ? data : data?.pos ?? [];
      setPOs(list);
    } catch {
      setPOs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPOs(); }, [fetchPOs]);

  const handleAcknowledge = async (id: string) => {
    try {
      await purchaseOrderAPI.acknowledge(id);
      toast.success('Purchase Order acknowledged successfully!');
      fetchPOs();
    } catch {
      toast.error('Failed to acknowledge. Please try again.');
    }
  };

  const handleDownload = (po: PO) => {
    router.push(`/purchase-orders/${po.id}`);
    toast.info('Opening PO for PDF download…');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">My Purchase Orders</h2>
          <p className="text-sm text-muted-foreground mt-1">POs issued to your organization — live from database.</p>
        </div>
        <button onClick={fetchPOs} className="p-2.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm" title="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">PO Number</th>
                <th className="px-6 py-4">Issued By</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
              )) : pos.length > 0 ? pos.map((po) => (
                <tr key={po.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                        <ShoppingCart className="w-5 h-5 text-amber-500" />
                      </div>
                      <span className="font-bold text-foreground font-mono">{po.poNumber ?? po.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{po.createdBy?.name ?? 'VendorBridge'}</td>
                  <td className="px-6 py-4 text-right font-bold text-foreground font-mono">{formatCurrency(Number(po.totalAmount ?? 0))}</td>
                  <td className="px-6 py-4 text-muted-foreground">{formatDate(po.createdAt)}</td>
                  <td className="px-6 py-4"><StatusBadge status={po.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {po.status === 'SENT' ? (
                        <button onClick={() => handleAcknowledge(po.id)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/30 rounded-lg hover:bg-[#14B8A6]/20 transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledge
                        </button>
                      ) : (
                        <button onClick={() => handleDownload(po)} className="p-2 text-muted-foreground hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 rounded-md transition-colors" title="Download PDF">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <Link href={`/purchase-orders/${po.id}`} className="p-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors inline-block" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No purchase orders received yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
