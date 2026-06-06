'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, Building2, Package, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils';

const RFQ_DATA = {
  id: 'rfq-002',
  title: 'IT Equipment Procurement (Laptops)',
  status: 'EVALUATING',
  department: 'IT',
  deadline: '2025-07-01',
  justification: 'Replacement of 125 aging developer laptops which are out of warranty and causing productivity drops.',
  vendorsInvited: 8,
  bidsReceived: 8,
  items: [
    { id: 1, name: 'ThinkPad T14 Gen 4 (Core i7, 32GB RAM)', qty: 100, uom: 'pcs' },
    { id: 2, name: 'Dell UltraSharp 27" 4K Monitor', qty: 25, uom: 'pcs' }
  ],
  invitedVendorsList: [
    { name: 'Acme Corp', status: 'Submitted' },
    { name: 'GlobalTech Ltd', status: 'Submitted' },
    { name: 'Stark Industries', status: 'Submitted' },
    { name: 'CyberDyne Systems', status: 'Pending' }
  ]
};

import { use } from 'react';

export default function RFQDetailView({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-12">
      
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/rfqs" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to RFQs
        </Link>
        
        {RFQ_DATA.status === 'EVALUATING' && (
          <Link 
            href={`/quotations/compare/${id}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#14B8A6] hover:bg-[#109A8B] text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" /> Compare Quotations Matrix
          </Link>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-8 border-b border-border bg-gradient-to-r from-muted/50 to-transparent">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">{RFQ_DATA.title}</h1>
            <StatusBadge status={RFQ_DATA.status} />
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {RFQ_DATA.department}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Deadline: {formatDate(RFQ_DATA.deadline)}</span>
            <span className="flex items-center gap-1.5"><Package className="w-4 h-4" /> {RFQ_DATA.items.length} Line Items</span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">Business Justification</h3>
              <p className="text-foreground leading-relaxed bg-muted/30 p-5 rounded-lg border border-border">
                {RFQ_DATA.justification}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">Requested Items</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-5 py-3 w-16">#</th>
                      <th className="px-5 py-3">Description</th>
                      <th className="px-5 py-3 text-right">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {RFQ_DATA.items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-muted/30">
                        <td className="px-5 py-3 font-semibold text-muted-foreground">{idx + 1}</td>
                        <td className="px-5 py-3 font-semibold text-foreground">{item.name}</td>
                        <td className="px-5 py-3 text-right font-bold text-foreground">{item.qty} {item.uom}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-muted/30 p-6 rounded-xl border border-border">
              <h3 className="font-bold text-foreground mb-4">Vendor Engagement</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-medium">Invited</span>
                  <span className="font-bold text-foreground">{RFQ_DATA.vendorsInvited}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-medium">Bids Received</span>
                  <span className="font-bold text-[#14B8A6]">{RFQ_DATA.bidsReceived}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Invited List</p>
                <div className="space-y-3">
                  {RFQ_DATA.invitedVendorsList.map((v, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-foreground">{v.name}</span>
                      {v.status === 'Submitted' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <span className="text-[10px] text-muted-foreground uppercase">Pending</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
