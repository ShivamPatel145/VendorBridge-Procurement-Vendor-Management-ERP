'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, MoreHorizontal, Building2, ExternalLink } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils';

// Mock Data
const MOCK_VENDORS = [
  { id: 'v1', name: 'Acme Corp', email: 'contact@acmecorp.com', category: 'IT Hardware', score: 98, status: 'APPROVED' },
  { id: 'v2', name: 'GlobalTech Ltd', email: 'sales@globaltech.co', category: 'Software Services', score: 85, status: 'PENDING' },
  { id: 'v3', name: 'Office World Pvt Ltd', email: 'info@officeworld.in', category: 'Stationery', score: 92, status: 'APPROVED' },
  { id: 'v4', name: 'CleanPro Services', email: 'support@cleanpro.com', category: 'Facilities', score: 76, status: 'REJECTED' },
  { id: 'v5', name: 'Stark Industries', email: 'defense@stark.com', category: 'R&D', score: 99, status: 'APPROVED' },
];

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVendors = MOCK_VENDORS.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Vendor Directory</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage, onboard, and evaluate your supply chain.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Invite Vendor
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search vendors by name or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-sm shrink-0">
          <Filter className="w-4 h-4 text-muted-foreground" /> Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Compliance Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-[#14B8A6]" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{vendor.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{vendor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                      {vendor.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full", vendor.score >= 90 ? "bg-emerald-500" : vendor.score >= 80 ? "bg-amber-500" : "bg-rose-500")} 
                          style={{ width: `${vendor.score}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-foreground">{vendor.score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={vendor.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/vendors/${vendor.id}`}
                        className="p-2 text-muted-foreground hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 rounded-md transition-colors"
                        title="View Profile"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No vendors found matching your search.
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
