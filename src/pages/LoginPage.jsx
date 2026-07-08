import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';
import { useAdminAuth } from '../auth/AdminAuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading, isAuthenticated, isAdmin } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (!loading && isAuthenticated && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [from, isAdmin, isAuthenticated, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { error: authError } = await signIn(email, password);
      if (authError) {
        setError(authError.message || 'Unable to sign in.');
        return;
      }

      navigate(from, { replace: true });
    } catch (submitError) {
      setError(submitError?.message || 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1528] via-[#13213b] to-[#0A111F] px-4 py-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-center mb-8">
          <Link to="/" className="inline-flex">
            <Logo size="lg" variant="light" layout="stacked" />
          </Link>
        </div>

        <div className="mb-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-700 mx-auto">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin Access
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#1B2A4A]">Sign in to Dashboard</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Use your Supabase admin account. Only approved admin emails can access the inquiry workspace.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#29B8C8] focus:bg-white focus:ring-2 focus:ring-[#29B8C8]/15"
                placeholder="admin@yourcompany.com"
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</span>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#29B8C8] focus:bg-white focus:ring-2 focus:ring-[#29B8C8]/15"
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5DC840] to-[#29B8C8] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg transition-all hover:brightness-105 disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign in to dashboard'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Public RFQ submission remains available on the <Link to="/" className="font-semibold text-[#29B8C8]">homepage</Link>.
        </p>
      </motion.div>
    </div>
  );
}