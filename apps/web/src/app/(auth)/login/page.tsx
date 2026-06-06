'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Eye, EyeOff, Sun, Moon, ShieldCheck, Activity, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { useLogin } from '@/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

const demoUsers = [
  { role: 'Admin', email: 'admin@vendorbridge.demo', pass: 'Demo@1234' },
  { role: 'Procurement', email: 'officer@vendorbridge.demo', pass: 'Demo@1234' },
  { role: 'Manager', email: 'manager@vendorbridge.demo', pass: 'Demo@1234' },
  { role: 'Vendor', email: 'vendor@vendorbridge.demo', pass: 'Demo@1234' },
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

export default function LoginPage() {
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginForm) => {
    login.mutate(values as { email: string; password: string });
  };

  const fillDemo = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
    toast.info('Demo credentials filled. Click Sign In.');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      
      {/* ── LEFT PANEL (Brand Story) ── */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] bg-card border-r border-border flex-col justify-between p-12 relative overflow-hidden shrink-0">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_0%_0%,rgba(20,184,166,0.08),transparent)] pointer-events-none" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-20 inline-flex group">
            <Image src="/logo.png" alt="VendorBridge" width={32} height={32} className="rounded-md" />
            <span className="font-bold text-xl tracking-tight group-hover:text-[#14B8A6] transition-colors">VendorBridge</span>
          </Link>
          
          {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/20 text-[#14B8A6] text-xs font-semibold mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
            Procurement Operating System
          </div> */}
          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] mb-6 max-w-lg">
            Modern Procurement, Managed Together.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
            Unify vendors, automate approvals, and gain complete visibility into your organization's spend — all from one platform.
          </p>
        </div>

        {/* Feature Highlights / Metrics */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Secure & Compliant</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Enterprise-grade security with immutable audit trails for every PO and RFQ.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-[#14B8A6]" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Real-time Spend Analytics</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Track over ₹12.4Cr+ in active organizational spend instantly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (Auth Form) ── */}
      <div className="flex-1 flex flex-col relative">
        {/* Mobile Top Navigation */}
        <div className="lg:hidden flex items-center justify-between p-6 pb-0">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="VendorBridge" width={28} height={28} className="rounded-md" />
            <span className="font-bold text-lg tracking-tight">VendorBridge</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:block absolute top-8 left-8 z-10">
          <Link href="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
        <div className="hidden lg:flex absolute top-8 right-8 z-10 items-center gap-4">
          <Link href="/register" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Create account
          </Link>
          <ThemeToggle />
        </div>

        {/* Form Container - Centered */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[440px]">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Sign in to workspace</h2>
            <p className="text-muted-foreground text-base">Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold">Work email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                className="w-full bg-card border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all shadow-sm"
              />
              {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold">Password</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-[#14B8A6] hover:text-[#109A8B] transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3.5 pr-12 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all shadow-sm"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full flex items-center justify-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
            >
              {login.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {login.isPending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#14B8A6] font-bold hover:underline">Create workspace</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Hackathon Demo Access
            </p>
            <div className="grid grid-cols-2 gap-3">
              {demoUsers.map(d => (
                <button
                  key={d.role}
                  onClick={() => fillDemo(d.email, d.pass)}
                  className="text-left px-4 py-3.5 bg-card border border-border hover:border-[#14B8A6]/50 hover:bg-[#14B8A6]/5 rounded-xl transition-all group shadow-sm"
                >
                  <p className="text-sm font-bold text-foreground group-hover:text-[#14B8A6] transition-colors">{d.role}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{d.email}</p>
                </button>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
