import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; className: string }> = {
  // Vendor
  PENDING:            { label: 'Pending',          className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' },
  APPROVED:           { label: 'Approved',         className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
  REJECTED:           { label: 'Rejected',         className: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' },
  SUSPENDED:          { label: 'Suspended',        className: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/20' },
  // RFQ
  DRAFT:              { label: 'Draft',            className: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/20' },
  PUBLISHED:          { label: 'Published',        className: 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border-teal-200 dark:border-teal-500/20' },
  CLOSED:             { label: 'Closed',           className: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/20' },
  EVALUATING:         { label: 'Evaluating',       className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' },
  AWARDED:            { label: 'Awarded',          className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
  CANCELLED:          { label: 'Cancelled',        className: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' },
  // Quotation
  SUBMITTED:          { label: 'Submitted',        className: 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border-teal-200 dark:border-teal-500/20' },
  UNDER_REVIEW:       { label: 'Under Review',     className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' },
  ACCEPTED:           { label: 'Accepted',         className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
  // Approval
  REVISION_REQUESTED: { label: 'Needs Revision',  className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' },
  // PO
  SENT:               { label: 'Sent',            className: 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border-teal-200 dark:border-teal-500/20' },
  ACKNOWLEDGED:       { label: 'Acknowledged',    className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' },
  COMPLETED:          { label: 'Completed',       className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
  // Invoice
  PAID:               { label: 'Paid',            className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/20' };
  return (
    <span
      className={cn(
        'inline-flex items-center border rounded-md font-medium tracking-tight',
        config.className,
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1'
      )}
    >
      {config.label}
    </span>
  );
}
