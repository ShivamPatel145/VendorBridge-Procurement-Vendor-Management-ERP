'use client';

import { FileText } from 'lucide-react';

export default function VendorRFQsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Open Invitations</h2>
          <p className="text-sm text-muted-foreground mt-1">RFQs you have been invited to bid on.</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-[#14B8A6]/10 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-[#14B8A6]" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No pending invitations</h3>
        <p className="text-muted-foreground mt-2 max-w-md">You currently have no open RFQ invitations to respond to. You will be notified via email when a buyer invites you to an event.</p>
      </div>
    </div>
  );
}
