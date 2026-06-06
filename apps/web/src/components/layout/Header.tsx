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
    <header className="h-16 bg-app-bg/80 backdrop-blur-md border-b border-app-border flex items-center px-6 gap-4 shrink-0 sticky top-0 z-10">
      {/* Page title */}
      <h1 className="font-semibold text-lg flex-1 tracking-tight text-foreground">{title}</h1>

      {/* Search */}
      <div className="relative hidden md:block group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#14B8A6] transition-colors" />
        <input
          type="text"
          placeholder="Search everywhere..."
          className="bg-card border border-border rounded-md pl-9 pr-4 py-1.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] w-64 transition-all shadow-sm"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted border border-border rounded">⌘</kbd>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted border border-border rounded">K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 border-l border-border pl-4 ml-2">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#14B8A6] rounded-full border border-background"></span>
        </button>
      </div>
    </header>
  );
}
