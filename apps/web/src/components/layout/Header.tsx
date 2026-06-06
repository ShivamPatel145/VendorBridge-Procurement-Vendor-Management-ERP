'use client';

import { Bell, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/lib/utils';
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
    <header className="h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6 gap-4 shrink-0 transition-colors duration-200 sticky top-0 z-10">
      {/* Page title */}
      <h1 className="text-zinc-900 dark:text-zinc-100 font-semibold text-lg flex-1 tracking-tight">{title}</h1>

      {/* Search */}
      <div className="relative hidden md:block group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
        <input
          type="text"
          placeholder="Search everywhere..."
          className="bg-zinc-100 dark:bg-zinc-900 border border-transparent dark:border-zinc-800 rounded-md pl-9 pr-4 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-950 w-64 transition-all shadow-sm"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded">⌘</kbd>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded">K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800 pl-4 ml-2">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-zinc-950"></span>
        </button>
      </div>
    </header>
  );
}
