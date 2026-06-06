'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, FileText, MessageSquareQuote, CheckCircle2,
  ShoppingCart, Receipt, BarChart3, Settings, LogOut, ChevronRight,
  Users, Shield, Network, FolderOpen, PieChart, Briefcase, Inbox, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const allNavItems = [
  // Dashboard is shared but conceptually different for VENDOR
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'] },
  
  // ADMIN SPECIFIC
  { label: 'Users & Roles', href: '/users', icon: Users, roles: ['ADMIN'] },
  { label: 'Organizations', href: '/organizations', icon: Network, roles: ['ADMIN'] },
  { label: 'Audit Logs', href: '/audit', icon: Shield, roles: ['ADMIN'] },
  
  // PROCUREMENT OFFICER
  { label: 'Vendors', href: '/vendors', icon: Building2, roles: ['ADMIN', 'PROCUREMENT_OFFICER'] },
  { label: 'RFQs', href: '/rfqs', icon: FileText, roles: ['ADMIN', 'PROCUREMENT_OFFICER'] },
  { label: 'Quotations', href: '/quotations', icon: MessageSquareQuote, roles: ['ADMIN', 'PROCUREMENT_OFFICER'] },
  { label: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart, roles: ['ADMIN', 'PROCUREMENT_OFFICER'] },
  { label: 'Invoices', href: '/invoices', icon: Receipt, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'FINANCE'] },
  { label: 'Reports', href: '/reports', icon: BarChart3, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'] },
  
  // MANAGER
  { label: 'Approvals', href: '/approvals', icon: CheckCircle2, roles: ['ADMIN', 'MANAGER'] },
  { label: 'Department Spend', href: '/budget', icon: PieChart, roles: ['MANAGER'] },

  // VENDOR
  { label: 'Open RFQs', href: '/vendor-portal/rfqs', icon: Inbox, roles: ['VENDOR'] },
  { label: 'My Quotations', href: '/vendor-portal/quotations', icon: MessageSquareQuote, roles: ['VENDOR'] },
  { label: 'My Orders', href: '/vendor-portal/purchase-orders', icon: ShoppingCart, roles: ['VENDOR'] },
  { label: 'My Invoices', href: '/vendor-portal/invoices', icon: Receipt, roles: ['VENDOR'] },
  { label: 'Company Profile', href: '/vendor-portal/profile', icon: Briefcase, roles: ['VENDOR'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const filteredNav = allNavItems.filter(
    (item) => !user?.role || item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <Image src="/logo.png" alt="VendorBridge" width={32} height={32} className="rounded-lg shadow-sm" />
          <div>
            <p className="text-foreground font-bold text-base leading-none tracking-tight group-hover:text-[#14B8A6] transition-colors">VendorBridge</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Enterprise OS</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Main Menu</p>
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group',
                isActive
                  ? 'bg-[#14B8A6]/10 text-[#14B8A6]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#14B8A6]' : 'text-muted-foreground group-hover:text-foreground')} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3 h-3 text-[#14B8A6]" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-1">
        {user?.role !== 'VENDOR' && (
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors group"
          >
            <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            Workspace Settings
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors group"
        >
          <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-rose-500" />
          Sign Out
        </button>

        {/* User Badge */}
        {user && (
          <div className="mt-4 pt-4 border-t border-border flex items-center gap-3 px-2">
             <div className="w-9 h-9 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center text-[#14B8A6] font-bold text-sm">
                {user.name.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
               <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                 {user.role.replace('_', ' ')}
               </p>
             </div>
          </div>
        )}
      </div>
    </aside>
  );
}
