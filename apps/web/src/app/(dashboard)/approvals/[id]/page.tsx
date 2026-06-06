'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, CheckCircle2, XCircle, FileSpreadsheet, 
  Building2, MessageSquare, AlertTriangle, PieChart 
} from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock Data
const APP_DATA = {
  id: 'app-101',
  rfqTitle: 'IT Equipment Procurement (Laptops)',
  rfqId: 'rfq-002',
  vendor: 'Acme Corp',
  amount: 10250000,
  requestedBy: 'John Doe',
  department: 'IT',
  justification: 'Replacement of 125 aging developer laptops which are out of warranty and causing productivity drops. Acme Corp was selected via competitive matrix for best total value and 3-year warranty.',
  budget: {
    total: 25000000,
    spent: 12000000,
    currency: 'INR'
  }
};

import { use } from 'react';

export default function ApprovalDetailView({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  const router = useRouter();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Budget Calculations
  const currentUtilization = (APP_DATA.budget.spent / APP_DATA.budget.total) * 100;
  const newUtilization = ((APP_DATA.budget.spent + APP_DATA.amount) / APP_DATA.budget.total) * 100;
  const willExceed = newUtilization > 100;

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    if (action === 'REJECT' && !comment) {
      toast.error('You must provide a comment when rejecting a request.');
      return;
    }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    
    if (action === 'APPROVE') {
      toast.success('Request Approved! Purchase Order will be generated.');
    } else {
      toast.error('Request Rejected. Procurement Officer notified.');
    }
    
    router.push('/approvals');
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <Link href="/approvals" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Queue
      </Link>
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">
            Pending Approval
          </div>
          <span className="text-sm text-muted-foreground">{id}</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground tracking-tight">{APP_DATA.rfqTitle}</h2>
      </div>

      {/* Approval Workflow Timeline */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h3 className="font-bold text-foreground mb-6">Approval Workflow</h3>
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10" />
          <div className="absolute top-5 left-0 h-0.5 bg-[#14B8A6] -z-10" style={{ width: '50%' }} />
          
          {/* Steps */}
          {[
            { num: 1, label: 'Initiated', status: 'complete', sublabel: 'Procurement' },
            { num: 2, label: 'Review', status: 'complete', sublabel: 'Finance' },
            { num: 3, label: 'Approval', status: 'current', sublabel: 'Manager' },
            { num: 4, label: 'PO Created', status: 'pending', sublabel: 'System' },
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center relative z-10">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 mb-2 transition-all",
                step.status === 'complete' ? "bg-[#14B8A6] border-[#14B8A6] text-white" :
                step.status === 'current' ? "bg-amber-500 border-amber-500 text-white ring-4 ring-amber-500/20" :
                "bg-card border-border text-muted-foreground"
              )}>
                {step.status === 'complete' ? '✓' : step.num}
              </div>
              <p className={cn(
                "text-xs font-bold text-center mb-1",
                step.status === 'current' ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
              )}>{step.label}</p>
              <p className="text-[10px] text-muted-foreground">{step.sublabel}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground">Request Details</h3>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Awarded Vendor</p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Building2 className="w-4 h-4 text-[#14B8A6]" /> {APP_DATA.vendor}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Requested Amount</p>
                  <p className="text-xl font-bold text-foreground tracking-tight">{formatCurrency(APP_DATA.amount)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Requested By</p>
                  <p className="text-sm font-semibold text-foreground">{APP_DATA.requestedBy}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Department</p>
                  <p className="text-sm font-semibold text-foreground">{APP_DATA.department}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Business Justification</p>
                <p className="text-sm text-foreground leading-relaxed bg-muted/30 p-4 rounded-lg border border-border">
                  {APP_DATA.justification}
                </p>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Supporting Documents</p>
                <Link 
                  href={`/quotations/compare/${APP_DATA.rfqId}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 rounded-lg text-sm font-bold hover:bg-indigo-500/20 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" /> View Quotation Matrix
                </Link>
              </div>
              
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Budget */}
        <div className="space-y-6">
          
          {/* Budget Impact Widget */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-indigo-500" /> Budget Impact
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Q3 {APP_DATA.department} Budget</span>
                <span className="font-bold text-foreground">{formatCurrency(APP_DATA.budget.total)}</span>
              </div>
              
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-muted-foreground">Current Utilization</span>
                  <span className="text-foreground">{currentUtilization.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${currentUtilization}%` }} />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className={cn(willExceed ? "text-rose-500" : "text-amber-500")}>If Approved (Projected)</span>
                  <span className={cn(willExceed ? "text-rose-500" : "text-amber-500")}>{newUtilization.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
                  <div className="h-full bg-indigo-500" style={{ width: `${currentUtilization}%` }} />
                  <div className={cn("h-full", willExceed ? "bg-rose-500" : "bg-amber-500")} style={{ width: `${newUtilization - currentUtilization}%` }} />
                </div>
              </div>

              {willExceed && (
                <div className="flex items-start gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 mt-4">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Warning: Approving this request will exceed the quarterly departmental budget allocation.</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Box */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-foreground mb-4">Manager Decision</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-2">
                  <MessageSquare className="w-3.5 h-3.5" /> Required Comment
                </label>
                <textarea 
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Provide reason for approval or rejection..."
                  rows={3}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => handleAction('REJECT')}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-background border border-border hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/30 text-foreground font-bold px-4 py-3 rounded-lg transition-colors text-sm"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button 
                  onClick={() => handleAction('APPROVE')}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-3 rounded-lg transition-colors shadow-sm text-sm"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
