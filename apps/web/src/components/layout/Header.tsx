'use client';

import { Bell, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/vendors': 'Vendors',
  '/rfqs': 'RFQs',
  '/quotations': 'Quotations',
  '/approvals': 'Approvals',
  '/purchase-orders': 'Purchase Orders',
  '/invoices': 'Invoices',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();
  const pathname = usePathname();

  const title = Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] ?? 'VendorBridge';

  return (
    <header className="h-16 bg-app-bg/80 backdrop-blur-md border-b border-app-border flex items-center px-6 gap-4 shrink-0 sticky top-0 z-10 text-white">
      {/* Page title */}
      <h1 className="font-semibold text-lg flex-1 tracking-tight">{title}</h1>

      {/* Search */}
      <div className="relative hidden md:block group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
        <input
          type="text"
          placeholder="Search everywhere..."
          className="bg-app-card border border-app-border rounded-md pl-9 pr-4 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-64 transition-all shadow-sm"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-app-bg border border-app-border rounded">⌘</kbd>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-app-bg border border-app-border rounded">K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 border-l border-app-border pl-4 ml-2">
        {/* Theme toggle (Decorative since we force dark mode for the premium feel, but functional if enabled) */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:text-white hover:bg-app-card transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:text-white hover:bg-app-card transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border border-app-bg"></span>
        </button>
      </div>
    </header>
  );
}
