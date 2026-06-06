'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  FileText,
  MessageSquareQuote,
  CheckCircle2,
  ShoppingCart,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'] },
  { label: 'Vendors', href: '/vendors', icon: Building2, roles: ['ADMIN', 'PROCUREMENT_OFFICER'] },
  { label: 'RFQs', href: '/rfqs', icon: FileText, roles: ['ADMIN', 'PROCUREMENT_OFFICER'] },
  { label: 'Quotations', href: '/quotations', icon: MessageSquareQuote, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'] },
  { label: 'Approvals', href: '/approvals', icon: CheckCircle2, roles: ['ADMIN', 'MANAGER'] },
  { label: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'] },
  { label: 'Invoices', href: '/invoices', icon: Receipt, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'] },
  { label: 'Reports', href: '/reports', icon: BarChart3, roles: ['ADMIN', 'PROCUREMENT_OFFICER'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const filteredNav = navItems.filter(
    (item) => !user?.role || item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shrink-0 transition-colors duration-200">
      {/* Logo */}
      <div className="p-5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <Image src="/logo.png" alt="VendorBridge" width={32} height={32} className="rounded-lg shadow-sm" />
          <div>
            <p className="text-zinc-900 dark:text-white font-semibold text-base leading-none tracking-tight">VendorBridge</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 mt-4">Menu</p>
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group',
                isActive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              )}
            >
              <item.icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300')} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
        >
          <Settings className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors group"
        >
          <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-rose-600 dark:group-hover:text-rose-400" />
          Sign out
        </button>

        {/* User info */}
        {user && (
          <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-3 px-2">
             <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-medium text-xs">
                {user.name.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{user.name}</p>
               <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.role.replace('_', ' ')}</p>
             </div>
          </div>
        )}
      </div>
    </aside>
  );
}
