'use client';

import Link from 'next/link';
import { ArrowLeft, Printer, Download, Mail, Building2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';
import { toast } from 'sonner';

// Mock PO Data
const PO_DATA = {
  id: 'PO-2025-001',
  status: 'SENT',
  issueDate: '2025-06-21',
  deliveryDate: '2025-07-05',
  buyer: {
    name: 'VendorBridge Corporation',
    address: '123 Enterprise Way, Tech District',
    city: 'San Francisco, CA 94105',
    taxId: 'US-987654321'
  },
  vendor: {
    name: 'Acme Corp',
    address: '456 Supplier Blvd, Suite 200',
    city: 'Austin, TX 78701',
    taxId: 'US-123456789',
    contact: 'Jane Smith (jane@acmecorp.com)'
  },
  items: [
    { id: 1, description: 'ThinkPad T14 Gen 4 (Core i7, 32GB RAM)', qty: 100, uom: 'pcs', unitPrice: 85000 },
    { id: 2, description: 'Dell UltraSharp 27" 4K Monitor', qty: 25, uom: 'pcs', unitPrice: 35000 },
  ],
  totals: {
    subtotal: 9375000,
    tax: 875000, // Roughly 9.3%
    total: 10250000
  },
  terms: 'Net 45 Days. Delivery required by July 5th, 2025. Standard 3-year comprehensive warranty applies as per Quotation Ref: Q-8821.'
};

export default function PurchaseOrderDetail({ params }: { params: { id: string } }) {
  
  const handlePrint = () => window.print();
  const handleDownload = () => {
    toast.success('Downloading Purchase Order PDF...');
    setTimeout(() => window.print(), 500); // Trigger print dialog as a mock for PDF save
  };
  const handleResend = () => toast.success('Purchase Order has been resent to the vendor via email.');

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Link href="/purchase-orders" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm bg-card">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm bg-card">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button onClick={handleResend} className="flex items-center gap-2 px-4 py-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white rounded-lg text-sm font-bold transition-colors shadow-sm">
            <Mail className="w-4 h-4" /> Resend to Vendor
          </button>
        </div>
      </div>

      {/* A4 Document Paper Style */}
      <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-border rounded-lg shadow-xl overflow-hidden print:shadow-none print:border-none">
        
        {/* Document Header (Letterhead) */}
        <div className="p-8 sm:p-12 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-zinc-900 dark:bg-white rounded flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white dark:text-zinc-900" />
              </div>
              <h1 className="text-2xl font-black tracking-tight uppercase">Purchase Order</h1>
            </div>
            <p className="font-bold text-lg">{PO_DATA.buyer.name}</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">{PO_DATA.buyer.address}</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">{PO_DATA.buyer.city}</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">Tax ID: {PO_DATA.buyer.taxId}</p>
          </div>
          <div className="text-left sm:text-right">
            <h2 className="text-3xl font-black text-zinc-300 dark:text-zinc-800 mb-2">{params.id}</h2>
            <div className="inline-block mb-4">
              <StatusBadge status={PO_DATA.status} />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-left sm:text-right">
              <span className="font-bold text-zinc-500 dark:text-zinc-400">Issue Date:</span>
              <span className="font-semibold">{formatDate(PO_DATA.issueDate)}</span>
              <span className="font-bold text-zinc-500 dark:text-zinc-400">Req. Delivery:</span>
              <span className="font-semibold">{formatDate(PO_DATA.deliveryDate)}</span>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="p-8 sm:p-12 grid grid-cols-1 sm:grid-cols-2 gap-12 bg-zinc-50 dark:bg-zinc-900/50">
          <div>
            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-3">Vendor / Supplier</p>
            <p className="font-bold text-lg">{PO_DATA.vendor.name}</p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">{PO_DATA.vendor.address}</p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">{PO_DATA.vendor.city}</p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2 font-medium">{PO_DATA.vendor.contact}</p>
          </div>
          <div>
            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-3">Ship To / Bill To</p>
            <p className="font-bold text-lg">{PO_DATA.buyer.name}</p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">{PO_DATA.buyer.address}</p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">{PO_DATA.buyer.city}</p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2 italic">Attn: Receiving Department</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="p-8 sm:p-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-zinc-200 dark:border-zinc-800">
                <th className="py-3 text-xs font-black text-zinc-400 uppercase tracking-widest w-[10%]">Item</th>
                <th className="py-3 text-xs font-black text-zinc-400 uppercase tracking-widest w-[45%]">Description</th>
                <th className="py-3 text-xs font-black text-zinc-400 uppercase tracking-widest w-[15%] text-right">Qty</th>
                <th className="py-3 text-xs font-black text-zinc-400 uppercase tracking-widest w-[15%] text-right">Unit Price</th>
                <th className="py-3 text-xs font-black text-zinc-400 uppercase tracking-widest w-[15%] text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {PO_DATA.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="py-4 font-semibold text-zinc-500">{idx + 1}</td>
                  <td className="py-4 font-semibold">{item.description}</td>
                  <td className="py-4 text-right">{item.qty} <span className="text-xs text-zinc-500">{item.uom}</span></td>
                  <td className="py-4 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-4 text-right font-bold">{formatCurrency(item.qty * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-8 flex justify-end">
            <div className="w-full sm:w-1/2 md:w-1/3 space-y-3">
              <div className="flex justify-between text-sm font-semibold text-zinc-500">
                <span>Subtotal</span>
                <span>{formatCurrency(PO_DATA.totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-zinc-500 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <span>Tax (Est.)</span>
                <span>{formatCurrency(PO_DATA.totals.tax)}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-emerald-600 dark:text-emerald-400 pt-1">
                <span>Total</span>
                <span>{formatCurrency(PO_DATA.totals.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Signatures */}
        <div className="p-8 sm:p-12 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div>
            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Terms & Conditions</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{PO_DATA.terms}</p>
          </div>
          <div className="flex flex-col items-end justify-end">
            <div className="w-48 border-b-2 border-zinc-300 dark:border-zinc-700 mb-2" />
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Authorized Signature</p>
            <p className="text-sm font-semibold mt-1">{PO_DATA.buyer.name}</p>
          </div>
        </div>

      </div>

    </div>
  );
}
