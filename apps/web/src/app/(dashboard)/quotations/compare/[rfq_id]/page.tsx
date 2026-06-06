'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, XCircle, TrendingDown, Clock, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Mock Data - In real app, fetch based on rfq_id
const MOCK_RFQ = {
  id: 'rfq-2024-042',
  title: 'Office Furniture Procurement Q2',
  items: [
    { name: 'Ergonomic chair', quantity: 25, unit: 'pcs' },
    { name: 'Standing desk', quantity: 10, unit: 'pcs' },
  ],
};

const MOCK_QUOTATIONS = [
  {
    id: 'q1',
    vendorId: 'v1',
    vendorName: 'Pink Rabbit Services',
    items: [
      { name: 'Ergonomic chair', unitPrice: 8500, total: 212500 },
      { name: 'Standing desk', unitPrice: 15000, total: 150000 },
    ],
    subtotal: 362500,
    deliveryDays: 14,
    paymentTerms: 'Net 30',
    discount: 5000,
    gst: 18,
    total: 423150,
    rating: 4.5,
    score: 92,
  },
  {
    id: 'q2',
    vendorId: 'v2',
    vendorName: 'TechOne LTD',
    items: [
      { name: 'Ergonomic chair', unitPrice: 9200, total: 230000 },
      { name: 'Standing desk', unitPrice: 16500, total: 165000 },
    ],
    subtotal: 395000,
    deliveryDays: 10,
    paymentTerms: '20 days net',
    discount: 0,
    gst: 18,
    total: 466100,
    rating: 4.8,
    score: 98,
  },
  {
    id: 'q3',
    vendorId: 'v3',
    vendorName: 'Office WorLD',
    items: [
      { name: 'Ergonomic chair', unitPrice: 8200, total: 205000 },
      { name: 'Standing desk', unitPrice: 14800, total: 148000 },
    ],
    subtotal: 353000,
    deliveryDays: 21,
    paymentTerms: '45 days',
    discount: 10000,
    gst: 18,
    total: 404740,
    rating: 4.2,
    score: 85,
  },
];

import { use } from 'react';

export default function QuotationComparePage({ params }: { params: Promise<{ rfq_id: string }> }) {
  const unwrappedParams = use(params);
  const { rfq_id } = unwrappedParams;

  const router = useRouter();
  const [selectedQuotation, setSelectedQuotation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lowestPrice = Math.min(...MOCK_QUOTATIONS.map(q => q.total));
  const fastestDelivery = Math.min(...MOCK_QUOTATIONS.map(q => q.deliveryDays));

  const handleSelectQuotation = (quotationId: string) => {
    setSelectedQuotation(quotationId);
  };

  const handleApprove = async () => {
    if (!selectedQuotation) {
      toast.error('Please select a quotation to approve');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Quotation approved! Creating purchase order...');
    setLoading(false);
    router.push('/approvals');
  };

  const handleReject = (quotationId: string) => {
    toast.info(`Quotation from ${MOCK_QUOTATIONS.find(q => q.id === quotationId)?.vendorName} rejected`);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/quotations"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Quotation Comparison</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {MOCK_RFQ.title} • {MOCK_QUOTATIONS.length} quotations received
            </p>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-blue-900 dark:text-blue-100">Compare quotations side-by-side</p>
          <p className="text-blue-700 dark:text-blue-300 mt-1">Select the best quotation based on price, delivery time, and vendor rating.</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-4 px-6 text-sm font-bold text-foreground w-[200px] sticky left-0 bg-muted/50 z-10">
                  Criteria
                </th>
                {MOCK_QUOTATIONS.map((quote) => (
                  <th key={quote.id} className="py-4 px-6 text-center min-w-[250px]">
                    <div className="flex flex-col items-center gap-2">
                      <p className="font-bold text-base text-foreground">{quote.vendorName}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          Score: {quote.score}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                          ★ {quote.rating}
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Line Items */}
              {MOCK_RFQ.items.map((item, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-6 font-semibold text-sm sticky left-0 bg-card z-10">
                    {item.name}
                  </td>
                  {MOCK_QUOTATIONS.map((quote) => {
                    const quoteItem = quote.items[idx];
                    return (
                      <td key={quote.id} className="py-4 px-6 text-center">
                        <div className="text-sm">
                          <p className="font-bold text-foreground">₹{quoteItem.unitPrice.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground mt-1">Total: ₹{quoteItem.total.toLocaleString()}</p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Subtotal */}
              <tr className="border-b border-border bg-muted/20">
                <td className="py-4 px-6 font-bold text-sm sticky left-0 bg-muted/20 z-10">
                  Subtotal
                </td>
                {MOCK_QUOTATIONS.map((quote) => (
                  <td key={quote.id} className="py-4 px-6 text-center">
                    <p className="font-bold text-lg text-foreground">₹{quote.subtotal.toLocaleString()}</p>
                  </td>
                ))}
              </tr>

              {/* Delivery Days */}
              <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-4 px-6 font-semibold text-sm sticky left-0 bg-card z-10 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Delivery (days)
                </td>
                {MOCK_QUOTATIONS.map((quote) => (
                  <td key={quote.id} className="py-4 px-6 text-center">
                    <div className={cn(
                      "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold",
                      quote.deliveryDays === fastestDelivery 
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-muted text-foreground"
                    )}>
                      {quote.deliveryDays} days
                      {quote.deliveryDays === fastestDelivery && (
                        <span className="text-xs">⚡</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Payment Terms */}
              <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-4 px-6 font-semibold text-sm sticky left-0 bg-card z-10">
                  Payment Terms
                </td>
                {MOCK_QUOTATIONS.map((quote) => (
                  <td key={quote.id} className="py-4 px-6 text-center text-sm text-muted-foreground">
                    {quote.paymentTerms}
                  </td>
                ))}
              </tr>

              {/* Discount */}
              <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-4 px-6 font-semibold text-sm sticky left-0 bg-card z-10 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                  Discount (sum)
                </td>
                {MOCK_QUOTATIONS.map((quote) => (
                  <td key={quote.id} className="py-4 px-6 text-center">
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {quote.discount > 0 ? `- ₹${quote.discount.toLocaleString()}` : '—'}
                    </p>
                  </td>
                ))}
              </tr>

              {/* GST */}
              <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-4 px-6 font-semibold text-sm sticky left-0 bg-card z-10">
                  GST ({MOCK_QUOTATIONS[0].gst}%)
                </td>
                {MOCK_QUOTATIONS.map((quote) => {
                  const gstAmount = ((quote.subtotal - quote.discount) * quote.gst) / 100;
                  return (
                    <td key={quote.id} className="py-4 px-6 text-center text-sm text-muted-foreground">
                      ₹{gstAmount.toLocaleString()}
                    </td>
                  );
                })}
              </tr>

              {/* Grand Total */}
              <tr className="border-b-2 border-border bg-muted/30">
                <td className="py-5 px-6 font-bold text-base sticky left-0 bg-muted/30 z-10">
                  Grand Total
                </td>
                {MOCK_QUOTATIONS.map((quote) => (
                  <td key={quote.id} className="py-5 px-6 text-center">
                    <div className={cn(
                      "inline-flex flex-col items-center gap-1 px-4 py-2 rounded-lg",
                      quote.total === lowestPrice 
                        ? "bg-[#14B8A6]/10 border-2 border-[#14B8A6]"
                        : ""
                    )}>
                      <p className={cn(
                        "font-bold text-xl",
                        quote.total === lowestPrice ? "text-[#14B8A6]" : "text-foreground"
                      )}>
                        ₹{quote.total.toLocaleString()}
                      </p>
                      {quote.total === lowestPrice && (
                        <span className="text-xs font-semibold text-[#14B8A6]">Lowest Price</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Action Buttons */}
              <tr>
                <td className="py-6 px-6 font-semibold text-sm sticky left-0 bg-card z-10">
                  Action
                </td>
                {MOCK_QUOTATIONS.map((quote) => (
                  <td key={quote.id} className="py-6 px-6">
                    <div className="flex flex-col gap-2">
                      {selectedQuotation === quote.id ? (
                        <button
                          className="w-full flex items-center justify-center gap-2 bg-[#14B8A6] text-white font-bold px-4 py-3 rounded-lg hover:bg-[#109A8B] transition-colors shadow-sm"
                          disabled
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Selected
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSelectQuotation(quote.id)}
                          className="w-full bg-card border-2 border-border hover:border-[#14B8A6] hover:bg-[#14B8A6]/5 text-foreground font-bold px-4 py-3 rounded-lg transition-all"
                        >
                          Select
                        </button>
                      )}
                      <button
                        onClick={() => handleReject(quote.id)}
                        className="w-full bg-card border border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between p-6 bg-card border border-border rounded-xl">
        <div className="text-sm text-muted-foreground">
          {selectedQuotation ? (
            <p>Selected: <strong className="text-foreground">{MOCK_QUOTATIONS.find(q => q.id === selectedQuotation)?.vendorName}</strong></p>
          ) : (
            <p>Select a quotation to proceed with approval</p>
          )}
        </div>
        <button
          onClick={handleApprove}
          disabled={!selectedQuotation || loading}
          className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-sm"
        >
          {loading ? (
            <>Processing...</>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Select & Approve
            </>
          )}
        </button>
      </div>
    </div>
  );
}
