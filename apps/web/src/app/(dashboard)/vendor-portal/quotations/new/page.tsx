'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SubmitQuotationPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [taxPercent, setTaxPercent] = useState<number>(18);
  const [notes, setNotes] = useState('Payment terms: 20 days net...');
  
  const [items, setItems] = useState([
    { id: 1, name: 'Ergonomic chair', qty: 25, unitPrice: 3500, deliveryDays: 7 },
    { id: 2, name: 'Standing desk', qty: 10, unitPrice: 8200, deliveryDays: 14 },
  ]);

  const updateItem = (id: number, field: string, value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: Number(value) } : i));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.qty * (item.unitPrice || 0)), 0);
  const gstAmount = subtotal * (taxPercent / 100);
  const grandTotal = subtotal + gstAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Quotation submitted successfully!');
      router.push('/vendor-portal/quotations');
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-12">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Link href="/vendor-portal/rfqs" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to RFQs
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Submit Quotations</h2>
        <p className="text-muted-foreground text-lg mt-1">RFQ: office furniture procurement q2 - deadline 15 june 2025</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* RFQ Summary */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">RFQ Summary</p>
          <p className="text-foreground font-medium">Ergonomic chair * 25, standing desk * 10 - category furniture</p>
        </div>

        {/* Quotation Items */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Your Quotation</p>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4 w-[35%]">Item</th>
                    <th className="px-6 py-4 w-[15%]">Qty</th>
                    <th className="px-6 py-4 w-[20%]">Unit Price</th>
                    <th className="px-6 py-4 w-[15%]">Total</th>
                    <th className="px-6 py-4 w-[15%]">Delivery (days)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">{item.name}</td>
                      <td className="px-6 py-4 font-mono text-muted-foreground">{item.qty}</td>
                      <td className="px-6 py-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                          <input 
                            type="number" 
                            min="0"
                            value={item.unitPrice || ''} 
                            onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] font-mono"
                            required
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-foreground font-mono">
                        {formatCurrency(item.qty * (item.unitPrice || 0))}
                      </td>
                      <td className="px-6 py-3">
                        <input 
                          type="number" 
                          min="1"
                          value={item.deliveryDays || ''} 
                          onChange={(e) => updateItem(item.id, 'deliveryDays', e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]"
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom Section (Terms & Totals) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest">Tax / GST %</label>
              <div className="relative max-w-[200px]">
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest">Note / Terms</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] resize-none"
              />
            </div>
          </div>

          <div className="lg:pl-12 flex flex-col justify-center">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center text-sm font-semibold text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold text-muted-foreground border-b border-border pb-4">
                <span>GST ({taxPercent}%)</span>
                <span className="font-mono text-foreground">{formatCurrency(gstAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-black text-foreground pt-1">
                <span>Grand Total</span>
                <span className="font-mono text-[#14B8A6]">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-6 border-t border-border">
          <button 
            type="submit" 
            disabled={submitting}
            className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-70"
          >
            {submitting ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Quotation</>}
          </button>
          <button 
            type="button" 
            onClick={() => toast.success('Draft saved successfully.')}
            className="flex items-center gap-2 bg-card border border-border text-foreground hover:bg-muted font-bold px-8 py-3.5 rounded-xl transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
        </div>

      </form>
    </div>
  );
}
