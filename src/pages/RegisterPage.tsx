import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Lock, Mail, User as UserIcon, ArrowRight, Eye, EyeOff, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { SEO } from '../components/common/SEO';

export const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { success: showSuccessToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });
      showSuccessToast('Account created successfully');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#071A17]">
      <SEO title="Create an Account" />

      <div className="max-w-md w-full bg-white dark:bg-[#09221D] p-8 sm:p-10 rounded-2xl border border-[#DDE8E1] dark:border-white/10 shadow-xl space-y-6 animate-scaleUp">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl font-bold text-[#202522] dark:text-white pt-2">
            Create Seeker Account
          </h2>
          <p className="text-xs text-[#202522]/70 dark:text-stone-300">
            Join the digital sanctuary, acquire sacred manuscripts, and begin your study journey.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name & Last Name (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-stone-300 mb-1">
                First Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ibrahim"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 dark:bg-white/5 border border-stone-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-[#077432] text-ink-900 dark:text-white"
                />
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 dark:text-stone-300 mb-1">
                Last Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Farooq"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 dark:bg-white/5 border border-stone-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-[#077432] text-ink-900 dark:text-white"
                />
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-stone-300 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 dark:bg-white/5 border border-stone-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-[#077432] text-ink-900 dark:text-white"
              />
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

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
            <label className="block text-xs font-semibold text-ink-700 dark:text-stone-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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

          <div>
            <label className="block text-xs font-semibold text-ink-700 dark:text-stone-300 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="w-full pl-9 pr-10 py-2 text-sm bg-stone-50 dark:bg-white/5 border border-stone-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-[#077432] text-ink-900 dark:text-white"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors focus:outline-none"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="editorial" size="lg" className="w-full py-3" isLoading={isLoading}>
            Create Account
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <p className="text-center text-xs text-ink-500 dark:text-stone-400 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#077432] dark:text-[#34D399] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
