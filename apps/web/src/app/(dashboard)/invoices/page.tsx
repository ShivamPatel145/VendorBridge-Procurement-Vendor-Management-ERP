'use client';

import { useState } from 'react';
import { Search, Filter, Receipt, Calendar, MoreHorizontal, Download, ArrowUpRight } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

const MOCK_INVOICES = [
  { id: 'INV-2025-001', poId: 'PO-2025-003', vendor: 'Stark Industries', amount: 1200000, date: '2025-06-25', status: 'PAID' },
  { id: 'INV-2025-002', poId: 'PO-2025-004', vendor: 'Office World Pvt Ltd', amount: 85000, date: '2025-06-28', status: 'PENDING' },
];

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_INVOICES.filter(i => 
    i.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Invoices & Payments</h2>
          <p className="text-sm text-muted-foreground mt-1">Track vendor invoices and manage payment statuses.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by Invoice # or vendor..." 
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
                <th className="px-6 py-4">Invoice Details</th>
                <th className="px-6 py-4">PO Reference</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <Receipt className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{inv.id}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{inv.vendor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/purchase-orders/${inv.poId}`} className="font-semibold text-[#14B8A6] hover:underline flex items-center gap-1">
                      {inv.poId} <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-foreground">{formatCurrency(inv.amount)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">{formatDate(inv.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-muted-foreground hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 rounded-md transition-colors" title="Download Invoice">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No invoices found.
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
