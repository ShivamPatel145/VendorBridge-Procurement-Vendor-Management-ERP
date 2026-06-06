'use client';

import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Workspace Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage system configurations.</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-slate-500/10 rounded-full flex items-center justify-center mb-4">
          <Settings className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-bold text-foreground">System Configurations</h3>
        <p className="text-muted-foreground mt-2 max-w-md">Global ERP settings, notification preferences, and API webhooks configuration are locked for standard demo access.</p>
      </div>
    </div>
  );
}
