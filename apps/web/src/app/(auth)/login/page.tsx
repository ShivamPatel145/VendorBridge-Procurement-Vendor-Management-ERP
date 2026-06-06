'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff, Hexagon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

const demoCredentials = [
  { role: 'Admin', email: 'admin@vendorbridge.demo', pass: 'Admin@123' },
  { role: 'Officer', email: 'officer@vendorbridge.demo', pass: 'Officer@123' },
  { role: 'Manager', email: 'manager@vendorbridge.demo', pass: 'Manager@123' },
  { role: 'Vendor', email: 'vendor@vendorbridge.demo', pass: 'Vendor@123' },
];

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginForm) => {
    try {
      const res = await api.post('/auth/login', values);
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'VENDOR') {
        router.push('/vendor-portal/rfqs');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Login failed');
    }
  };

  const handleDemoFill = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
  };

  return (
    <div className="flex w-full h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 relative bg-zinc-900 overflow-hidden items-center justify-center">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/40 via-zinc-900 to-zinc-950" />
        <div className="absolute -left-40 -bottom-40 w-96 h-96 bg-teal-600/20 blur-3xl rounded-full" />
        
        <div className="relative z-10 text-center max-w-lg px-8">
          <div className="mb-8 inline-flex items-center justify-center p-4 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
            <Image src="/logo.png" alt="VendorBridge Logo" width={80} height={80} className="rounded-xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Modern Procurement Management
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Unify your vendors, automate approvals, and gain complete visibility into your organization's spend.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <Image src="/logo.png" alt="VendorBridge" width={40} height={40} className="rounded-lg" />
            <h1 className="font-bold text-xl text-zinc-900 dark:text-white tracking-tight">VendorBridge</h1>
          </div>

          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2 tracking-tight">Welcome back</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">Enter your credentials to access your account.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="name@company.com"
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              />
              {errors.email && <p className="text-rose-500 text-xs">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                <a href="#" className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2.5 pr-10 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-500 text-xs">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-10 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4 text-center">Demo Access</p>
            <div className="grid grid-cols-2 gap-2">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => handleDemoFill(cred.email, cred.pass)}
                  className="px-3 py-2 text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md border border-zinc-200 dark:border-zinc-700/50 transition-colors"
                >
                  {cred.role} Login
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
