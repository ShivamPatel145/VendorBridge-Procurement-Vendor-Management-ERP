'use client';

import { useState } from 'react';
import { Search, Filter, Shield, Clock, Terminal, User, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const MOCK_LOGS = [
  { id: 'log-1001', action: 'USER_LOGIN', user: 'admin@vendorbridge.com', ip: '192.168.1.100', timestamp: '2025-06-06T14:22:00Z', details: 'Successful authentication via SSO' },
  { id: 'log-1002', action: 'PO_GENERATED', user: 'system_worker', ip: 'internal', timestamp: '2025-06-06T14:15:00Z', details: 'Auto-generated PO-2025-001 for Acme Corp' },
  { id: 'log-1003', action: 'MANAGER_APPROVAL', user: 'm.chen@vendorbridge.com', ip: '10.0.0.55', timestamp: '2025-06-06T14:10:00Z', details: 'Approved RFQ-002 Award for IT Equipment' },
  { id: 'log-1004', action: 'QUOTATION_SUBMITTED', user: 'jane@acmecorp.com', ip: '203.0.113.42', timestamp: '2025-06-06T10:05:00Z', details: 'Submitted bid Q-8821 for RFQ-002' },
  { id: 'log-1005', action: 'RFQ_PUBLISHED', user: 's.jenkins@vendorbridge.com', ip: '192.168.1.105', timestamp: '2025-06-05T09:30:00Z', details: 'Published RFQ-002: IT Equipment Procurement' },
  { id: 'log-1006', action: 'VENDOR_ONBOARDED', user: 'admin@vendorbridge.com', ip: '192.168.1.100', timestamp: '2025-06-04T16:45:00Z', details: 'Activated vendor account for Acme Corp' },
];

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_LOGS.filter(l => 
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-500" /> System Audit Logs
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Immutable, chronological record of all system events for SOX compliance.</p>
        </div>
        <button className="flex items-center gap-2 bg-card border border-border hover:bg-muted text-foreground font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm">
          <FileText className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search logs by action, user, or details..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all shadow-sm font-mono"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-sm shrink-0">
          <Filter className="w-4 h-4 text-muted-foreground" /> Event Type
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Timestamp (UTC)</th>
                <th className="px-6 py-4">Event Action</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-[13px]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 19)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-foreground">{log.user}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3 h-3" /> {log.ip}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground truncate max-w-xs" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
              
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-sans">
                    No audit logs matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
