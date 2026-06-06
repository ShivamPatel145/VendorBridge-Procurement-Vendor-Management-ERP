'use client';

import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Analytics & Reports</h2>
          <p className="text-sm text-muted-foreground mt-1">System-wide procurement analytics.</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="w-8 h-8 text-indigo-500" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Advanced Analytics Module</h3>
        <p className="text-muted-foreground mt-2 max-w-md">This module provides deep insights into spend analysis, vendor performance over time, and SLA breaches. Scheduled for upcoming release.</p>
      </div>
    </div>
  );
}
