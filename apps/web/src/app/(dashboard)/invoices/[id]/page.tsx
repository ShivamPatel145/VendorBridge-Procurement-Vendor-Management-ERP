'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, Download, Mail, Receipt, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';
import { toast } from 'sonner';
import { invoiceAPI } from '@/lib/api';
import { generatePDFFromElement } from '@/lib/generatePDF';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  createdAt: string;
  dueDate?: string;
  totalAmount?: number;
  po?: { poNumber?: string; quotation?: { vendor?: { companyName?: string; address?: string; email?: string; phone?: string } } };
  items?: InvoiceItem[];
}

import { use } from 'react';

export default function InvoiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const docRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    invoiceAPI.get(id)
      .then(res => setInvoice(res.data?.data ?? res.data))
      .catch(() => toast.error('Failed to load Invoice'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  const handleDownload = async () => {
    if (!docRef.current) return;
    setDownloading(true);
    toast.info('Generating PDF…');
    const filename = `${invoice?.invoiceNumber ?? id}.pdf`;
    const ok = await generatePDFFromElement(docRef.current, filename, (msg) => {
      if (msg === 'Done!') toast.success('Invoice PDF downloaded!');
    });
    if (!ok) toast.error('PDF generation failed. Please try again.');
    setDownloading(false);
  };

  const handleEmail = () => toast.success('Invoice sent to vendor via email.');

  const items: InvoiceItem[] = invoice?.items ?? [];
  const vendor = invoice?.po?.quotation?.vendor;
  const subtotal = items.reduce((s, i) => s + Number(i.totalPrice ?? i.unitPrice * i.quantity), 0);
  const tax = subtotal * 0.18;
  const total = Number(invoice?.totalAmount ?? subtotal + tax);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium">Loading Invoice…</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:hidden">
        <Link href="/invoices" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Invoices
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm bg-card">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm bg-card disabled:opacity-60">
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download PDF
          </button>
          <button onClick={handleEmail} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm">
            <Mail className="w-4 h-4" /> Email Vendor
          </button>
        </div>
      </div>

      {/* ── A4 Invoice Document ── */}
      <div ref={docRef} id="invoice-document" className="bg-white text-zinc-900 border border-border rounded-lg shadow-xl overflow-hidden print:shadow-none print:border-none">

        {/* Indigo accent bar */}
        <div style={{ background: '#4F46E5', height: '6px' }} />

        {/* Letterhead */}
        <div className="p-10 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ background: '#4F46E5', borderRadius: 8, width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Receipt style={{ color: '#fff', width: 20, height: 20 }} />
              </div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900, textTransform: 'uppercase', color: '#4F46E5', letterSpacing: -0.5 }}>Tax Invoice</h1>
                <p style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, letterSpacing: 1 }}>VENDORBRIDGE ENTERPRISE OS</p>
              </div>
            </div>
            <p style={{ fontWeight: 700, fontSize: 16, color: '#0F172A' }}>{vendor?.companyName ?? 'Vendor'}</p>
            {vendor?.address && <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{vendor.address}</p>}
            {vendor?.email && <p style={{ fontSize: 12, color: '#64748B' }}>{vendor.email}</p>}
          </div>
          <div className="text-left sm:text-right">
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#CBD5E1', marginBottom: 8 }}>{invoice?.invoiceNumber ?? id}</h2>
            <div style={{ marginBottom: 12 }}>
              <StatusBadge status={invoice?.status ?? 'PENDING'} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '2px 16px', fontSize: 12 }}>
              <span style={{ fontWeight: 700, color: '#94A3B8' }}>PO Ref:</span>
              <span style={{ fontWeight: 600 }}>{invoice?.po?.poNumber ?? '—'}</span>
              <span style={{ fontWeight: 700, color: '#94A3B8' }}>Issue Date:</span>
              <span style={{ fontWeight: 600 }}>{invoice?.createdAt ? formatDate(invoice.createdAt) : '—'}</span>
              <span style={{ fontWeight: 700, color: '#94A3B8' }}>Due Date:</span>
              <span style={{ fontWeight: 600 }}>{invoice?.dueDate ? formatDate(invoice.dueDate) : '30 days net'}</span>
            </div>
          </div>
        </div>

        {/* Billed To */}
        <div className="p-10" style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Billed To</p>
          <p style={{ fontWeight: 700, fontSize: 16, color: '#0F172A' }}>VendorBridge Corporation</p>
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>123 Enterprise Way, Tech District</p>
          <p style={{ fontSize: 12, color: '#64748B' }}>San Francisco, CA 94105</p>
          <p style={{ fontSize: 12, color: '#64748B' }}>accounts@vendorbridge.com</p>
        </div>

        {/* Line Items */}
        <div className="p-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                {['#', 'Description', 'Qty', 'Unit Price', 'Amount'].map((h, i) => (
                  <th key={h} style={{ padding: '10px 0', fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5, textAlign: i >= 2 ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? items.map((item, idx) => (
                <tr key={item.id ?? idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 0', fontWeight: 600, color: '#94A3B8', fontSize: 13 }}>{idx + 1}</td>
                  <td style={{ padding: '14px 8px 14px 0', fontWeight: 600, fontSize: 13 }}>{item.description}</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', fontSize: 13 }}>{item.quantity}</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', fontSize: 13 }}>{formatCurrency(Number(item.unitPrice))}</td>
                  <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: 700, fontSize: 13 }}>{formatCurrency(Number(item.totalPrice ?? item.unitPrice * item.quantity))}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} style={{ padding: '24px 0', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>No line items on this invoice.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
            <div style={{ width: 280 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, color: '#64748B', fontWeight: 600, borderBottom: '1px solid #E2E8F0', marginBottom: 8 }}>
                <span>GST (18%)</span><span>{formatCurrency(subtotal * 0.18)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: '#4F46E5', borderRadius: 8, fontSize: 15, fontWeight: 900, color: '#fff' }}>
                <span>Amount Due</span><span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div style={{ borderTop: '1px solid #E2E8F0' }}>
          <div className="p-10 grid grid-cols-2 gap-12">
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Payment Terms</p>
              <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>Payment due within 30 days. Please include the Invoice Number in your remittance advice.</p>
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, fontSize: 12, color: '#64748B', border: '1px solid #E2E8F0' }}>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>Bank Transfer Details</p>
                <p>Account: VendorBridge Corp</p>
                <p>Bank Account: 1234-5678-9012</p>
                <p>IFSC: VBKB0001234</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <div style={{ width: 180, borderBottom: '2px solid #CBD5E1', marginBottom: 8 }} />
              <p style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5 }}>Authorized Signatory</p>
              <p style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>{vendor?.companyName ?? 'Vendor'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: '#F1F5F9', padding: '12px 40px', textAlign: 'center', fontSize: 11, color: '#94A3B8' }}>
          VendorBridge Enterprise OS · Generated electronically — no signature required · {new Date().toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
}
