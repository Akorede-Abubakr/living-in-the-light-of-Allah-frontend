import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Lock, Mail, ArrowRight, UserCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { SEO } from '../components/common/SEO';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { success: showSuccessToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({ email, password });
      showSuccessToast('Login successfully');
      navigate(redirect);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#071A17]">
      <SEO title="Sign In" />

      <div className="max-w-md w-full bg-white dark:bg-[#09221D] p-8 sm:p-10 rounded-2xl border border-[#DDE8E1] dark:border-white/10 shadow-xl space-y-6 animate-scaleUp">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl font-bold text-[#202522] dark:text-white pt-2">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-[#202522]/70 dark:text-stone-300">
            Access your purchased manuscripts, bookmarks, and reading history.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-stone-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 dark:bg-white/5 border border-stone-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-[#077432] text-ink-900 dark:text-white"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-ink-700 dark:text-stone-300">Password</label>
              <Link to="/forgot-password" className="text-xs text-[#077432] dark:text-[#34D399] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 text-sm bg-stone-50 dark:bg-white/5 border border-stone-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-[#077432] text-ink-900 dark:text-white"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="editorial" size="lg" className="w-full py-3" isLoading={isLoading}>
            Sign In
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <p className="text-center text-xs text-ink-500 dark:text-stone-400 pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-[#077432] dark:text-[#34D399] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
