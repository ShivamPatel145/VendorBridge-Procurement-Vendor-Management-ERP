'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, MoreHorizontal, FileText, Clock, FileSpreadsheet } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils';

// Mock Data
const MOCK_RFQS = [
  { id: 'rfq-001', title: 'Office Stationery Q3 2025', department: 'Operations', deadline: '2025-07-15', vendors: 5, bids: 3, status: 'PUBLISHED' },
  { id: 'rfq-002', title: 'IT Equipment Procurement (Laptops)', department: 'IT', deadline: '2025-07-01', vendors: 8, bids: 8, status: 'EVALUATING' },
  { id: 'rfq-003', title: 'Cleaning Supplies Annual Contract', department: 'Facilities', deadline: '2025-07-30', vendors: 3, bids: 0, status: 'DRAFT' },
  { id: 'rfq-004', title: 'Marketing Agency Retainer', department: 'Marketing', deadline: '2025-05-15', vendors: 4, bids: 4, status: 'AWARDED' },
  { id: 'rfq-005', title: 'Data Center HVAC Upgrade', department: 'Infrastructure', deadline: '2025-08-10', vendors: 6, bids: 2, status: 'PUBLISHED' },
];

export default function RFQsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_RFQS.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Request for Quotations (RFQs)</h2>
          <p className="text-sm text-muted-foreground mt-1">Create, broadcast, and manage your sourcing events.</p>
        </div>
        <Link href="/rfqs/new" className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Create RFQ
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search RFQs by title or department..." 
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
                <th className="px-6 py-4">RFQ Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Responses</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((rfq) => (
                <tr key={rfq.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <Link href={`/rfqs/${rfq.id}`} className="font-bold text-foreground hover:text-[#14B8A6] transition-colors">
                          {rfq.title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">{rfq.department} • {rfq.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={rfq.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(rfq.deadline)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{rfq.bids} / {rfq.vendors}</span>
                      <span className="text-[10px] uppercase text-muted-foreground tracking-wider">Bids Received</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {rfq.status === 'EVALUATING' && (
                        <Link 
                          href={`/quotations/compare/${rfq.id}`}
                          className="px-3 py-1.5 text-xs font-bold bg-[#14B8A6] text-white rounded-md hover:bg-[#109A8B] transition-colors flex items-center gap-1.5"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" /> Compare Bids
                        </Link>
                      )}
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No RFQs found matching your search.
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
