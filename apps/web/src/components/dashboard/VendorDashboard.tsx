'use client';

import { FileText, Inbox, Receipt, Building2 } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

const stats = [
  { title: 'Open Invitations', value: 3, change: 1, icon: Inbox, color: 'indigo' as const },
  { title: 'Quotes Submitted', value: 12, change: 4, icon: FileText, color: 'teal' as const },
  { title: 'Active POs', value: 5, change: 0, icon: Building2, color: 'emerald' as const },
  { title: 'Pending Invoices', value: formatCurrency(45000), change: -1, icon: Receipt, color: 'amber' as const },
];

const openInvitations = [
  { id: '1', title: 'Office Stationery Q3 2025', org: 'Acme Corp', deadline: '2025-07-15' },
  { id: '2', title: 'IT Equipment Procurement', org: 'GlobalTech Ltd', deadline: '2025-07-01' },
];

const recentPOs = [
  { id: '1', poNumber: 'PO-2025-001', org: 'Acme Corp', amount: 85000, status: 'APPROVED' },
  { id: '2', poNumber: 'PO-2025-002', org: 'GlobalTech Ltd', amount: 23500, status: 'SENT' },
];

export function VendorDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Vendor Portal</h2>
        <p className="text-sm text-muted-foreground">Manage your bids, purchase orders, and invoices.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Open Invitations */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">Open RFQ Invitations</h3>
              <p className="text-xs text-muted-foreground mt-1">Submit your quotes before the deadline</p>
            </div>
            <Link href="/vendor-portal/rfqs" className="text-[#14B8A6] text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-border">
            {openInvitations.map((rfq) => (
              <div key={rfq.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-muted/30 transition-colors gap-4">
                <div>
                  <p className="text-foreground text-sm font-medium">{rfq.title}</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Requested by <span className="font-semibold">{rfq.org}</span> · Due {formatDate(rfq.deadline)}
                  </p>
                </div>
                <Link 
                  href="/vendor-portal/quotations/new"
                  className="text-xs font-bold bg-[#14B8A6] text-white px-4 py-2 rounded-lg hover:bg-[#109A8B] transition-colors whitespace-nowrap"
                >
                  Submit Quote
                </Link>
              </div>
            ))}
            {openInvitations.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No open invitations at the moment.
              </div>
            )}
          </div>
        </div>

        {/* Recent POs */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">Recent Purchase Orders</h3>
              <p className="text-xs text-muted-foreground mt-1">POs issued to your organization</p>
            </div>
            <Link href="/vendor-portal/purchase-orders" className="text-[#14B8A6] text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-border">
            {recentPOs.map((po) => (
              <div key={po.id} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors">
                <div>
                  <p className="text-foreground text-sm font-medium">{po.poNumber}</p>
                  <p className="text-muted-foreground text-xs mt-1">{po.org}</p>
                </div>
                <div className="text-right">
                  <p className="text-foreground text-sm font-semibold mb-2">{formatCurrency(po.amount)}</p>
                  <StatusBadge status={po.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
