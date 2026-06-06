'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, CheckCircle2, Clock, Building2, AlertCircle } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';

// Mock Data
const MOCK_APPROVALS = [
  { id: 'app-101', rfqTitle: 'IT Equipment Procurement (Laptops)', vendor: 'Acme Corp', amount: 10250000, requestedBy: 'John Doe', date: '2025-06-20', status: 'PENDING', urgent: true },
  { id: 'app-102', rfqTitle: 'Data Center HVAC Upgrade', vendor: 'GlobalTech Ltd', amount: 4500000, requestedBy: 'Jane Smith', date: '2025-06-18', status: 'APPROVED', urgent: false },
  { id: 'app-103', rfqTitle: 'Marketing Agency Retainer', vendor: 'Stark Industries', amount: 1200000, requestedBy: 'Alice Wong', date: '2025-06-10', status: 'REJECTED', urgent: false },
  { id: 'app-104', rfqTitle: 'Office Stationery Q3', vendor: 'Office World Pvt Ltd', amount: 85000, requestedBy: 'John Doe', date: '2025-06-25', status: 'PENDING', urgent: false },
];

export default function ApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_APPROVALS.filter(a => 
    a.rfqTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Approval Queue</h2>
          <p className="text-sm text-muted-foreground mt-1">Review and authorize procurement requests.</p>
        </div>
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
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-sm"
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
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <Link href={`/approvals/${app.id}`} className="font-bold text-foreground hover:text-amber-500 transition-colors flex items-center gap-2">
                          {app.rfqTitle}
                          {app.urgent && app.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-rose-500/10 text-rose-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                              <AlertCircle className="w-3 h-3" /> SLA Risk
                            </span>
                          )}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Building2 className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{app.vendor}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-foreground">{formatCurrency(app.amount)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">{formatDate(app.date)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">by {app.requestedBy}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {app.status === 'PENDING' ? (
                      <Link 
                        href={`/approvals/${app.id}`}
                        className="inline-block px-4 py-2 text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded-md hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
                      >
                        Review Request
                      </Link>
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
              
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No approval requests found.
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
