'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, ShieldCheck, BarChart3, Building2, 
  Check, FileText, X, CheckCircle2, Zap, AlertTriangle, Search, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SHOWCASE_TABS = [
  { id: 'vendors', label: 'Vendor Directory', icon: Building2, color: 'text-indigo-400', bg: 'bg-indigo-400/10', image: '/mockups/vendors.png' },
  { id: 'rfqs', label: 'RFQ Automation', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-400/10', image: '/mockups/rfqs.png' },
  { id: 'approvals', label: 'Visual Approvals', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10', image: '/mockups/approvals.png' },
  { id: 'analytics', label: 'Spend Intelligence', icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-400/10', image: '/mockups/analytics.png' },
];

export default function LandingPage() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = SHOWCASE_TABS[activeTabIndex];

  // Auto-cycle tabs every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTabIndex((prev) => (prev + 1) % SHOWCASE_TABS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans selection:bg-teal-500/30 overflow-x-hidden">
      
      {/* HEADER */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0F14]/90 backdrop-blur-md border-b border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="VendorBridge" width={28} height={28} className="rounded-md" />
            <span className="font-semibold tracking-tight text-lg text-white">VendorBridge</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#capabilities" className="hover:text-white transition-colors">Platform</a>
            <a href="#showcase" className="hover:text-white transition-colors">Product</a>
            <a href="#comparison" className="hover:text-white transition-colors">Compare</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="hidden sm:block text-sm font-medium text-white hover:text-slate-300 transition-colors">
              Book Demo
            </Link>
            <Link href="/register" className="text-sm font-medium bg-[#14B8A6] text-[#0B0F14] px-4 py-2 rounded hover:bg-[#109A8B] transition-colors">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        
        {/* 1. HERO SECTION */}
        <section className="pt-16 pb-16 lg:pt-24 lg:pb-20">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side */}
            <div className="max-w-xl">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-white">
                Stop Managing Procurement Across Emails, Sheets & PDFs.
              </h1>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                VendorBridge helps organizations manage vendors, RFQs, approvals, purchase orders, invoices, and spend analytics from one platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#14B8A6] text-[#0B0F14] px-7 py-3 rounded font-semibold hover:bg-[#109A8B] transition-colors">
                  Start Demo <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/login" className="w-full sm:w-auto flex items-center justify-center px-7 py-3 rounded font-medium text-white bg-[#111827] border border-[#1F2937] hover:bg-[#1F2937] transition-colors">
                  Book Demo
                </Link>
              </div>
            </div>

            {/* Right Side - Dashboard Mockup */}
            <div className="relative w-full aspect-[4/3] lg:aspect-auto flex items-center justify-center">
              <div className="relative z-10 w-full h-auto rounded-xl border border-[#1F2937] shadow-2xl overflow-hidden bg-[#111827]">
                 <Image src="/mockups/hero.png" alt="VendorBridge Dashboard" width={800} height={600} className="w-full h-auto" priority />
              </div>

              {/* Floating UI Cards */}
              <div className="absolute top-8 -left-6 z-20 bg-[#111827] border border-[#1F2937] p-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6]"><FileText className="w-4 h-4"/></div>
                <div><p className="text-xs font-semibold text-white">RFQ Published</p><p className="text-[10px] text-slate-500">IT Equipment Q3</p></div>
              </div>
              <div className="absolute bottom-12 -right-6 z-20 bg-[#111827] border border-[#1F2937] p-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in-delayed">
                <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500"><CheckCircle2 className="w-4 h-4"/></div>
                <div><p className="text-xs font-semibold text-white">PO Approved</p><p className="text-[10px] text-slate-500">PO-2026-004</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SOCIAL PROOF */}
        <section className="py-8 border-y border-[#1F2937] bg-[#111827]/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center sm:justify-between items-center gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Vendors</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-[#1F2937]"></div>
              <div>
                <p className="text-2xl font-bold text-white">200+</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">RFQs</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-[#1F2937]"></div>
              <div>
                <p className="text-2xl font-bold text-white">₹12.4Cr</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Spend</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-[#1F2937]"></div>
              <div>
                <p className="text-2xl font-bold text-[#14B8A6]">98%</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Efficiency</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-[#1F2937]/50 text-center">
              <p className="text-xs text-slate-500 font-medium mb-4">TRUSTED BY MODERN PROCUREMENT TEAMS</p>
              <div className="flex flex-wrap items-center justify-center gap-10 opacity-30 grayscale">
                 <span className="text-lg font-bold font-serif">ACME Corp</span>
                 <span className="text-lg font-bold tracking-tighter">GlobalTech</span>
                 <span className="text-lg font-bold uppercase">Stark Ind.</span>
                 <span className="text-lg font-bold italic">Wayne Ent.</span>
                 <span className="text-lg font-bold">CyberDyne</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. NEW REPLACEMENT SECTION: Core Capabilities */}
        <section id="capabilities" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Everything you need to source faster.</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">A unified engine designed to orchestrate every stage of the procurement lifecycle.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-[#111827]/40 border border-[#1F2937] hover:border-[#14B8A6]/50 transition-colors group">
               <div className="w-14 h-14 rounded-xl bg-[#1F2937] group-hover:bg-[#14B8A6]/10 flex items-center justify-center mb-6 transition-colors">
                 <Search className="w-7 h-7 text-slate-400 group-hover:text-[#14B8A6] transition-colors" />
               </div>
               <h3 className="text-lg font-bold text-white mb-3">Discover & Sourcing</h3>
               <p className="text-slate-400 text-sm leading-relaxed">Broadcast digital RFQs to your approved vendor network in seconds. Track compliance docs and historical performance seamlessly.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-[#111827]/40 border border-[#1F2937] hover:border-[#14B8A6]/50 transition-colors group">
               <div className="w-14 h-14 rounded-xl bg-[#1F2937] group-hover:bg-[#14B8A6]/10 flex items-center justify-center mb-6 transition-colors">
                 <BarChart3 className="w-7 h-7 text-slate-400 group-hover:text-[#14B8A6] transition-colors" />
               </div>
               <h3 className="text-lg font-bold text-white mb-3">Algorithmic Matrix</h3>
               <p className="text-slate-400 text-sm leading-relaxed">Incoming quotations are standardized and plotted side-by-side. The engine instantly highlights the lowest cost and fastest delivery.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-[#111827]/40 border border-[#1F2937] hover:border-[#14B8A6]/50 transition-colors group">
               <div className="w-14 h-14 rounded-xl bg-[#1F2937] group-hover:bg-[#14B8A6]/10 flex items-center justify-center mb-6 transition-colors">
                 <Activity className="w-7 h-7 text-slate-400 group-hover:text-[#14B8A6] transition-colors" />
               </div>
               <h3 className="text-lg font-bold text-white mb-3">Automated Routing</h3>
               <p className="text-slate-400 text-sm leading-relaxed">Eliminate Slack chasing. Purchase orders are visually routed through an immutable approval chain based on organizational spend limits.</p>
            </div>
          </div>
        </section>

        {/* 4. TABBED PRODUCT SHOWCASE */}
        <section id="showcase" className="py-24 border-y border-[#1F2937] bg-[#111827]/20">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 items-start">
              {/* Left Column - Titles & Tabs */}
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#111827] border border-[#1F2937] text-[#14B8A6] text-xs font-semibold mb-6 tracking-wide">
                  PLATFORM OVERVIEW
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-8 text-white">The complete <br/>procurement suite.</h2>
                
                {/* Tabs - Left Aligned Vertical Stack */}
                <div className="flex flex-col gap-2">
                  {SHOWCASE_TABS.map((tab, index) => {
                    const isActive = activeTabIndex === index;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTabIndex(index)}
                        className={cn(
                          "flex flex-col text-left px-5 py-4 rounded-xl transition-all duration-300 border relative overflow-hidden group",
                          isActive 
                            ? "bg-[#111827] border-[#1F2937] shadow-lg" 
                            : "bg-transparent border-transparent hover:bg-[#111827]/50"
                        )}
                      >
                        {/* Progress Bar Indicator for active tab */}
                        {isActive && (
                          <div className="absolute top-0 left-0 w-1 h-full bg-[#14B8A6] rounded-r-sm"></div>
                        )}
                        
                        <div className="flex items-center gap-4">
                           <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-colors", isActive ? tab.bg : "bg-[#1F2937]")}>
                             <tab.icon className={cn("w-5 h-5", isActive ? tab.color : "text-slate-500")} />
                           </div>
                           <span className={cn("font-semibold text-sm", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300")}>
                             {tab.label}
                           </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column - Browser Mockup */}
              <div className="rounded-xl border border-[#1F2937] bg-[#111827] shadow-2xl overflow-hidden mt-4 lg:mt-0 relative">
                <div className="h-10 border-b border-[#1F2937] flex items-center px-4 gap-2 bg-[#0B0F14]">
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                </div>
                <div className="relative aspect-[16/9] w-full bg-[#0B0F14] overflow-hidden">
                   {SHOWCASE_TABS.map((tab, index) => (
                     <div 
                       key={tab.id}
                       className={cn(
                         "absolute inset-0 transition-opacity duration-500 ease-in-out",
                         activeTabIndex === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                       )}
                     >
                       <Image 
                         src={tab.image} 
                         alt={tab.label} 
                         fill
                         className="object-cover"
                         priority={index === 0}
                       />
                     </div>
                   ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5. BENEFITS */}
        <section id="benefits" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white">Built for speed and control.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-[#1F2937] bg-[#111827]">
              <Zap className="w-6 h-6 text-[#14B8A6] mb-4" />
              <h3 className="text-base font-semibold text-white mb-2">Faster Procurement</h3>
              <p className="text-sm text-slate-400">Reduce sourcing cycles from weeks to days.</p>
            </div>
            <div className="p-6 rounded-xl border border-[#1F2937] bg-[#111827]">
              <Building2 className="w-6 h-6 text-[#14B8A6] mb-4" />
              <h3 className="text-base font-semibold text-white mb-2">Vendor Visibility</h3>
              <p className="text-sm text-slate-400">A single source of truth for all supplier data.</p>
            </div>
            <div className="p-6 rounded-xl border border-[#1F2937] bg-[#111827]">
              <ShieldCheck className="w-6 h-6 text-[#14B8A6] mb-4" />
              <h3 className="text-base font-semibold text-white mb-2">Approval Automation</h3>
              <p className="text-sm text-slate-400">Strict compliance without the manual bottlenecks.</p>
            </div>
            <div className="p-6 rounded-xl border border-[#1F2937] bg-[#111827]">
              <BarChart3 className="w-6 h-6 text-[#14B8A6] mb-4" />
              <h3 className="text-base font-semibold text-white mb-2">Spend Intelligence</h3>
              <p className="text-sm text-slate-400">Real-time reports on where your money goes.</p>
            </div>
          </div>
        </section>

        {/* 6. PROBLEM -> SOLUTION (Moved here, Sleek UI Redesign) */}
        <section id="comparison" className="py-24 border-t border-[#1F2937] max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Why legacy procurement breaks.</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Stop relying on disconnected tools that slow your business down, create compliance risks, and drain your budget.</p>
          </div>
          
          <div className="bg-[#111827]/40 border border-[#1F2937] rounded-2xl overflow-hidden shadow-xl">
             <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1F2937]">
                
                {/* Legacy System (The Old Way) */}
                <div className="p-10">
                   <h3 className="text-lg font-bold mb-8 text-slate-400 flex items-center gap-3">
                     <AlertTriangle className="w-5 h-5 text-slate-500" /> Legacy Systems
                   </h3>
                   <ul className="space-y-8">
                     <li>
                        <div className="flex items-center gap-3 mb-2">
                          <X className="w-4 h-4 text-rose-500/50" />
                          <p className="text-slate-300 font-semibold text-sm line-through decoration-rose-500/30">Scattered Vendor Data</p>
                        </div>
                        <p className="text-slate-500 text-sm pl-7 leading-relaxed">Critical compliance docs lost in local drives and disjointed email threads.</p>
                     </li>
                     <li>
                        <div className="flex items-center gap-3 mb-2">
                          <X className="w-4 h-4 text-rose-500/50" />
                          <p className="text-slate-300 font-semibold text-sm line-through decoration-rose-500/30">Manual Extraction</p>
                        </div>
                        <p className="text-slate-500 text-sm pl-7 leading-relaxed">Hours spent copy-pasting vendor pricing into clunky Excel comparison matrices.</p>
                     </li>
                     <li>
                        <div className="flex items-center gap-3 mb-2">
                          <X className="w-4 h-4 text-rose-500/50" />
                          <p className="text-slate-300 font-semibold text-sm line-through decoration-rose-500/30">Approval Black Holes</p>
                        </div>
                        <p className="text-slate-500 text-sm pl-7 leading-relaxed">Purchase requests stalled for weeks waiting for an executive's Slack response.</p>
                     </li>
                   </ul>
                </div>

                {/* VendorBridge OS */}
                <div className="p-10 bg-gradient-to-br from-[#111827] to-[#0B0F14]">
                   <h3 className="text-lg font-bold mb-8 text-white flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse"></div> VendorBridge OS
                   </h3>
                   <ul className="space-y-8">
                     <li>
                        <div className="flex items-center gap-3 mb-2">
                          <Check className="w-4 h-4 text-[#14B8A6]" />
                          <p className="text-white font-semibold text-sm">Unified Directory</p>
                        </div>
                        <p className="text-slate-400 text-sm pl-7 leading-relaxed">A single, secure source of truth for vendor performance and compliance documents.</p>
                     </li>
                     <li>
                        <div className="flex items-center gap-3 mb-2">
                          <Check className="w-4 h-4 text-[#14B8A6]" />
                          <p className="text-white font-semibold text-sm">Algorithmic Matrix</p>
                        </div>
                        <p className="text-slate-400 text-sm pl-7 leading-relaxed">Quotations are instantly standardized and automatically compared side-by-side.</p>
                     </li>
                     <li>
                        <div className="flex items-center gap-3 mb-2">
                          <Check className="w-4 h-4 text-[#14B8A6]" />
                          <p className="text-white font-semibold text-sm">Automated Routing</p>
                        </div>
                        <p className="text-slate-400 text-sm pl-7 leading-relaxed">Requests are instantly and visually routed based on exact organizational spend limits.</p>
                     </li>
                   </ul>
                </div>

             </div>
          </div>
        </section>

        {/* 7. TESTIMONIALS */}
        <section className="py-24 border-t border-[#1F2937] bg-[#111827]/30">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-16 text-white">Trusted by Procurement Leaders</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { quote: "VendorBridge eliminated our spreadsheet reliance completely. We now process RFQs 4x faster.", author: "Sarah Jenkins", role: "Head of Procurement" },
                { quote: "The comparison matrix alone is worth the price. It's the most beautifully designed B2B tool we use.", author: "Michael Chang", role: "CFO" },
                { quote: "Approval workflows are no longer a black box. Total visibility across the entire supply chain.", author: "Elena Rostova", role: "Supply Chain Manager" }
              ].map((t, i) => (
                <div key={i} className="p-8 rounded-xl border border-[#1F2937] bg-[#0B0F14] flex flex-col justify-between">
                  <p className="text-slate-300 text-sm leading-relaxed mb-8">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center text-xs font-bold text-slate-400">{t.author.charAt(0)}</div>
                    <div>
                      <p className="font-semibold text-white text-sm">{t.author}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. CTA */}
        <section className="py-32 relative border-t border-[#1F2937] overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl opacity-[0.03] pointer-events-none">
             <Image src="/mockups/hero.png" alt="" width={1000} height={600} className="w-full h-auto" />
          </div>
          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white">
              Procurement Should Move <br/> As Fast As Your Business.
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              Centralize vendors, automate approvals, and gain full spending visibility.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="px-8 py-3 rounded font-semibold text-[#0B0F14] bg-[#14B8A6] hover:bg-[#109A8B] transition-colors">
                Start Demo
              </Link>
              <Link href="/login" className="px-8 py-3 rounded font-medium text-white bg-[#111827] border border-[#1F2937] hover:bg-[#1F2937] transition-colors">
                Book Demo
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* 9. COMPACT FOOTER */}
      <footer className="border-t border-[#1F2937] bg-[#111827] pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Resources</h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#1F2937] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="VendorBridge" width={16} height={16} className="rounded-sm opacity-50" />
              <p className="text-slate-500 text-xs">© {new Date().getFullYear()} VendorBridge Inc.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]"></div>
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
