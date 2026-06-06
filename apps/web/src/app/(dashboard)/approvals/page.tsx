'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, CheckCircle2, Clock, Building2, AlertCircle, Loader2 } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Approval {
  id: string;
  quotationId: string;
  currentStep: number;
  totalSteps: number;
  status: string;
  createdAt: string;
  quotation?: {
    id: string;
    totalAmount: number;
    rfq?: {
      title: string;
    };
    vendor?: {
      companyName: string;
    };
  };
}

export default function ApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApprovals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/approvals/pending');
      const data = response.data?.data || response.data?.approvals || [];
      setApprovals(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Failed to load approvals:', error);
      toast.error(error.response?.data?.message || 'Failed to load approvals');
      setApprovals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  const filtered = approvals.filter(a => {
    const title = a.quotation?.rfq?.title || '';
    const vendor = a.quotation?.vendor?.companyName || '';
    return title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           vendor.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Approval Queue</h2>
          <p className="text-sm text-muted-foreground mt-1">Review and authorize procurement requests from database.</p>
        </div>
        <button 
          onClick={loadApprovals}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#14B8A6] text-white rounded-lg text-sm font-semibold hover:bg-[#109A8B] transition-colors disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Refresh
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by RFQ title or vendor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-sm shrink-0">
          <Filter className="w-4 h-4 text-muted-foreground" /> Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Request Details</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Requested</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-16 bg-muted rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : filtered.length > 0 ? filtered.map((app) => (
                <tr key={app.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <Link href={`/approvals/${app.id}`} className="font-bold text-foreground hover:text-[#14B8A6] transition-colors flex items-center gap-2">
                          {app.quotation?.rfq?.title || 'Untitled Request'}
                          {app.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Building2 className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{app.quotation?.vendor?.companyName || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-foreground">{formatCurrency(app.quotation?.totalAmount || 0)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">{formatDate(app.createdAt)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Step {app.currentStep} of {app.totalSteps}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {app.status === 'PENDING' ? (
                      <Link 
                        href={`/approvals/${app.id}`}
                        className="inline-block px-4 py-2 text-xs font-bold bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20 rounded-md hover:bg-[#14B8A6]/20 transition-colors"
                      >
                        Review Request
                      </Link>
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground">Processed</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    {searchTerm ? 'No approval requests found matching your search.' : 'No pending approval requests. All caught up! 🎉'}
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
