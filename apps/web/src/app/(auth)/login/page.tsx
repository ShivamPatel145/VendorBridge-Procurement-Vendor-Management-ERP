'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff, ShieldCheck, BarChart3, Building2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

const demoCredentials = [
  { role: 'Admin', email: 'admin@vendorbridge.demo', pass: 'Admin@123', desc: 'Full system access & settings' },
  { role: 'Procurement Officer', email: 'officer@vendorbridge.demo', pass: 'Officer@123', desc: 'Manage RFQs & POs' },
  { role: 'Manager', email: 'manager@vendorbridge.demo', pass: 'Manager@123', desc: 'Approve workflows' },
  { role: 'Vendor', email: 'vendor@vendorbridge.demo', pass: 'Vendor@123', desc: 'Submit quotations' },
];

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginForm) => {
    // Mock login since backend is down
    setIsDemoLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const roleStr = values.email.split('@')[0].toUpperCase();
      let role = 'PROCUREMENT_OFFICER';
      if (roleStr.includes('ADMIN')) role = 'ADMIN';
      else if (roleStr.includes('MANAGER')) role = 'MANAGER';
      else if (roleStr.includes('VENDOR')) role = 'VENDOR';

      const mockUser = {
        id: 'user-mock-123',
        email: values.email,
        name: values.email.split('@')[0],
        role: role,
        organizationId: 'org-123'
      };

      setAuth(mockUser, 'mock-jwt-token-12345');
      toast.success(`Welcome back, ${mockUser.name}!`);
      
      if (role === 'VENDOR') {
        router.push('/vendor-portal/rfqs');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error('Login failed');
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleDemoFill = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
    toast.success('Demo credentials loaded. Click Sign In.');
  };

  return (
    <div className="flex w-full min-h-screen bg-app-bg text-white font-sans selection:bg-emerald-500/30">
      
      {/* Left Side - Brand Story & Metrics */}
      <div className="hidden lg:flex flex-1 relative bg-app-bg border-r border-app-border overflow-hidden flex-col">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />
        <div className="absolute -left-40 top-1/4 w-96 h-96 bg-teal-900/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="p-12 relative z-10 flex-1 flex flex-col justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image src="/logo.png" alt="VendorBridge Logo" width={32} height={32} className="rounded-md shadow-sm" />
              <span className="font-semibold text-xl tracking-tight group-hover:text-emerald-400 transition-colors">VendorBridge</span>
            </Link>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold tracking-tight leading-[1.1] mb-6">
              Modern Procurement Management.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-12">
              Unify your vendors, automate approvals, and gain complete visibility into your organization's spend.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Actionable Spend Analytics</h3>
                  <p className="text-sm text-slate-400 mt-1">Real-time visibility into ₹12.4Cr+ managed spend across all active vendors and open POs.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">98% Approval Efficiency</h3>
                  <p className="text-sm text-slate-400 mt-1">Multi-stage digital sign-offs based on organizational spend limits. Zero delays.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Animated Workflow Preview (Miniature) */}
          <div className="mt-12 p-4 rounded-xl border border-app-border bg-app-card/50 backdrop-blur-sm max-w-sm">
             <div className="flex items-center gap-3 text-sm text-slate-300 font-medium mb-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               Live Workflow Processing
             </div>
             <div className="space-y-2">
                <div className="h-8 bg-app-bg border border-app-border rounded px-3 flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 className="w-3 h-3 text-emerald-500"/> RFQ Created (Stationery Q3)</div>
                <div className="h-8 bg-app-bg border border-app-border rounded px-3 flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 className="w-3 h-3 text-emerald-500"/> Vendors Invited (3)</div>
                <div className="h-8 bg-emerald-500/10 border border-emerald-500/30 rounded px-3 flex items-center justify-between text-xs text-emerald-400 font-medium"><span>Awaiting Approvals...</span><Loader2 className="w-3 h-3 animate-spin"/></div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col p-8 sm:p-12 relative overflow-y-auto bg-app-bg">
        <div className="w-full max-w-md mx-auto my-auto">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <Image src="/logo.png" alt="VendorBridge" width={32} height={32} className="rounded-md" />
            <h1 className="font-semibold text-xl tracking-tight">VendorBridge</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Sign in to your account</h2>
            <p className="text-slate-400 text-sm">Enter your credentials to access the ERP dashboard.</p>
          </div>

          {/* SSO Options */}
          <button className="w-full bg-app-card border border-app-border hover:bg-app-border/50 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm mb-6 text-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-app-border"></div></div>
            <div className="relative flex justify-center text-xs"><span className="bg-app-bg px-2 text-slate-500 uppercase tracking-wider font-medium">Or continue with</span></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Email address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="name@company.com"
                className="w-full bg-app-card border border-app-border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
              />
              {errors.email && <p className="text-rose-500 text-xs">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <a href="#" className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-app-card border border-app-border rounded-lg px-4 py-2.5 pr-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-500 text-xs">{errors.password.message}</p>}
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-app-border bg-app-card text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-app-bg" />
              <label htmlFor="remember" className="ml-2 block text-sm text-slate-400">Remember me for 30 days</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || isDemoLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-app-bg font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] mt-2"
            >
              {(isSubmitting || isDemoLoading) && <Loader2 className="w-4 h-4 animate-spin" />}
              {(isSubmitting || isDemoLoading) ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">
              Create workspace
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-10 pt-8 border-t border-app-border">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Hackathon Demo Access
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => handleDemoFill(cred.email, cred.pass)}
                  className="text-left px-4 py-3 bg-app-card border border-app-border hover:border-emerald-500/30 rounded-lg transition-all group"
                >
                  <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{cred.role}</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">{cred.desc}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
