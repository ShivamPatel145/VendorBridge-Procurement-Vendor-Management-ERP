'use client';

import { FileText, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

const stats = [
  { title: 'Active RFQs', value: 12, change: 4, icon: FileText, color: 'indigo' as const },
  { title: 'Bids Received', value: 45, change: 18, icon: Users, color: 'teal' as const },
  { title: 'POs to Issue', value: 8, change: -2, icon: ShoppingCart, color: 'amber' as const },
  { title: 'Sourcing Savings', value: formatCurrency(124000), change: 12, icon: TrendingUp, color: 'emerald' as const },
];

const recentRFQs = [
  { id: '1', title: 'Office Stationery Q3 2025', status: 'PUBLISHED', deadline: '2025-07-15', vendors: 5 },
  { id: '2', title: 'IT Equipment Procurement', status: 'EVALUATING', deadline: '2025-07-01', vendors: 3 },
  { id: '3', title: 'Cleaning Supplies Annual', status: 'DRAFT', deadline: '2025-07-30', vendors: 0 },
];

export function ProcurementDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Procurement Desk</h2>
          <p className="text-sm text-muted-foreground">Manage your sourcing pipeline and active requests.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/rfqs/new" className="bg-[#14B8A6] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#109A8B] transition-colors">
            Create RFQ
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* RFQ Pipeline */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Active RFQs</h3>
              <p className="text-xs text-muted-foreground mt-1">Recently published and evaluating requests</p>
            </div>
            <Link href="/rfqs" className="text-[#14B8A6] text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-border">
            {recentRFQs.map((rfq) => (
              <div key={rfq.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-muted/30 transition-colors gap-4">
                <div>
                  <p className="text-foreground text-sm font-medium">{rfq.title}</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {rfq.vendors} bids received · Closes {formatDate(rfq.deadline)}
                  </p>
                </div>
                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <StatusBadge status={rfq.status} size="sm" />
                  <button className="text-xs font-semibold text-foreground border border-border px-3 py-1.5 rounded bg-background hover:bg-muted transition-colors">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col p-6">
          <h3 className="font-semibold text-foreground mb-1">Action Items</h3>
          <p className="text-xs text-muted-foreground mb-6">Pending tasks requiring attention</p>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
              <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1">Bid Evaluation Due</h4>
              <p className="text-xs text-muted-foreground mb-3">IT Equipment Procurement has reached its deadline with 3 bids.</p>
              <button className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline">Start Evaluation &rarr;</button>
            </div>
            
            <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
              <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Approval Granted</h4>
              <p className="text-xs text-muted-foreground mb-3">PO-2025-001 was approved by Finance.</p>
              <button className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline">Generate PO &rarr;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
