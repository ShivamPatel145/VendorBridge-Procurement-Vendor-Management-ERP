'use client';

import { useState } from 'react';
import { Search, Filter, Building2, MapPin, MoreHorizontal, Globe } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';

const MOCK_ORGS = [
  { id: 'org-01', name: 'VendorBridge Parent HQ', type: 'INTERNAL', location: 'San Francisco, CA', taxId: 'US-987654321', status: 'ACTIVE' },
  { id: 'org-02', name: 'Acme Corp', type: 'VENDOR', location: 'Austin, TX', taxId: 'US-123456789', status: 'ACTIVE' },
  { id: 'org-03', name: 'GlobalTech Ltd', type: 'VENDOR', location: 'London, UK', taxId: 'GB-112233445', status: 'PENDING' },
  { id: 'org-04', name: 'Stark Industries', type: 'VENDOR', location: 'New York, NY', taxId: 'US-998877665', status: 'ACTIVE' },
  { id: 'org-05', name: 'VendorBridge EMEA', type: 'INTERNAL', location: 'Berlin, DE', taxId: 'DE-554433221', status: 'ACTIVE' },
];

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_ORGS.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Organizations</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage internal entities and external vendor organizations.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm">
          <Building2 className="w-4 h-4" /> Add Entity
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search organizations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-sm shrink-0">
          <Filter className="w-4 h-4 text-muted-foreground" /> Entity Type
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Organization Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Tax ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((org) => (
                <tr key={org.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-indigo-500" />
                      </div>
                      <p className="font-bold text-foreground">{org.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-500/10 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                        {org.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" /> {org.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {org.taxId}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={org.status} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-xs font-semibold text-foreground border border-border px-3 py-1.5 rounded bg-background hover:bg-muted transition-colors">
                        Manage
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
