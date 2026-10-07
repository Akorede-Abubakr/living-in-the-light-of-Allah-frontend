import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authApi } from '../api';
import { Button } from '../components/common/Button';
import { SEO } from '../components/common/SEO';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await authApi.forgotPassword(email);
      setIsSubmitted(true);
      setMessage(res.data.message);
    } catch {
      setIsSubmitted(true);
      setMessage('Password reset instructions have been generated.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#071A17]">
      <SEO title="Forgot Password" />

      <div className="max-w-md w-full bg-white dark:bg-[#09221D] p-8 sm:p-10 rounded-2xl border border-[#DDE8E1] dark:border-white/10 shadow-xl space-y-6 animate-scaleUp">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl font-bold text-[#202522] dark:text-white pt-2">
            Reset Your Password
          </h2>
          <p className="text-xs text-[#202522]/70 dark:text-stone-300">
            Enter the email address associated with your reader account.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-ink-700 dark:text-stone-300 leading-relaxed">{message}</p>
            <Link to="/login" className="inline-block">
              <Button variant="secondary" size="md">
                Return to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-stone-300 mb-1">
                Email Address
              </label>
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

            <Button type="submit" variant="editorial" size="lg" className="w-full py-3" isLoading={isLoading}>
              Send Reset Link
            </Button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-xs text-ink-600 dark:text-stone-400 hover:text-[#077432] dark:hover:text-[#34D399]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
