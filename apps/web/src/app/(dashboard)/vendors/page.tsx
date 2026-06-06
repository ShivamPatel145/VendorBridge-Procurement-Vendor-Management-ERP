'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, Building2, ExternalLink, RefreshCw } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { vendorAPI } from '@/lib/api';
import { toast } from 'sonner';

interface Vendor {
  id: string;
  companyName: string;
  contactPerson?: string;
  email: string;
  category?: string;
  gstNo?: string;
  contactNo?: string;
  status: string;
}

// Fallback demo data if API is empty
const DEMO_VENDORS: Vendor[] = [
  { id: 'v1', companyName: 'Acme Corp', email: 'contact@acmecorp.com', category: 'IT Hardware', gstNo: '27AABCU9603R1ZJ', contactNo: '+1 555-0100', status: 'APPROVED' },
  { id: 'v2', companyName: 'GlobalTech Ltd', email: 'sales@globaltech.co', category: 'Software Services', gstNo: '27AABCU9604R1ZK', contactNo: '+1 555-0101', status: 'PENDING' },
  { id: 'v3', companyName: 'Office World Pvt Ltd', email: 'info@officeworld.in', category: 'Stationery', gstNo: '27AABCU9605R1ZL', contactNo: '+1 555-0102', status: 'APPROVED' },
  { id: 'v4', companyName: 'CleanPro Services', email: 'support@cleanpro.com', category: 'Facilities', gstNo: '27AABCU9606R1ZM', contactNo: '+1 555-0103', status: 'REJECTED' },
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await vendorAPI.list();
      const data = res.data?.data ?? res.data;
      const list = Array.isArray(data) ? data : [];
      setVendors(list.length > 0 ? list : DEMO_VENDORS);
    } catch {
      setVendors(DEMO_VENDORS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  const filteredVendors = vendors.filter(v =>
    (v.companyName ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.category ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Vendor Directory</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage, onboard, and evaluate your supply chain.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchVendors} className="p-2.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Invite Vendor
          </button>
        </div>
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
                <th className="px-6 py-4">Vendor Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">GST No.</th>
                <th className="px-6 py-4">Contact No.</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-4 bg-muted rounded animate-pulse w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-[#14B8A6]" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{vendor.companyName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{vendor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                      {vendor.category || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-muted-foreground">{vendor.gstNo || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-foreground">{vendor.contactNo || vendor.contactPerson || '—'}</span>
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
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
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
