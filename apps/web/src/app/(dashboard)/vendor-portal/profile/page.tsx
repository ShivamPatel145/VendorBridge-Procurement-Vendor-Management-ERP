'use client';

import { Briefcase, Building2, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { toast } from 'sonner';

export default function VendorProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Company Profile</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your business details and compliance information.</p>
        </div>
        <button onClick={() => toast.success('Profile editor will open here.')} className="bg-card border border-border text-foreground hover:bg-muted font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        {/* Left Column - Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-8 border-b border-border flex items-start gap-6">
              <div className="w-20 h-20 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Building2 className="w-10 h-10 text-indigo-500" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">Acme Corporation</h1>
                  <StatusBadge status="ACTIVE" />
                </div>
                <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                  Leading provider of enterprise hardware and software solutions. Supplying top-tier technology infrastructure to global corporations since 1995.
                </p>
              </div>
            </div>
            
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Tax ID / Registration</p>
                <p className="font-mono text-sm text-foreground">US-998877665</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Primary Contact</p>
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" /> billing@acmecorp.com
                </p>
                <p className="text-sm text-foreground flex items-center gap-2 mt-1">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" /> +1 (555) 019-2837
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
             <div className="p-6 border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" /> Billing Address
                </h3>
             </div>
             <div className="p-6">
                <p className="text-sm text-foreground leading-relaxed">
                  <strong>Acme Corporation Headquarters</strong><br/>
                  123 Innovation Drive, Suite 500<br/>
                  Silicon Valley, CA 94025<br/>
                  United States
                </p>
             </div>
          </div>
        </div>

        {/* Right Column - Compliance */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Compliance Status
              </h3>
            </div>
            <div className="p-6 space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">ISO 27001</p>
                  <p className="text-xs text-muted-foreground">Information Security</p>
                </div>
                <StatusBadge status="VERIFIED" size="sm" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">SOC 2 Type II</p>
                  <p className="text-xs text-muted-foreground">Data Privacy</p>
                </div>
                <StatusBadge status="VERIFIED" size="sm" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">W-9 Tax Form</p>
                  <p className="text-xs text-muted-foreground">Expires Dec 2025</p>
                </div>
                <StatusBadge status="VERIFIED" size="sm" />
              </div>

            </div>
            <div className="p-4 bg-muted/30 border-t border-border text-center">
               <button onClick={() => toast.success('Document upload dialog will open here.')} className="text-xs font-bold text-[#14B8A6] hover:underline">Upload New Document</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
