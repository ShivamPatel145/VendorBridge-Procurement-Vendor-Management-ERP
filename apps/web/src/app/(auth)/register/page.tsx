'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2, ArrowRight, ArrowLeft, Sun, Moon,
  Building2, User, ShieldCheck, Briefcase, Globe, Banknote,
  Check, CheckCircle2, Activity, Zap
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRegister } from '@/hooks/useAuth';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, title: 'Your Account' },
  { id: 2, title: 'Organization' },
  { id: 3, title: 'Your Role' },
  { id: 4, title: 'Preferences' },
  { id: 5, title: 'Confirm' },
];

const ROLES = [
  { id: 'ADMIN', title: 'Administrator', icon: ShieldCheck, desc: 'Full system access & workspace setup', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-200 dark:border-indigo-500/30' },
  { id: 'PROCUREMENT_OFFICER', title: 'Procurement Officer', icon: Briefcase, desc: 'Create & manage RFQs and Purchase Orders', color: 'text-[#14B8A6]', bg: 'bg-teal-50 dark:bg-teal-500/10', border: 'border-teal-200 dark:border-teal-500/30' },
  { id: 'MANAGER', title: 'Manager / Executive', icon: User, desc: 'Review, approve and get spend insights', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/30' },
  { id: 'VENDOR', title: 'Vendor / Supplier', icon: Building2, desc: 'Submit quotes and track your invoices', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', border: 'border-purple-200 dark:border-purple-500/30' },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-9 h-9 rounded-lg flex items-center justify-center border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-foreground">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-card border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all shadow-sm";
const selectCls = inputCls + " cursor-pointer";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', photo: null as File | null,
    company: '', industry: '', size: '', additionalInfo: '',
    role: '',
    categories: '', country: 'India', currency: 'INR',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(p => ({ ...p, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const next = () => setStep(s => Math.min(s + 1, 5));
  const back = () => setStep(s => Math.max(s - 1, 1));

  const submit = async () => {
    try {
      setSubmitting(true);
      
      // Validate required fields
      if (!form.name || !form.email || !form.password) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      // Submit registration to API
      await registerMutation.mutateAsync({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role || 'PROCUREMENT_OFFICER',
        phone: form.phone,
        companyName: form.company,
        contactPerson: form.name,
        address: `${form.country}`,
      } as any);

      // On success, show success message and redirect
      setDone(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      setSubmitting(false);
      // Error toast is handled by the hook
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-[#14B8A6]/15 flex items-center justify-center mb-8 ring-[12px] ring-[#14B8A6]/5">
          <CheckCircle2 className="w-12 h-12 text-[#14B8A6]" />
        </div>
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Account Created!</h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10 leading-relaxed">
          Welcome, <strong className="text-foreground">{form.name || 'there'}</strong>! Your account has been created successfully. Redirecting to login...
        </p>
        <button
          onClick={() => router.push('/login')}
          className="bg-[#14B8A6] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#109A8B] transition-colors shadow-lg flex items-center gap-3"
        >
          Go to Login <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      
      {/* ── LEFT SIDEBAR (Progress & Benefits) ── */}
      <aside className="hidden lg:flex lg:w-[38%] xl:w-[35%] bg-card border-r border-border flex-col p-12 shrink-0 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.06),transparent)] pointer-events-none" />
        
        <div className="relative z-10 flex-1 flex flex-col">
          <Link href="/" className="flex items-center gap-3 mb-16 inline-flex group">
            <Image src="/logo.png" alt="VendorBridge" width={32} height={32} className="rounded-md" />
            <span className="font-bold text-xl tracking-tight group-hover:text-[#14B8A6] transition-colors">VendorBridge</span>
          </Link>

          <div className="mb-12">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">Setup Progress</p>
            <nav className="space-y-2 relative">
              <div className="absolute left-3.5 top-2 bottom-6 w-px bg-border -z-10" />
              {STEPS.map((s) => {
                const state = step > s.id ? 'done' : step === s.id ? 'active' : 'idle';
                return (
                  <div key={s.id} className={cn(
                    "flex items-center gap-4 px-3 py-3 rounded-xl transition-all",
                    state === 'active' ? 'bg-[#14B8A6]/10 text-[#14B8A6]' : 'text-muted-foreground'
                  )}>
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors shadow-sm",
                      state === 'done' ? 'bg-[#14B8A6] text-white ring-2 ring-[#14B8A6]/20' :
                      state === 'active' ? 'bg-background border-2 border-[#14B8A6] text-[#14B8A6]' :
                      'bg-card border border-border text-muted-foreground'
                    )}>
                      {state === 'done' ? <Check className="w-3.5 h-3.5" /> : s.id}
                    </div>
                    <span className={cn("text-sm font-bold", state === 'active' ? "text-[#14B8A6]" : state === 'done' ? "text-foreground" : "text-muted-foreground")}>{s.title}</span>
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto space-y-6 pt-10 border-t border-border">
            <h3 className="text-sm font-bold text-foreground">Why teams switch to VendorBridge</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">Source up to 4x faster with intelligent RFQ automation and side-by-side matrices.</p>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">Ensure 100% compliance with immutable digital approval chains.</p>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* ── RIGHT MAIN (Form Area) ── */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Header / Theme Toggle */}
        <header className="h-20 w-full flex items-center justify-between px-8 shrink-0 relative">
          {/* Mobile Header */}
          <Link href="/" className="flex lg:hidden items-center gap-2.5">
            <Image src="/logo.png" alt="VendorBridge" width={28} height={28} className="rounded-md" />
            <span className="font-bold text-lg tracking-tight">VendorBridge</span>
          </Link>
          
          {/* Desktop - Left side */}
          <div className="hidden lg:block">
            <Link href="/" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </div>
          
          {/* Desktop - Right side */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              Already have an account?
            </Link>
            <ThemeToggle />
          </div>
          
          {/* Mobile - Right side */}
          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        </header>

        {/* Progress bar (Mobile only) */}
        <div className="h-1 bg-border lg:hidden w-full shrink-0">
          <div
            className="h-full bg-[#14B8A6] transition-all duration-500"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center overflow-y-auto px-6 py-10 lg:py-16">
          <div className="w-full max-w-[540px]">
            {/* Mobile step indicator */}
            <div className="flex lg:hidden items-center justify-between mb-8">
              <span className="text-sm text-[#14B8A6] font-bold">{STEPS[step - 1].title}</span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Step {step} / 5</span>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="mb-8 flex flex-col items-center sm:items-start text-center sm:text-left">
                  {/* Photo Upload Area */}
                  <label className="w-24 h-24 rounded-full bg-muted/50 border-2 border-dashed border-border hover:border-[#14B8A6] flex flex-col items-center justify-center cursor-pointer transition-colors mb-6 mx-auto sm:mx-0 group overflow-hidden relative">
                    {photoPreview ? (
                      <Image src={photoPreview} alt="Profile preview" width={96} height={96} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <User className="w-8 h-8 text-muted-foreground group-hover:text-[#14B8A6] mb-1" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Photo</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                  </label>
                  
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Create your account</h2>
                  <p className="text-muted-foreground text-base">Enter your personal details to get started.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <input type="text" value={form.name} onChange={set('name')} placeholder="John Doe" className={inputCls} autoFocus />
                  </Field>
                  <Field label="Phone Number">
                    <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" className={inputCls} />
                  </Field>
                </div>
                <Field label="Work Email">
                  <input type="email" value={form.email} onChange={set('email')} placeholder="john@company.com" className={inputCls} />
                </Field>
                <Field label="Password">
                  <input type="password" value={form.password} onChange={set('password')} placeholder="Min. 8 characters" className={inputCls} />
                </Field>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Organization Details</h2>
                  <p className="text-muted-foreground text-base">Tell us about your company.</p>
                </div>
                <Field label="Company Name">
                  <input type="text" value={form.company} onChange={set('company')} placeholder="Acme Corp" className={inputCls} autoFocus />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Industry">
                    <select value={form.industry} onChange={set('industry')} className={selectCls}>
                      <option value="" disabled>Select your industry</option>
                      <option>Technology</option>
                      <option>Manufacturing</option>
                      <option>Retail</option>
                      <option>Healthcare</option>
                      <option>Finance</option>
                      <option>Education</option>
                      <option>Other</option>
                    </select>
                  </Field>
                  <Field label="Company Size">
                    <select value={form.size} onChange={set('size')} className={selectCls}>
                      <option value="" disabled>Select company size</option>
                      <option>1 – 10</option>
                      <option>11 – 50</option>
                      <option>51 – 200</option>
                      <option>201 – 1,000</option>
                      <option>1,000+</option>
                    </select>
                  </Field>
                </div>
                <Field label="Additional Information">
                  <textarea 
                    value={form.additionalInfo} 
                    onChange={(e) => setForm(p => ({ ...p, additionalInfo: e.target.value }))}
                    placeholder="Tell us about your procurement needs..." 
                    rows={3}
                    className={cn(inputCls, "resize-none")} 
                  />
                </Field>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Select Your Role</h2>
                  <p className="text-muted-foreground text-base">What best describes your job function?</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ROLES.map((r) => {
                    const active = form.role === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setForm(p => ({ ...p, role: r.id }))}
                        className={cn(
                          "text-left p-6 rounded-2xl border-2 transition-all shadow-sm",
                          active ? `${r.bg} ${r.border} ring-1 ring-inset ring-${r.border.split('-')[1]}-500/20` : "border-border bg-card hover:border-muted-foreground/30"
                        )}
                      >
                        <r.icon className={cn("w-7 h-7 mb-4", active ? r.color : "text-muted-foreground")} />
                        <p className={cn("font-bold text-base mb-1.5", active ? r.color : "text-foreground")}>{r.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Workspace Preferences</h2>
                  <p className="text-muted-foreground text-base">Configure your regional settings.</p>
                </div>
                <Field label="Procurement Categories (comma-separated)">
                  <input type="text" value={form.categories} onChange={set('categories')} placeholder="e.g. IT, Stationery, Facilities" className={inputCls} autoFocus />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Country">
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <input type="text" value={form.country} onChange={set('country')} placeholder="India" className={inputCls + " pl-11"} />
                    </div>
                  </Field>
                  <Field label="Default Currency">
                    <div className="relative">
                      <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <input type="text" value={form.currency} onChange={set('currency')} placeholder="INR" className={inputCls + " pl-11"} />
                    </div>
                  </Field>
                </div>
              </div>
            )}

            {/* STEP 5 — Review */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Review & Create</h2>
                  <p className="text-muted-foreground text-base">Confirm your workspace details before creating.</p>
                </div>
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border">
                  {/* Profile Photo Preview */}
                  {photoPreview && (
                    <div className="flex items-center justify-between px-6 py-4">
                      <span className="text-sm font-semibold text-muted-foreground">Profile Photo</span>
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#14B8A6]">
                        <Image src={photoPreview} alt="Profile" width={48} height={48} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                  {[
                    { label: 'Name', val: form.name || '—' },
                    { label: 'Email', val: form.email || '—' },
                    { label: 'Phone', val: form.phone || '—' },
                    { label: 'Company', val: form.company || '—' },
                    { label: 'Industry', val: form.industry || '—' },
                    { label: 'Role', val: ROLES.find(r => r.id === form.role)?.title || '—', highlight: true },
                    { label: 'Country', val: form.country || '—' },
                    { label: 'Currency', val: form.currency || '—' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between px-6 py-4">
                      <span className="text-sm font-semibold text-muted-foreground">{row.label}</span>
                      <span className={cn("text-sm font-bold", row.highlight ? 'text-[#14B8A6]' : 'text-foreground')}>{row.val}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  By creating a workspace you agree to VendorBridge's{' '}
                  <a href="#" className="text-[#14B8A6] hover:underline">Terms of Service</a> and{' '}
                  <a href="#" className="text-[#14B8A6] hover:underline">Privacy Policy</a>.
                </p>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
              <button
                onClick={back}
                disabled={step === 1}
                className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {step < 5 ? (
                <button
                  onClick={next}
                  className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-sm"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] disabled:opacity-60 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-sm"
                >
                  {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {submitting ? 'Creating Workspace…' : 'Create Workspace'}
                </button>
              )}
            </div>

            {/* Mobile login link fallback */}
            {step === 1 && (
              <p className="lg:hidden text-center text-sm font-bold text-muted-foreground mt-8">
                Already have an account?{' '}
                <Link href="/login" className="text-[#14B8A6] hover:underline">Sign in</Link>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
