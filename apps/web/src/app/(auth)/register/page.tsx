'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, ArrowLeft, Building2, User, CheckCircle2, ShieldCheck, Globe, Banknote, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    companyName: '', industry: '', employees: '',
    role: '',
    categories: '', country: '', currency: ''
  });

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Mock Registration
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(6); // Success step
    }, 1500);
  };

  return (
    <div className="flex w-full min-h-screen bg-app-bg text-white font-sans selection:bg-emerald-500/30">
      
      {/* Left Sidebar - Progress */}
      <div className="hidden lg:flex w-80 bg-app-card border-r border-app-border flex-col p-8 relative">
        <Link href="/" className="flex items-center gap-3 mb-16">
          <Image src="/logo.png" alt="VendorBridge" width={32} height={32} className="rounded-md" />
          <span className="font-semibold text-lg tracking-tight">VendorBridge</span>
        </Link>

        <div className="space-y-8 relative">
          <div className="absolute left-3.5 top-2 bottom-6 w-px bg-app-border" />
          
          {[
            { s: 1, title: 'Account Details' },
            { s: 2, title: 'Organization' },
            { s: 3, title: 'Select Role' },
            { s: 4, title: 'Setup Options' },
            { s: 5, title: 'Review & Create' },
          ].map((item) => (
            <div key={item.s} className="flex items-start gap-4 relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${
                step > item.s ? 'bg-emerald-500 text-app-bg' : step === item.s ? 'bg-app-bg border-2 border-emerald-500 text-emerald-500' : 'bg-app-card border border-app-border text-slate-500'
              }`}>
                {step > item.s ? <CheckCircle2 className="w-4 h-4" /> : item.s}
              </div>
              <div className="pt-1">
                <p className={`text-sm font-semibold ${step >= item.s ? 'text-white' : 'text-slate-500'}`}>{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-8 border-t border-app-border">
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">
            <p className="font-semibold mb-1 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Enterprise Security</p>
            <p className="opacity-80">Your data is encrypted in transit and at rest.</p>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-xl mx-auto my-auto">
          
          {/* Mobile Header */}
          <div className="flex lg:hidden items-center justify-between mb-8 pb-4 border-b border-app-border">
            <Image src="/logo.png" alt="VendorBridge" width={28} height={28} className="rounded-md" />
            <span className="text-sm font-medium text-slate-400">Step {step > 5 ? 5 : step} of 5</span>
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Create your account</h2>
              <p className="text-slate-400 mb-8">Enter your personal details to get started.</p>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Full Name</label>
                  <input type="text" value={formData.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="John Doe" className="w-full bg-app-card border border-app-border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Work Email</label>
                  <input type="email" value={formData.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="john@company.com" className="w-full bg-app-card border border-app-border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <input type="password" value={formData.password} onChange={(e) => updateForm('password', e.target.value)} placeholder="••••••••" className="w-full bg-app-card border border-app-border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Organization Details</h2>
              <p className="text-slate-400 mb-8">Tell us about your company.</p>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Company Name</label>
                  <input type="text" value={formData.companyName} onChange={(e) => updateForm('companyName', e.target.value)} placeholder="Acme Corp" className="w-full bg-app-card border border-app-border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Industry</label>
                    <select value={formData.industry} onChange={(e) => updateForm('industry', e.target.value)} className="w-full bg-app-card border border-app-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm appearance-none">
                      <option value="" disabled>Select Industry</option>
                      <option value="tech">Technology</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail</option>
                      <option value="healthcare">Healthcare</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Employees</label>
                    <select value={formData.employees} onChange={(e) => updateForm('employees', e.target.value)} className="w-full bg-app-card border border-app-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm appearance-none">
                      <option value="" disabled>Company Size</option>
                      <option value="1-50">1 - 50</option>
                      <option value="51-200">51 - 200</option>
                      <option value="201-1000">201 - 1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Select your Role</h2>
              <p className="text-slate-400 mb-8">What will you be doing on VendorBridge?</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'ADMIN', title: 'Administrator', icon: ShieldCheck, desc: 'Full system access & workspace setup' },
                  { id: 'PROCUREMENT_OFFICER', title: 'Procurement Officer', icon: Briefcase, desc: 'Manage RFQs, POs, and Vendor Comm.' },
                  { id: 'MANAGER', title: 'Manager / Executive', icon: User, desc: 'Review and approve workflows' },
                  { id: 'VENDOR', title: 'Vendor / Supplier', icon: Building2, desc: 'Submit quotes and track invoices' },
                ].map((role) => (
                  <button
                    key={role.id}
                    onClick={() => updateForm('role', role.id)}
                    className={`p-5 rounded-xl border text-left transition-all group ${
                      formData.role === role.id 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-app-border bg-app-card hover:border-slate-600'
                    }`}
                  >
                    <role.icon className={`w-6 h-6 mb-3 ${formData.role === role.id ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-300'}`} />
                    <h3 className={`font-semibold mb-1 ${formData.role === role.id ? 'text-white' : 'text-slate-300'}`}>{role.title}</h3>
                    <p className={`text-xs ${formData.role === role.id ? 'text-emerald-500/80' : 'text-slate-500'}`}>{role.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Workspace Setup</h2>
              <p className="text-slate-400 mb-8">Configure your regional and procurement settings.</p>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Procurement Categories (Comma separated)</label>
                  <input type="text" value={formData.categories} onChange={(e) => updateForm('categories', e.target.value)} placeholder="e.g. IT, Stationery, Facilities" className="w-full bg-app-card border border-app-border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input type="text" value={formData.country} onChange={(e) => updateForm('country', e.target.value)} placeholder="India" className="w-full bg-app-card border border-app-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Default Currency</label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input type="text" value={formData.currency} onChange={(e) => updateForm('currency', e.target.value)} placeholder="INR" className="w-full bg-app-card border border-app-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Review & Create</h2>
              <p className="text-slate-400 mb-8">Confirm your workspace details.</p>
              
              <div className="bg-app-card border border-app-border rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-app-border pb-4">
                   <p className="text-sm text-slate-400">Account</p>
                   <p className="text-sm font-medium text-white">{formData.name || 'Not provided'} ({formData.email || 'Not provided'})</p>
                </div>
                <div className="flex justify-between items-center border-b border-app-border pb-4">
                   <p className="text-sm text-slate-400">Organization</p>
                   <p className="text-sm font-medium text-white">{formData.companyName || 'Not provided'}</p>
                </div>
                <div className="flex justify-between items-center border-b border-app-border pb-4">
                   <p className="text-sm text-slate-400">Role</p>
                   <p className="text-sm font-medium text-emerald-400">{formData.role || 'Not selected'}</p>
                </div>
                <div className="flex justify-between items-center">
                   <p className="text-sm text-slate-400">Region</p>
                   <p className="text-sm font-medium text-white">{formData.country || 'Not provided'} ({formData.currency || 'Not provided'})</p>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                 <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Workspace Created!</h2>
              <p className="text-slate-400 mb-8">Your VendorBridge environment is ready. We've set up demo data so you can explore.</p>
              <button onClick={() => router.push('/dashboard')} className="bg-emerald-500 text-app-bg px-8 py-3 rounded-lg font-semibold hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                Go to Dashboard
              </button>
            </div>
          )}

          {/* Controls */}
          {step < 6 && (
            <div className="mt-12 flex items-center justify-between pt-6 border-t border-app-border">
              {step > 1 ? (
                <button onClick={handleBack} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div></div> // empty div for flex spacing
              )}
              
              {step < 5 ? (
                <button onClick={handleNext} className="flex items-center gap-2 bg-white text-app-bg px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 bg-emerald-500 text-app-bg px-8 py-2.5 rounded-lg font-semibold hover:bg-emerald-400 transition-colors disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Workspace'}
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
