'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles, Building2, CheckCircle2, TrendingDown, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

// Mock Data for Comparison Matrix
const RFQ_DETAILS = {
  id: 'rfq-002',
  title: 'IT Equipment Procurement (Laptops)',
  items: 125,
};

const VENDORS = [
  { id: 'v1', name: 'Acme Corp', score: 98 },
  { id: 'v2', name: 'GlobalTech Ltd', score: 85 },
  { id: 'v5', name: 'Stark Industries', score: 99 },
];

const MATRIX_DATA = {
  unitPrice: {
    label: 'Avg. Unit Price',
    values: { v1: 85000, v2: 82000, v5: 89000 },
    best: 'v2',
    format: 'currency'
  },
  totalCost: {
    label: 'Total Cost (125 units)',
    values: { v1: 10625000, v2: 10250000, v5: 11125000 },
    best: 'v2',
    format: 'currency'
  },
  deliveryTime: {
    label: 'Delivery Timeline',
    values: { v1: '14 Days', v2: '21 Days', v5: '7 Days' },
    best: 'v5',
    format: 'string'
  },
  warranty: {
    label: 'Warranty Period',
    values: { v1: '3 Years Comprehensive', v2: '1 Year Limited', v5: '3 Years Comprehensive' },
    best: ['v1', 'v5'],
    format: 'string'
  },
  paymentTerms: {
    label: 'Payment Terms',
    values: { v1: 'Net 45', v2: 'Net 30', v5: 'Net 60' },
    best: 'v5',
    format: 'string'
  },
  compliance: {
    label: 'System Compliance Score',
    values: { v1: 98, v2: 85, v5: 99 },
    best: 'v5',
    format: 'percentage'
  }
};

export default function QuotationComparisonMatrix({ params }: { params: { rfq_id: string } }) {
  
  const handleAward = (vendorName: string) => {
    toast.success(`Contract awarded to ${vendorName}. Approval workflow initiated.`);
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <Link href="/rfqs" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to RFQs
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">Quotation Comparison Matrix</h2>
          <p className="text-muted-foreground mt-1 text-sm">Evaluating {VENDORS.length} vendor bids for: <span className="font-semibold text-foreground">{RFQ_DETAILS.title}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-border rounded-lg text-sm font-bold text-foreground hover:bg-muted transition-colors">
            Export to Excel
          </button>
        </div>
      </div>

      {/* AI Recommendation Alert */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-[#14B8A6]/10 border border-indigo-500/20 rounded-xl p-5 mb-8 flex gap-4 items-start relative overflow-hidden">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-[#14B8A6] flex items-center justify-center shrink-0 text-white shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-indigo-950 dark:text-indigo-200 mb-1">AI Sourcing Recommendation</h3>
          <p className="text-sm text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed">
            Based on our algorithmic analysis, <strong className="text-indigo-700 dark:text-indigo-300">Acme Corp</strong> provides the most balanced bid. While GlobalTech Ltd has a 3.5% lower cost, Acme Corp offers a significantly better warranty (3 years vs 1 year), a much higher compliance score (98% vs 85%), and faster delivery.
          </p>
        </div>
      </div>

      {/* The Matrix */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          
          {/* Vendor Column Headers */}
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="px-6 py-6 min-w-[200px] border-r border-border bg-card sticky left-0 z-10">
                <div className="font-bold text-foreground text-lg">Evaluation Criteria</div>
                <div className="text-xs text-muted-foreground mt-1 font-normal">Side-by-side bid analysis</div>
              </th>
              {VENDORS.map(v => (
                <th key={v.id} className="px-6 py-6 min-w-[280px] text-center border-r border-border last:border-r-0">
                  <div className="w-12 h-12 rounded-xl bg-[#14B8A6]/10 mx-auto flex items-center justify-center mb-3">
                    <Building2 className="w-6 h-6 text-[#14B8A6]" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg">{v.name}</h3>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-muted-foreground">{v.score}% Compliance</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Data Rows */}
          <tbody className="divide-y divide-border">
            {Object.entries(MATRIX_DATA).map(([key, row]) => (
              <tr key={key} className="hover:bg-muted/10 transition-colors">
                <td className="px-6 py-5 font-bold text-muted-foreground border-r border-border bg-card sticky left-0 z-10">
                  {row.label}
                </td>
                
                {VENDORS.map(v => {
                  const val = row.values[v.id as keyof typeof row.values];
                  const isBest = Array.isArray(row.best) ? row.best.includes(v.id) : row.best === v.id;
                  
                  return (
                    <td key={v.id} className={cn(
                      "px-6 py-5 text-center border-r border-border last:border-r-0 transition-colors",
                      isBest ? "bg-emerald-500/5 relative" : ""
                    )}>
                      {isBest && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-b-md shadow-sm">
                          Best Value
                        </div>
                      )}
                      
                      <div className={cn(
                        "font-bold text-base", 
                        isBest ? "text-emerald-700 dark:text-emerald-400 mt-2" : "text-foreground"
                      )}>
                        {row.format === 'currency' && formatCurrency(val as number)}
                        {row.format === 'percentage' && `${val}%`}
                        {row.format === 'string' && val}
                      </div>

                      {/* Visual Context Icons */}
                      {key === 'totalCost' && isBest && <TrendingDown className="w-4 h-4 mx-auto mt-1.5 text-emerald-500" />}
                      {key === 'deliveryTime' && isBest && <Clock className="w-4 h-4 mx-auto mt-1.5 text-emerald-500" />}
                      {key === 'compliance' && (val as number) < 90 && <AlertTriangle className="w-4 h-4 mx-auto mt-1.5 text-amber-500" />}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          {/* Action Row */}
          <tfoot className="bg-muted/30 border-t border-border">
            <tr>
              <td className="px-6 py-6 border-r border-border bg-card sticky left-0 z-10">
                <span className="font-bold text-foreground">Final Action</span>
              </td>
              {VENDORS.map(v => (
                <td key={v.id} className="px-6 py-6 text-center border-r border-border last:border-r-0">
                  <button 
                    onClick={() => handleAward(v.name)}
                    className={cn(
                      "w-full py-3 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2",
                      v.id === 'v1' // Simulating Acme Corp is the recommended one
                        ? "bg-[#14B8A6] hover:bg-[#109A8B] text-white" 
                        : "bg-background border-2 border-border text-foreground hover:border-[#14B8A6] hover:text-[#14B8A6]"
                    )}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Award Contract
                  </button>
                  {v.id === 'v1' && (
                    <p className="text-[10px] text-[#14B8A6] font-bold uppercase tracking-wider mt-2">AI Recommended</p>
                  )}
                </td>
              ))}
            </tr>
          </tfoot>

        </table>
      </div>

    </div>
  );
}
