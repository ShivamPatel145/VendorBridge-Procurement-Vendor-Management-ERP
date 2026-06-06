'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { 
  ArrowRight, ShieldCheck, BarChart3, Building2, 
  Check, FileText, X, CheckCircle2, Zap, AlertTriangle, Search, Activity, Sun, Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SHOWCASE_TABS = [
  { id: 'vendors', label: 'Vendor Directory', icon: Building2, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-400/10', image: '/mockups/vendors.png' },
  { id: 'rfqs', label: 'RFQ Automation', icon: FileText, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-400/10', image: '/mockups/rfqs.png' },
  { id: 'approvals', label: 'Visual Approvals', icon: ShieldCheck, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-400/10', image: '/mockups/approvals.png' },
  { id: 'analytics', label: 'Spend Intelligence', icon: BarChart3, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-400/10', image: '/mockups/analytics.png' },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-9 h-9 rounded-lg flex items-center justify-center border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export default function LandingPage() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTabIndex((prev) => (prev + 1) % SHOWCASE_TABS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden transition-colors duration-300">
      
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="VendorBridge" width={28} height={28} className="rounded-md" />
            <span className="font-semibold tracking-tight text-lg">VendorBridge</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#capabilities" className="hover:text-foreground transition-colors">Platform</a>
            <a href="#showcase" className="hover:text-foreground transition-colors">Product</a>
            <a href="#comparison" className="hover:text-foreground transition-colors">Compare</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2">
              Sign In
            </Link>
            <Link href="/register" className="text-sm font-medium bg-[#14B8A6] text-white px-4 py-2 rounded-lg hover:bg-[#109A8B] transition-colors">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        
        {/* ── HERO ── */}
        <section className="py-20 lg:py-28 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(20,184,166,0.06),transparent)] pointer-events-none" />
          <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/20 text-[#14B8A6] text-xs font-semibold mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse"></span>
                Procurement Operating System
              </div>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
                Stop Managing Procurement Across Emails, Sheets & PDFs.
              </h1>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg">
                VendorBridge unifies vendors, RFQs, approvals, purchase orders, invoices, and spend analytics in one powerful platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#14B8A6] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#109A8B] transition-colors shadow-sm">
                  Start Demo <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/login" className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 rounded-lg font-medium text-foreground bg-card border border-border hover:bg-muted transition-colors">
                  Book a Demo
                </Link>
              </div>
            </div>

            {/* Mockup */}
            <div className="relative w-full flex items-center justify-center lg:justify-end">
              <div className="relative z-10 w-full max-w-2xl rounded-xl border border-border shadow-2xl overflow-hidden bg-card">
                <Image src="/mockups/hero.png" alt="VendorBridge Dashboard" width={800} height={500} className="w-full" priority />
              </div>
              
              {/* Floating cards */}
              <div className="absolute top-10 -left-2 sm:-left-6 z-20 bg-white dark:bg-[#1F2937] border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-700 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/15 flex items-center justify-center text-[#14B8A6] shrink-0 ml-3 my-3">
                  <FileText className="w-5 h-5"/>
                </div>
                <div className="py-3 pr-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">RFQ Published</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">IT Equipment Q3</p>
                </div>
              </div>
              <div className="absolute bottom-16 -right-2 sm:-right-6 z-20 bg-white dark:bg-[#1F2937] border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl flex items-center gap-3 animate-in slide-in-from-bottom-8 duration-1000 delay-150 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-500 shrink-0 ml-3 my-3">
                  <CheckCircle2 className="w-5 h-5"/>
                </div>
                <div className="py-3 pr-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">PO Approved</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">PO-2026-004</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF ── */}
        <section className="py-12 border-y border-border bg-muted/20">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4 text-center">
              {[
                { val: '50+', label: 'Vendors' },
                { val: '200+', label: 'RFQs' },
                { val: '₹12.4Cr', label: 'Spend Managed' },
                { val: '98%', label: 'Efficiency', teal: true },
              ].map((stat, i, arr) => (
                <div key={stat.label} className="flex items-center gap-8 md:gap-0 md:flex-1 md:justify-between">
                  <div className="mx-auto">
                    <p className={cn("text-3xl font-bold tracking-tight", stat.teal ? "text-[#14B8A6]" : "text-foreground")}>{stat.val}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-2">{stat.label}</p>
                  </div>
                  {i < arr.length - 1 && <div className="hidden md:block w-px h-10 bg-border mx-auto" />}
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground font-semibold mb-6 uppercase tracking-widest">Trusted by modern procurement teams</p>
              <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale select-none">
                <span className="text-xl font-bold font-serif tracking-tight">ACME Corp</span>
                <span className="text-xl font-bold tracking-tighter">GlobalTech</span>
                <span className="text-xl font-bold uppercase tracking-widest">Stark Ind.</span>
                <span className="text-xl font-bold italic tracking-tight">Wayne Ent.</span>
                <span className="text-xl font-bold tracking-widest">CyberDyne</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── CAPABILITIES ── */}
        <section id="capabilities" className="py-24 lg:py-32 max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">Everything you need to source faster.</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">A unified engine designed to orchestrate every stage of the procurement lifecycle.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { icon: Search, title: 'Discover & Sourcing', desc: 'Broadcast digital RFQs to your approved vendor network in seconds. Track compliance docs and historical performance seamlessly.' },
              { icon: BarChart3, title: 'Algorithmic Matrix', desc: 'Incoming quotations are standardized and plotted side-by-side. The engine instantly highlights the lowest cost and fastest delivery.' },
              { icon: Activity, title: 'Automated Routing', desc: 'Eliminate Slack chasing. Purchase orders are visually routed through an immutable approval chain based on spend limits.' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center p-10 rounded-2xl bg-card border border-border hover:border-[#14B8A6]/40 transition-all duration-300 shadow-sm hover:shadow-md group cursor-default">
                <div className="w-16 h-16 rounded-2xl bg-muted group-hover:bg-[#14B8A6]/10 flex items-center justify-center mb-8 transition-colors">
                  <item.icon className="w-8 h-8 text-muted-foreground group-hover:text-[#14B8A6] transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRODUCT SHOWCASE ── */}
        <section id="showcase" className="py-24 lg:py-32 border-y border-border bg-muted/10">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16 lg:gap-20 items-start">
              {/* Left tabs */}
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-card border border-border text-[#14B8A6] text-xs font-semibold mb-8 tracking-wide">
                  PLATFORM OVERVIEW
                </div>
                <h2 className="text-4xl font-bold tracking-tight mb-10 leading-[1.1]">The complete<br/>procurement suite.</h2>
                <div className="flex flex-col gap-3">
                  {SHOWCASE_TABS.map((tab, index) => {
                    const isActive = activeTabIndex === index;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTabIndex(index)}
                        className={cn(
                          "flex items-center gap-4 text-left px-5 py-4 rounded-xl transition-all duration-300 border relative overflow-hidden",
                          isActive ? "bg-card border-border shadow-md" : "bg-transparent border-transparent hover:bg-card/50"
                        )}
                      >
                        {isActive && <div className="absolute top-0 left-0 w-1 h-full bg-[#14B8A6]" />}
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center transition-colors shrink-0", isActive ? tab.bg : "bg-muted")}>
                          <tab.icon className={cn("w-6 h-6", isActive ? tab.color : "text-muted-foreground")} />
                        </div>
                        <span className={cn("font-bold text-base", isActive ? "text-foreground" : "text-muted-foreground")}>
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Browser mockup */}
              <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden mt-4 lg:mt-0">
                {/* <div className="h-10 border-b border-border flex items-center px-4 gap-2 bg-muted/30 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-border hover:bg-rose-400 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-border hover:bg-amber-400 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-border hover:bg-emerald-400 transition-colors" />
                </div> */}
                <div className="relative aspect-video w-full bg-background overflow-hidden">
                  {SHOWCASE_TABS.map((tab, index) => (
                    <div key={tab.id} className={cn("absolute inset-0 transition-opacity duration-700", activeTabIndex === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
                      <Image src={tab.image} alt={tab.label} fill className="object-cover object-top" priority={index === 0} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section id="benefits" className="py-24 lg:py-32 max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight">Built for speed and control.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: Zap, title: 'Faster Procurement', desc: 'Reduce sourcing cycles from weeks to days.' },
              { icon: Building2, title: 'Vendor Visibility', desc: 'A single source of truth for all supplier data.' },
              { icon: ShieldCheck, title: 'Approval Automation', desc: 'Strict compliance without the manual bottlenecks.' },
              { icon: BarChart3, title: 'Spend Intelligence', desc: 'Real-time reports on where your money goes.' },
            ].map((b) => (
              <div key={b.title} className="p-8 rounded-2xl border border-border bg-card shadow-sm">
                <b.icon className="w-8 h-8 text-[#14B8A6] mb-6" />
                <h3 className="text-lg font-bold mb-3">{b.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMPARISON ── */}
        <section id="comparison" className="py-24 lg:py-32 border-t border-border max-w-[1024px] mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">Why legacy procurement breaks.</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">Stop relying on disconnected tools that create compliance risks and drain your budget.</p>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              {/* Legacy */}
              <div className="p-10 lg:p-12">
                <h3 className="text-xl font-bold mb-10 text-muted-foreground flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6" /> Legacy Systems
                </h3>
                <ul className="space-y-10">
                  {[
                    { title: 'Scattered Vendor Data', desc: 'Critical compliance docs lost in local drives and disjointed email threads.' },
                    { title: 'Manual Extraction', desc: 'Hours spent copy-pasting vendor pricing into clunky Excel comparison matrices.' },
                    { title: 'Approval Black Holes', desc: "Purchase requests stalled for weeks waiting for an executive's Slack response." },
                  ].map(item => (
                    <li key={item.title}>
                      <div className="flex items-center gap-3 mb-2">
                        <X className="w-5 h-5 text-rose-500/80 shrink-0" />
                        <p className="font-bold text-base line-through decoration-rose-400/50">{item.title}</p>
                      </div>
                      <p className="text-muted-foreground text-sm pl-8 leading-relaxed">{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
              {/* VendorBridge */}
              <div className="p-10 lg:p-12 bg-gradient-to-br from-card to-background/50 relative">
                <div className="absolute inset-0 bg-[#14B8A6]/[0.02] pointer-events-none" />
                <h3 className="text-xl font-bold mb-10 flex items-center gap-3 relative z-10">
                  <div className="w-3 h-3 rounded-full bg-[#14B8A6] animate-pulse" /> VendorBridge OS
                </h3>
                <ul className="space-y-10 relative z-10">
                  {[
                    { title: 'Unified Directory', desc: 'A single, secure source of truth for vendor performance and compliance documents.' },
                    { title: 'Algorithmic Matrix', desc: 'Quotations are instantly standardized and automatically compared side-by-side.' },
                    { title: 'Automated Routing', desc: 'Requests are instantly routed based on exact organizational spend limits.' },
                  ].map(item => (
                    <li key={item.title}>
                      <div className="flex items-center gap-3 mb-2">
                        <Check className="w-5 h-5 text-[#14B8A6] shrink-0" />
                        <p className="font-bold text-base">{item.title}</p>
                      </div>
                      <p className="text-muted-foreground text-sm pl-8 leading-relaxed">{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-24 lg:py-32 border-t border-border bg-muted/10">
          <div className="max-w-[1280px] mx-auto px-6">
            <h2 className="text-4xl font-bold tracking-tight text-center mb-20">Trusted by Procurement Leaders</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {[
                { quote: "VendorBridge eliminated our spreadsheet reliance completely. We now process RFQs 4x faster.", author: "Sarah Jenkins", role: "Head of Procurement" },
                { quote: "The comparison matrix alone is worth the price. The most beautifully designed B2B tool we use.", author: "Michael Chang", role: "CFO" },
                { quote: "Approval workflows are no longer a black box. Total visibility across the entire supply chain.", author: "Elena Rostova", role: "Supply Chain Manager" },
              ].map((t) => (
                <div key={t.author} className="p-10 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <p className="text-foreground/90 text-base leading-relaxed mb-10 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-bold text-muted-foreground">{t.author[0]}</div>
                    <div>
                      <p className="font-bold text-sm">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 lg:py-32 relative border-t border-border overflow-hidden bg-card">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(20,184,166,0.06),transparent)] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
              Procurement Should Move<br/>As Fast As Your Business.
            </h2>
            <p className="text-muted-foreground text-xl mb-12 max-w-2xl mx-auto">
              Centralize vendors, automate approvals, and gain full spending visibility in one elegant platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="px-8 py-4 rounded-lg font-bold text-white bg-[#14B8A6] hover:bg-[#109A8B] transition-colors shadow-lg">
                Start Free Trial
              </Link>
              <Link href="/login" className="px-8 py-4 rounded-lg font-bold text-foreground bg-background border border-border hover:bg-muted transition-colors shadow-sm">
                Book a Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border bg-background pt-20 pb-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Image src="/logo.png" alt="VendorBridge" width={32} height={32} className="rounded-md opacity-90" />
                <span className="font-bold tracking-tight text-xl">VendorBridge</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-8">
                The procurement operating system designed for modern enterprises. Unify your supply chain and accelerate growth.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 inline-flex px-3 py-1.5 rounded-full border border-border">
                <div className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
                All systems operational
              </div>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog'] },
              { title: 'Resources', links: ['Documentation', 'API Reference', 'Blog', 'Guides'] },
              { title: 'Company', links: ['About', 'Contact', 'Careers', 'Partners'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Security', 'Compliance'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold mb-6 text-sm">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} VendorBridge Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                <a key={social} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{social}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
