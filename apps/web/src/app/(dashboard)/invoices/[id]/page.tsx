'use client';

import Link from 'next/link';
import { ArrowLeft, Printer, Download, Mail, Building2, Receipt } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';
import { toast } from 'sonner';

// Mock Invoice Data
const INVOICE_DATA = {
  id: 'INV-2025-001',
  poId: 'PO-2025-003',
  status: 'PAID',
  issueDate: '2025-06-25',
  dueDate: '2025-07-25',
  buyer: {
    name: 'VendorBridge Corporation',
    address: '123 Enterprise Way, Tech District',
    city: 'San Francisco, CA 94105',
    taxId: 'US-987654321'
  },
  vendor: {
    name: 'Stark Industries',
    address: '890 Stark Tower, Manhattan',
    city: 'New York, NY 10001',
    taxId: 'US-998877665',
    contact: 'billing@stark.com'
  },
  items: [
    { id: 1, description: 'R&D Consultation Services (June)', qty: 1, uom: 'lot', unitPrice: 1200000 },
  ],
  totals: {
    subtotal: 1200000,
    tax: 0,
    total: 1200000
  },
  terms: 'Payment is due within 30 days. Please include the Invoice ID on your remittance advice.'
};

export default function InvoiceDetail({ params }: { params: { id: string } }) {
  
  const handlePrint = () => window.print();
  const handleDownload = () => {
    toast.success('Downloading Invoice PDF...');
    setTimeout(() => window.print(), 500);
  };
  const handleResend = () => toast.success('Invoice query has been sent to the vendor via email.');

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Link href="/invoices" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Invoices
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm bg-card">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm bg-card">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button onClick={handleResend} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm">
            <Mail className="w-4 h-4" /> Email Vendor
          </button>
        </div>
      </div>

      {/* A4 Document Paper Style */}
      <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-border rounded-lg shadow-xl overflow-hidden print:shadow-none print:border-none">
        
        {/* Document Header (Letterhead) */}
        <div className="p-8 sm:p-12 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tight uppercase text-indigo-900 dark:text-indigo-400">Tax Invoice</h1>
            </div>
            <p className="font-bold text-lg">{INVOICE_DATA.vendor.name}</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">{INVOICE_DATA.vendor.address}</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">{INVOICE_DATA.vendor.city}</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">Tax ID: {INVOICE_DATA.vendor.taxId}</p>
          </div>
          <div className="text-left sm:text-right">
            <h2 className="text-3xl font-black text-zinc-300 dark:text-zinc-800 mb-2">{params.id}</h2>
            <div className="inline-block mb-4">
              <StatusBadge status={INVOICE_DATA.status} />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-left sm:text-right">
              <span className="font-bold text-zinc-500 dark:text-zinc-400">PO Ref:</span>
              <span className="font-semibold">{INVOICE_DATA.poId}</span>
              <span className="font-bold text-zinc-500 dark:text-zinc-400">Issue Date:</span>
              <span className="font-semibold">{formatDate(INVOICE_DATA.issueDate)}</span>
              <span className="font-bold text-zinc-500 dark:text-zinc-400">Due Date:</span>
              <span className="font-semibold">{formatDate(INVOICE_DATA.dueDate)}</span>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="p-8 sm:p-12 bg-zinc-50 dark:bg-zinc-900/50">
          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-3">Billed To</p>
          <p className="font-bold text-lg">{INVOICE_DATA.buyer.name}</p>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">{INVOICE_DATA.buyer.address}</p>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">{INVOICE_DATA.buyer.city}</p>
        </div>

        {/* Line Items */}
        <div className="p-8 sm:p-12 border-t border-zinc-200 dark:border-zinc-800">
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
              {INVOICE_DATA.items.map((item, idx) => (
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
                <span>{formatCurrency(INVOICE_DATA.totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-zinc-500 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <span>Tax</span>
                <span>{formatCurrency(INVOICE_DATA.totals.tax)}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-indigo-600 dark:text-indigo-400 pt-1">
                <span>Amount Due</span>
                <span>{formatCurrency(INVOICE_DATA.totals.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="p-8 sm:p-12 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Payment Terms</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{INVOICE_DATA.terms}</p>
        </div>

      </div>

    </div>
  );
}
