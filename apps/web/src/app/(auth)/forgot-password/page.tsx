'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Moon, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
    toast.success('Password reset link sent!');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-[#14B8A6]/15 flex items-center justify-center mb-8 ring-[12px] ring-[#14B8A6]/5">
          <CheckCircle2 className="w-12 h-12 text-[#14B8A6]" />
        </div>
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Check Your Email</h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10 leading-relaxed">
          We've sent a password reset link to <strong className="text-foreground">{email}</strong>. 
          Please check your inbox and follow the instructions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="px-8 py-4 rounded-xl font-bold text-white bg-[#14B8A6] hover:bg-[#109A8B] transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Login
          </Link>
          <button
            onClick={() => setSuccess(false)}
            className="px-8 py-4 rounded-xl font-bold text-foreground bg-card border border-border hover:bg-muted transition-colors"
          >
            Resend Email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] bg-card border-r border-border flex-col justify-center p-12 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_0%_0%,rgba(20,184,166,0.08),transparent)] pointer-events-none" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-20 inline-flex group">
            <Image src="/logo.png" alt="VendorBridge" width={32} height={32} className="rounded-md" />
            <span className="font-bold text-xl tracking-tight group-hover:text-[#14B8A6] transition-colors">VendorBridge</span>
          </Link>
          
          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] mb-6 max-w-lg">
            Secure Account Recovery
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
            Enter your email address and we'll send you a link to reset your password and regain access to your workspace.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
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
          <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Back to login
          </Link>
          <ThemeToggle />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[440px]">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Reset your password</h2>
              <p className="text-muted-foreground text-base">Enter your email and we'll send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6] transition-all shadow-sm"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#14B8A6] hover:bg-[#109A8B] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/register" className="text-[#14B8A6] font-bold hover:underline">Create workspace</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
