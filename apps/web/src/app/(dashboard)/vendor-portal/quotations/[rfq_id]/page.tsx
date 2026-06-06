'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Save, Send, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Mock RFQ Data
const MOCK_RFQ = {
  id: 'rfq-2024-042',
  title: 'Office Furniture Procurement Q2',
  deadline: '15 June 2025',
  items: [
    { name: 'Ergonomic chair', quantity: 25, unit: 'pcs', category: 'Furniture' },
    { name: 'Standing desk', quantity: 10, unit: 'pcs', category: 'Furniture' },
  ],
};

type QuotationItem = {
  id: number;
  item: string;
  qty: number;
  unitPrice: string;
  total: number;
  deliveryDays: string;
};

export default function SubmitQuotationPage({ params }: { params: Promise<{ rfq_id: string }> }) {
  const { rfq_id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [gstPercent, setGstPercent] = useState('18');
  const [notes, setNotes] = useState('Payment terms: 20 days net...');
  
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([
    { id: 1, item: 'Ergonomic chair', qty: 25, unitPrice: '8500', total: 212500, deliveryDays: '7' },
    { id: 2, item: 'Standing desk', qty: 10, unitPrice: '8200', total: 82000, deliveryDays: '14' },
  ]);

  const handleItemChange = (id: number, field: keyof QuotationItem, value: string | number) => {
    setQuotationItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'unitPrice' || field === 'qty') {
          const price = parseFloat(field === 'unitPrice' ? value as string : updated.unitPrice) || 0;
          const quantity = field === 'qty' ? value as number : updated.qty;
          updated.total = price * quantity;
        }
        return updated;
      }
      return item;
    }));
  };

  const subtotal = quotationItems.reduce((sum, item) => sum + item.total, 0);
  const gstAmount = (subtotal * parseFloat(gstPercent || '0')) / 100;
  const grandTotal = subtotal + gstAmount;

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Quotation submitted successfully!');
    setLoading(false);
    router.push('/vendor-portal/quotations');
  };

  const handleSaveDraft = async () => {
    await new Promise(r => setTimeout(r, 800));
    toast.info('Draft saved');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/vendor-portal/rfqs"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Submit Quotations</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {MOCK_RFQ.title} - deadline {MOCK_RFQ.deadline}
            </p>
          </div>
        </div>
      </div>

      {/* RFQ Summary */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <FileText className="w-5 h-5 text-[#14B8A6] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-foreground mb-2">RFQ Summary</h3>
            <p className="text-sm text-muted-foreground">
              {MOCK_RFQ.items.map(item => `${item.name} • ${item.quantity}`).join(', ')} - category {MOCK_RFQ.items[0].category}
            </p>
          </div>
        </div>
      </div>

      {/* Your Quotation */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h3 className="font-bold text-foreground">Your Quotation</h3>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-bold text-muted-foreground">Item</th>
                  <th className="text-center py-3 px-2 text-sm font-bold text-muted-foreground w-20">Qty</th>
                  <th className="text-right py-3 px-2 text-sm font-bold text-muted-foreground w-32">Unit price</th>
                  <th className="text-right py-3 px-2 text-sm font-bold text-muted-foreground w-32">Total</th>
                  <th className="text-center py-3 px-2 text-sm font-bold text-muted-foreground w-32">Delivery (days)</th>
                </tr>
              </thead>
              <tbody>
                {quotationItems.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-2">
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => handleItemChange(item.id, 'item', e.target.value)}
                        className="w-full bg-transparent border-none text-sm font-medium text-foreground focus:outline-none"
                      />
                    </td>
                    <td className="py-4 px-2 text-center">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => handleItemChange(item.id, 'qty', parseInt(e.target.value) || 0)}
                        className="w-16 bg-muted border border-border rounded px-2 py-1 text-sm text-center text-foreground focus:outline-none focus:ring-1 focus:ring-[#14B8A6]"
                      />
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-sm text-muted-foreground">₹</span>
                        <input
                          type="text"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                          className="w-24 bg-muted border border-border rounded px-2 py-1 text-sm text-right text-foreground focus:outline-none focus:ring-1 focus:ring-[#14B8A6]"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span className="text-sm font-bold text-foreground">₹{item.total.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <input
                        type="text"
                        value={item.deliveryDays}
                        onChange={(e) => handleItemChange(item.id, 'deliveryDays', e.target.value)}
                        className="w-16 bg-muted border border-border rounded px-2 py-1 text-sm text-center text-foreground focus:outline-none focus:ring-1 focus:ring-[#14B8A6]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax and Totals */}
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Tax Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Tax / GST %</label>
                  <input
                    type="text"
                    value={gstPercent}
                    onChange={(e) => setGstPercent(e.target.value)}
                    placeholder="18 %"
                    className="w-full max-w-xs bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Note / Terms</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Payment terms: 20 days net..."
                    className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Right: Totals */}
              <div className="bg-muted/50 border border-border rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">GST ({gstPercent}%)</span>
                    <span className="font-semibold text-foreground">₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-border my-3" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Grand total</span>
                    <span className="font-bold text-xl text-[#14B8A6]">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] disabled:opacity-60 text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Submitting...' : 'Submit Quotation'}
              </button>
              <button
                onClick={handleSaveDraft}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-card border border-border hover:bg-muted text-foreground font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
