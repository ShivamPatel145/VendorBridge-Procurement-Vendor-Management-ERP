'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Building2, MapPin, Mail, Phone, Globe, 
  ShieldCheck, FileText, Activity, AlertTriangle, Download, 
  Clock, CheckCircle2, TrendingUp 
} from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn, formatDate, formatCurrency } from '@/lib/utils';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, CartesianGrid } from 'recharts';

const TABS = ['Overview', 'Performance', 'Documents', 'History'];

// Mock Vendor Data
const VENDOR = {
  id: 'v1',
  name: 'Acme Corp',
  status: 'APPROVED',
  category: 'IT Hardware',
  complianceScore: 98,
  joined: '2024-03-15',
  contact: {
    email: 'contact@acmecorp.com',
    phone: '+91 98765 43210',
    website: 'www.acmecorp.com',
    address: '123 Tech Park, Cyber City, Bangalore, India',
    gst: '29ABCDE1234F1Z5',
    pan: 'ABCDE1234F'
  },
  metrics: {
    totalSpend: 4500000,
    rfqsInvited: 24,
    bidsSubmitted: 22,
    posAwarded: 15,
    onTimeDelivery: '96%',
    defectRate: '0.5%'
  }
};

const perfData = [
  { month: 'Jan', rating: 92 },
  { month: 'Feb', rating: 94 },
  { month: 'Mar', rating: 91 },
  { month: 'Apr', rating: 96 },
  { month: 'May', rating: 98 },
  { month: 'Jun', rating: 98 },
];

export default function VendorProfilePage() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Back Button */}
      <Link href="/vendors" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Link>

      {/* Header Profile Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 lg:p-8 mb-8 flex flex-col lg:flex-row gap-6 lg:items-center justify-between relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.1),transparent)] pointer-events-none" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center shrink-0 shadow-sm">
            <Building2 className="w-10 h-10 text-[#14B8A6]" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">{VENDOR.name}</h1>
              <StatusBadge status={VENDOR.status} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> {VENDOR.complianceScore}% Compliance Score</span>
              <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> {VENDOR.category}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Joined {formatDate(VENDOR.joined)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button className="px-5 py-2.5 rounded-lg border border-border bg-background text-foreground font-bold text-sm hover:bg-muted transition-colors shadow-sm">
            Suspend
          </button>
          <button className="px-5 py-2.5 rounded-lg bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold text-sm transition-colors shadow-sm">
            Invite to RFQ
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex items-center gap-8 mb-8 overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-4 text-sm font-bold transition-colors relative whitespace-nowrap",
              activeTab === tab ? "text-[#14B8A6]" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14B8A6] rounded-t-full" />}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pb-12">
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-muted/30">
                  <h3 className="font-bold text-foreground">Company Information</h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Legal Name</p>
                    <p className="text-sm font-semibold text-foreground">{VENDOR.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">GST Number</p>
                    <p className="text-sm font-semibold text-foreground font-mono">{VENDOR.contact.gst}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">PAN</p>
                    <p className="text-sm font-semibold text-foreground font-mono">{VENDOR.contact.pan}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Primary Category</p>
                    <p className="text-sm font-semibold text-foreground">{VENDOR.category}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-muted/30">
                  <h3 className="font-bold text-foreground">Contact Details</h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Email</p>
                      <a href={`mailto:${VENDOR.contact.email}`} className="text-sm font-semibold text-[#14B8A6] hover:underline">{VENDOR.contact.email}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Phone</p>
                      <p className="text-sm font-semibold text-foreground">{VENDOR.contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Website</p>
                      <a href={`https://${VENDOR.contact.website}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#14B8A6] hover:underline">{VENDOR.contact.website}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Address</p>
                      <p className="text-sm font-semibold text-foreground">{VENDOR.contact.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Quick Stats Sidebar */}
              <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-foreground mb-6">Engagement Summary</h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium">Total Spend (YTD)</span>
                    <span className="text-sm font-bold text-foreground">{formatCurrency(VENDOR.metrics.totalSpend)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium">POs Awarded</span>
                    <span className="text-sm font-bold text-foreground">{VENDOR.metrics.posAwarded}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium">Win Rate</span>
                    <span className="text-sm font-bold text-[#14B8A6]">
                      {Math.round((VENDOR.metrics.posAwarded / VENDOR.metrics.bidsSubmitted) * 100)}%
                    </span>
                  </div>
                  <div className="h-px bg-border w-full my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> On-Time Delivery</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{VENDOR.metrics.onTimeDelivery}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-rose-500" /> Defect Rate</span>
                    <span className="text-sm font-bold text-foreground">{VENDOR.metrics.defectRate}</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        )}

        {/* PERFORMANCE TAB */}
        {activeTab === 'Performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm p-6">
              <div className="mb-6">
                <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#14B8A6]" /> Vendor Rating Trend
                </h3>
                <p className="text-sm text-muted-foreground mt-1">6-month rolling performance score based on delivery and quality.</p>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={perfData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px', color: 'hsl(var(--foreground))' }}
                      itemStyle={{ color: '#14B8A6', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="rating" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorRating)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-foreground mb-6">SLA Breaches</h3>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="font-bold text-foreground">Zero Breaches</p>
                <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">Vendor has maintained perfect compliance with Service Level Agreements.</p>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'Documents' && (
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
             <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Document Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Expiry Date</th>
                  <th className="px-6 py-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { name: 'GST Certificate', status: 'Valid', expiry: '2027-03-31' },
                  { name: 'ISO 9001:2015', status: 'Valid', expiry: '2025-11-20' },
                  { name: 'Non-Disclosure Agreement', status: 'Valid', expiry: '2030-01-01' },
                ].map(doc => (
                  <tr key={doc.name} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-semibold flex items-center gap-3">
                      <FileText className="w-4 h-4 text-[#14B8A6]" /> {doc.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{formatDate(doc.expiry)}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-muted-foreground hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 rounded-md transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'History' && (
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-8 text-center text-muted-foreground">
             <Activity className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
             <p className="font-semibold text-foreground">Transaction History Logging</p>
             <p className="text-sm mt-1">Full immutable ledger of all RFQs, POs, and Invoices will appear here.</p>
          </div>
        )}
      </div>

    </div>
  );
}
