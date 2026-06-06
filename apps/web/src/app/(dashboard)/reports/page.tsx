'use client';

import { BarChart3, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import { formatCurrency } from '@/lib/utils';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';

// Wireframe data
const stats = [
  { title: 'total spend', value: '12.4 L', change: 0, icon: BarChart3, color: 'indigo' as const, valueColor: 'text-indigo-600 dark:text-indigo-400' },
  { title: 'Active vendors', value: 28, change: 0, icon: Users, color: 'emerald' as const, valueColor: 'text-emerald-500' },
  { title: 'PO Fulfillment', value: '94%', change: 0, icon: CheckCircle2, color: 'amber' as const, valueColor: 'text-amber-500' },
  { title: 'overdue invoices', value: 3, change: 0, icon: AlertCircle, color: 'rose' as const, valueColor: 'text-rose-500' },
];

const spendByCategory = [
  { category: 'IT Hardware', spend: '₹4.8L', percent: 80, color: 'bg-blue-500' },
  { category: 'Furniture', spend: '₹3.2L', percent: 65, color: 'bg-emerald-500' },
  { category: 'Stationery', spend: '₹2.1L', percent: 40, color: 'bg-amber-500' },
  { category: 'Logistics', spend: '₹2.3L', percent: 45, color: 'bg-rose-500' },
];

const topVendors = [
  { vendor: 'TechCore Ltd', spend: 420000, pos: 6 },
  { vendor: 'Infra Supplies', spend: 310000, pos: 4 },
  { vendor: 'FastLog', spend: 190000, pos: 3 },
];

const monthlyTrend = [
  { month: 'Dec', value: 40 },
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 50 },
  { month: 'Mar', value: 85 },
  { month: 'Apr', value: 75 },
  { month: 'May', value: 100 },
];

export default function ReportsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">Reports & analytics</h2>
          <p className="text-lg text-muted-foreground mt-1">Procurement Insights- may 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-card border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-sm">
            May 2025
          </button>
          <button className="px-5 py-2.5 bg-card border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-sm">
            Export
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.title} className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
            <span className={`text-4xl font-bold ${s.valueColor}`}>{s.value}</span>
            <span className="text-sm font-semibold text-muted-foreground">{s.title}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Spend By Category */}
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Spend By Category</h3>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            {spendByCategory.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-foreground">
                  <span>{item.category}</span>
                  <span>{item.spend}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          
          {/* Top Vendors By Spend */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Top Vendors By Spend</h3>
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-bold">
                  <tr>
                    <th className="px-6 py-4">Vendor</th>
                    <th className="px-6 py-4 text-right">Spend (₹)</th>
                    <th className="px-6 py-4 text-center">POs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-semibold">
                  {topVendors.map((v) => (
                    <tr key={v.vendor} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-foreground">{v.vendor}</td>
                      <td className="px-6 py-4 text-right text-muted-foreground">{v.spend.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center text-muted-foreground">{v.pos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Trend */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Monthly Trend</h3>
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a', fontWeight: 600 }} dy={10} />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]} 
                      fill="#93c5fd" // Default light blue
                      activeBar={{ fill: '#1d4ed8' }} // Dark blue on hover
                    >
                      {
                        monthlyTrend.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === monthlyTrend.length - 1 ? '#1d4ed8' : '#93c5fd'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
