'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

// Import Role-Based Dashboards
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { ProcurementDashboard } from '@/components/dashboard/ProcurementDashboard';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { VendorDashboard } from '@/components/dashboard/VendorDashboard';

export default function DashboardController() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace('/login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#14B8A6]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {user.role === 'ADMIN' && <AdminDashboard />}
      {user.role === 'PROCUREMENT_OFFICER' && <ProcurementDashboard />}
      {user.role === 'MANAGER' && <ManagerDashboard />}
      {user.role === 'VENDOR' && <VendorDashboard />}
    </div>
  );
}
