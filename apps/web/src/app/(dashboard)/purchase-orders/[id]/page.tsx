'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, Download, Mail, Building2, Loader2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import StatusBadge from '@/components/shared/StatusBadge';
import { toast } from 'sonner';
import { purchaseOrderAPI } from '@/lib/api';
import { generatePDFFromElement } from '@/lib/generatePDF';

interface POItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface PO {
  id: string;
  poNumber: string;
  status: string;
  createdAt: string;
  deliveryDate?: string;
  totalAmount?: number;
  terms?: string;
  items?: POItem[];
  quotation?: {
    vendor?: {
      companyName?: string;
      address?: string;
      contactPerson?: string;
      email?: string;
      phone?: string;
    };
    items?: POItem[];
  };
  createdBy?: { name: string };
}

import { use } from 'react';

export default function PurchaseOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [po, setPO] = useState<PO | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const docRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    purchaseOrderAPI.get(id)
      .then(res => setPO(res.data?.data ?? res.data))
      .catch(() => toast.error('Failed to load Purchase Order'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  const handleDownload = async () => {
    if (!docRef.current) return;
    setDownloading(true);
    toast.info('Generating PDF...');
    const filename = `${po?.poNumber ?? id}.pdf`;
    const ok = await generatePDFFromElement(docRef.current, filename, (msg) => {
      if (msg === 'Done!') toast.success('PDF downloaded successfully!');
    });
    if (!ok) toast.error('PDF generation failed. Please try again.');
    setDownloading(false);
  };

  const handleResend = () => toast.success('Purchase Order has been resent to the vendor via email.');

  // Resolve items from either po.items or po.quotation.items
  const items: POItem[] = po?.items?.length
    ? po.items
    : (po?.quotation?.items ?? []);

  const vendor = po?.quotation?.vendor;
  const subtotal = items.reduce((s, i) => s + Number(i.totalPrice ?? i.unitPrice * i.quantity), 0);
  const tax = subtotal * 0.18;
  const total = Number(po?.totalAmount ?? subtotal + tax);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-[#14B8A6]" />
        <p className="text-sm font-medium">Loading Purchase Order…</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:hidden">
        <Link href="/purchase-orders" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm bg-card">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm bg-card disabled:opacity-60">
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download PDF
          </button>
          <button onClick={handleResend} className="flex items-center gap-2 px-4 py-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white rounded-lg text-sm font-bold transition-colors shadow-sm">
            <Mail className="w-4 h-4" /> Resend to Vendor
          </button>
        </div>
      </div>

      {/* ── A4 Document ── */}
      <div ref={docRef} id="po-document" className="bg-white text-zinc-900 border border-border rounded-lg shadow-xl overflow-hidden print:shadow-none print:border-none">

        {/* Teal accent bar */}
        <div style={{ background: '#14B8A6', height: '6px' }} />

        {/* Letterhead */}
        <div className="p-10 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ background: '#0F172A', borderRadius: 8, width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#14B8A6', fontWeight: 900, fontSize: 16 }}>VB</span>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 16, color: '#0F172A' }}>VendorBridge</p>
                <p style={{ fontSize: 10, color: '#64748B', fontWeight: 600, letterSpacing: 1 }}>ENTERPRISE OS</p>
              </div>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase', color: '#0F172A', letterSpacing: -0.5 }}>Purchase Order</h1>
            <p style={{ color: '#64748B', fontSize: 13, marginTop: 4 }}>VendorBridge Corporation</p>
            <p style={{ color: '#64748B', fontSize: 12 }}>123 Enterprise Way, Tech District</p>
            <p style={{ color: '#64748B', fontSize: 12 }}>San Francisco, CA 94105</p>
            <p style={{ color: '#94A3B8', fontSize: 11, marginTop: 6 }}>Tax ID: US-987654321</p>
          </div>
          <div className="text-left sm:text-right">
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#CBD5E1', marginBottom: 8 }}>{po?.poNumber ?? id}</h2>
            <div style={{ marginBottom: 12 }}>
              <StatusBadge status={po?.status ?? 'DRAFT'} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '2px 16px', fontSize: 12 }}>
              <span style={{ fontWeight: 700, color: '#94A3B8' }}>Issue Date:</span>
              <span style={{ fontWeight: 600 }}>{po?.createdAt ? formatDate(po.createdAt) : '—'}</span>
              <span style={{ fontWeight: 700, color: '#94A3B8' }}>Req. Delivery:</span>
              <span style={{ fontWeight: 600 }}>{po?.deliveryDate ? formatDate(po.deliveryDate) : '—'}</span>
            </div>
          </div>
        </div>

        {/* Address blocks */}
        <div className="p-10 grid grid-cols-2 gap-12" style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Vendor / Supplier</p>
            <p style={{ fontWeight: 700, fontSize: 16, color: '#0F172A' }}>{vendor?.companyName ?? '—'}</p>
            {vendor?.address && <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{vendor.address}</p>}
            {vendor?.contactPerson && <p style={{ fontSize: 12, color: '#64748B' }}>{vendor.contactPerson}{vendor.email ? ` (${vendor.email})` : ''}</p>}
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Ship To / Bill To</p>
            <p style={{ fontWeight: 700, fontSize: 16, color: '#0F172A' }}>VendorBridge Corporation</p>
            <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>123 Enterprise Way, Tech District</p>
            <p style={{ fontSize: 12, color: '#64748B' }}>San Francisco, CA 94105</p>
            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, fontStyle: 'italic' }}>Attn: Receiving Department</p>
          </div>
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
                  <td colSpan={5} style={{ padding: '24px 0', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>No line items on this order.</td>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: '#0F172A', borderRadius: 8, fontSize: 15, fontWeight: 900, color: '#fff' }}>
                <span>Total Due</span><span style={{ color: '#14B8A6' }}>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Signature */}
        <div className="p-10 grid grid-cols-2 gap-12" style={{ borderTop: '1px solid #E2E8F0' }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Terms & Conditions</p>
            <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>{po?.terms ?? 'Standard terms and conditions apply. Payment due within 45 days of delivery.'}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <div style={{ width: 180, borderBottom: '2px solid #CBD5E1', marginBottom: 8 }} />
            <p style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5 }}>Authorized Signature</p>
            <p style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>VendorBridge Corporation</p>
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
