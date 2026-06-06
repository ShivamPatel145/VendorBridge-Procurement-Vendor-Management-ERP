'use client';

import { FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

const MOCK_INVITATIONS = [
  { id: 'RFQ-2025-008', title: 'Office Furniture Procurement Q2', org: 'Acme Corp', deadline: '2025-06-15', status: 'OPEN' },
  { id: 'RFQ-2025-012', title: 'IT Hardware Refresh', org: 'GlobalTech Ltd', deadline: '2025-06-20', status: 'OPEN' },
  { id: 'RFQ-2025-015', title: 'Janitorial Services 2025', org: 'Acme Corp', deadline: '2025-07-01', status: 'OPEN' },
  { id: 'RFQ-2025-001', title: 'Cloud Infrastructure Services', org: 'Stark Industries', deadline: '2025-05-15', status: 'CLOSED' },
];

export default function VendorRFQsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Open Invitations</h2>
          <p className="text-sm text-muted-foreground mt-1">RFQs you have been invited to bid on.</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">RFQ Title</th>
                <th className="px-6 py-4">Requesting Organization</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_INVITATIONS.map((rfq) => (
                <tr key={rfq.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[#14B8A6]" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{rfq.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">{rfq.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {rfq.org}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-muted-foreground">{formatDate(rfq.deadline)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={rfq.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {rfq.status === 'OPEN' ? (
                        <Link 
                          href="/vendor-portal/quotations/new"
                          className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold px-4 py-2 rounded-lg transition-colors shadow-sm text-xs"
                        >
                          Submit Quote <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <span className="flex items-center gap-2 text-muted-foreground font-bold px-4 py-2 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Closed
                        </span>
                      )}
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
