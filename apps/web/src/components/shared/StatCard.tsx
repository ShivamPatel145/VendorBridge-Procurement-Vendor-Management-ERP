import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color?: 'emerald' | 'teal' | 'indigo' | 'amber' | 'rose' | 'zinc';
}

const colorMap = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-500/10', icon: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/20' },
  teal:    { bg: 'bg-teal-100 dark:bg-teal-500/10',       icon: 'text-teal-600 dark:text-teal-400',       border: 'border-teal-200 dark:border-teal-500/20' },
  indigo:  { bg: 'bg-indigo-100 dark:bg-indigo-500/10',   icon: 'text-indigo-600 dark:text-indigo-400',   border: 'border-indigo-200 dark:border-indigo-500/20' },
  amber:   { bg: 'bg-amber-100 dark:bg-amber-500/10',     icon: 'text-amber-600 dark:text-amber-400',     border: 'border-amber-200 dark:border-amber-500/20' },
  rose:    { bg: 'bg-rose-100 dark:bg-rose-500/10',       icon: 'text-rose-600 dark:text-rose-400',       border: 'border-rose-200 dark:border-rose-500/20' },
  zinc:    { bg: 'bg-zinc-100 dark:bg-zinc-500/10',       icon: 'text-zinc-600 dark:text-zinc-400',       border: 'border-zinc-200 dark:border-zinc-500/20' },
};

export default function StatCard({ title, value, change, icon: Icon, color = 'emerald' }: StatCardProps) {
  const c = colorMap[color] || colorMap.zinc;
  return (
    <div className={cn('bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex items-start justify-between shadow-sm transition-shadow hover:shadow-md min-h-[120px]', c.border)}>
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium truncate">{title}</p>
        <p className="text-zinc-900 dark:text-white text-2xl font-bold mt-1 tracking-tight truncate">{value}</p>
        {change !== undefined && (
          <div className={cn('flex items-center gap-1 text-xs mt-2 font-medium', change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
            {change >= 0 ? <TrendingUp className="w-3.5 h-3.5 shrink-0" /> : <TrendingDown className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate">{Math.abs(change)}% vs last month</span>
          </div>
        )}
      </div>
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', c.bg)}>
        <Icon className={cn('w-5 h-5', c.icon)} />
      </div>
    </div>
  );
}
