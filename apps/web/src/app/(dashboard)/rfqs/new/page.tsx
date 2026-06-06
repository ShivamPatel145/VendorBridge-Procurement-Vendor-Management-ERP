'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, FileText, PackagePlus, Users, CheckCircle2, 
  ArrowRight, Plus, Trash2, Building2, Search 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, title: 'Details', icon: FileText },
  { id: 2, title: 'Line Items', icon: PackagePlus },
  { id: 3, title: 'Vendors', icon: Users },
  { id: 4, title: 'Review', icon: CheckCircle2 },
];

const MOCK_VENDORS = [
  { id: 'v1', name: 'Acme Corp', category: 'IT Hardware', score: 98 },
  { id: 'v2', name: 'GlobalTech Ltd', category: 'Software Services', score: 85 },
  { id: 'v5', name: 'Stark Industries', category: 'R&D', score: 99 },
];

export default function NewRFQPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('IT');
  const [deadline, setDeadline] = useState('');
  const [justification, setJustification] = useState('');
  
  const [items, setItems] = useState([
    { id: 1, name: '', quantity: 1, uom: 'pcs', expectedPrice: '' }
  ]);

  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), name: '', quantity: 1, uom: 'pcs', expectedPrice: '' }]);
  };

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const toggleVendor = (vid: string) => {
    if (selectedVendors.includes(vid)) {
      setSelectedVendors(selectedVendors.filter(id => id !== vid));
    } else {
      setSelectedVendors([...selectedVendors, vid]);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    // Simulate API Call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('RFQ Published Successfully');
    router.push('/rfqs');
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <Link href="/rfqs" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to RFQs
      </Link>
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Create Request for Quotation</h2>
        <p className="text-muted-foreground mt-1">Draft a new sourcing event and invite vendors to bid.</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-border -z-10" />
        {STEPS.map((s, idx) => {
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <div key={s.id} className="flex flex-col items-center gap-2 bg-background px-4">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2",
                isActive ? "bg-[#14B8A6]/10 border-[#14B8A6] text-[#14B8A6]" : 
                isDone ? "bg-[#14B8A6] border-[#14B8A6] text-white" : 
                "bg-card border-border text-muted-foreground"
              )}>
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={cn(
                "text-xs font-bold tracking-wide uppercase",
                isActive ? "text-[#14B8A6]" : isDone ? "text-foreground" : "text-muted-foreground"
              )}>
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8 min-h-[400px]">
        
        {/* STEP 1: DETAILS */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-foreground mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-bold">RFQ Title <span className="text-rose-500">*</span></label>
                <input 
                  type="text" value={title} onChange={e => setTitle(e.target.value)} 
                  placeholder="e.g. Q3 IT Equipment Upgrade" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Department</label>
                <select 
                  value={department} onChange={e => setDepartment(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all"
                >
                  <option>IT</option>
                  <option>Facilities</option>
                  <option>Marketing</option>
                  <option>Operations</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Submission Deadline <span className="text-rose-500">*</span></label>
                <input 
                  type="date" value={deadline} onChange={e => setDeadline(e.target.value)} 
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-bold">Procurement Justification</label>
                <textarea 
                  value={justification} onChange={e => setJustification(e.target.value)} 
                  placeholder="Explain the business need for this request..." rows={3}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LINE ITEMS */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Requested Items</h3>
              <button onClick={handleAddItem} className="flex items-center gap-1.5 text-sm font-bold text-[#14B8A6] hover:text-[#109A8B] transition-colors">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-border bg-background rounded-xl relative group">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Item Name</label>
                    <input 
                      type="text" placeholder="e.g. ThinkPad T14" 
                      className="w-full bg-transparent border-b border-border py-1 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Qty</label>
                    <input 
                      type="number" min="1" defaultValue={item.quantity}
                      className="w-full bg-transparent border-b border-border py-1 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">UOM</label>
                    <select className="w-full bg-transparent border-b border-border py-1 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors">
                      <option>pcs</option><option>kg</option><option>liters</option><option>boxes</option>
                    </select>
                  </div>
                  <div className="w-32 space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Est. Price</label>
                    <input 
                      type="number" placeholder="Optional"
                      className="w-full bg-transparent border-b border-border py-1 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                    />
                  </div>
                  
                  {items.length > 1 && (
                    <button onClick={() => handleRemoveItem(item.id)} className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 p-1.5 rounded-full shadow-sm">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: VENDORS */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-foreground mb-6">Invite Vendors</h3>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" placeholder="Search vendor directory..." 
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all"
              />
            </div>

            <div className="space-y-3">
              {MOCK_VENDORS.map(v => {
                const isSelected = selectedVendors.includes(v.id);
                return (
                  <div 
                    key={v.id} 
                    onClick={() => toggleVendor(v.id)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                      isSelected ? "border-[#14B8A6] bg-[#14B8A6]/5" : "border-border bg-background hover:border-muted-foreground/30"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isSelected ? "bg-[#14B8A6]/20" : "bg-muted")}>
                        <Building2 className={cn("w-5 h-5", isSelected ? "text-[#14B8A6]" : "text-muted-foreground")} />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{v.name}</p>
                        <p className="text-xs text-muted-foreground">{v.category} · {v.score}% Compliance</p>
                      </div>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      isSelected ? "border-[#14B8A6] bg-[#14B8A6] text-white" : "border-muted-foreground/30"
                    )}>
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW */}
        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-foreground mb-6">Review & Publish</h3>
            
            <div className="bg-background border border-border rounded-xl p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Title</p>
                  <p className="font-semibold">{title || 'Untitled RFQ'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Department</p>
                  <p className="font-semibold">{department}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Deadline</p>
                  <p className="font-semibold">{deadline || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Vendors Invited</p>
                  <p className="font-semibold">{selectedVendors.length} Vendors</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-3">Line Items ({items.length})</p>
                <div className="space-y-2">
                  {items.map((i, idx) => (
                    <div key={i.id} className="flex justify-between text-sm bg-muted/30 px-3 py-2 rounded-lg">
                      <span>Item {idx + 1}</span>
                      <span className="font-semibold">{i.quantity} {i.uom}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-4 rounded-xl text-sm flex gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p>Publishing this RFQ will immediately send email invitations to the {selectedVendors.length} selected vendors to submit their quotations.</p>
            </div>
          </div>
        )}

      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <button 
          onClick={() => setStep(s => Math.max(s - 1, 1))}
          className={cn("px-6 py-2.5 rounded-lg font-bold text-sm transition-colors", step === 1 ? "opacity-0 pointer-events-none" : "text-muted-foreground hover:bg-muted hover:text-foreground border border-border")}
        >
          Back
        </button>

        {step < 4 ? (
          <button 
            onClick={() => setStep(s => Math.min(s + 1, 4))}
            className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm text-sm"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button 
            onClick={submit}
            disabled={submitting}
            className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold px-8 py-2.5 rounded-lg transition-colors shadow-sm text-sm disabled:opacity-70"
          >
            {submitting ? 'Publishing RFQ...' : 'Publish RFQ'}
          </button>
        )}
      </div>

    </div>
  );
}
