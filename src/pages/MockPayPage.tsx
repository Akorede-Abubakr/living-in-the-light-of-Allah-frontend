import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, CreditCard, Sparkles } from 'lucide-react';
import { ordersApi } from '../api';
import { Button } from '../components/common/Button';
import { SEO } from '../components/common/SEO';

export const MockPayPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const ref = searchParams.get('ref') || '';
  const orderId = searchParams.get('orderId') || '';
  const amount = searchParams.get('amount') || '19.99';

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthorizePayment = async () => {
    if (!ref) {
      setError('Missing transaction reference.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const res = await ordersApi.verifyOrder(ref);
      if (res.data.success) {
        await Promise.all(['readerMeta', 'readerPage', 'bookMeta', 'readerAccess', 'library', 'myLibrary'].map(key => queryClient.invalidateQueries({ queryKey: [key] })));
        setIsSuccess(true);
      } else {
        setError(res.data.message || 'Payment verification failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 bg-white dark:bg-[#071A17]">
      <SEO title="Paystack Sandbox Checkout" />

      <div className="max-w-md w-full bg-white dark:bg-[#09221D] rounded-2xl border border-[#DDE8E1] dark:border-white/10 shadow-2xl overflow-hidden animate-scaleUp">
        {/* Top Header */}
        <div className="bg-[#077432] dark:bg-[#051814] p-6 text-[#F8F5ED] text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="w-5 h-5 text-[#C6A15B]" />
            <span className="font-bold text-lg tracking-wide">Paystack Checkout</span>
          </div>
          <p className="text-xs opacity-90 font-mono text-[#DDE8E1]">Living in the light of Allah — Sandbox</p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="font-serif font-bold text-2xl text-[#202522] dark:text-white">
                Payment Authorized!
              </h3>
              <p className="text-xs text-[#202522]/80 dark:text-stone-300">
                Transaction reference <strong>{ref}</strong> has been verified. The books have been unlocked in your digital library.
              </p>

              <div className="pt-4 flex flex-col gap-2">
                <Button
                  variant="editorial"
                  size="md"
                  className="w-full"
                  onClick={() => navigate('/library')}
                >
                  Go to My Library
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Order Info */}
              <div className="p-4 bg-stone-50 dark:bg-white/5 rounded-xl border border-[#DDE8E1] dark:border-white/10 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#202522]/70 dark:text-stone-400">Merchant:</span>
                  <span className="font-bold text-[#077432] dark:text-[#34D399]">Living in the light of Allah</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#202522]/70 dark:text-stone-400">Amount Due:</span>
                  <span className="font-mono font-bold text-[#202522] dark:text-white text-sm">${amount} USD</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-ink-500 dark:text-stone-400">Ref:</span>
                  <span className="text-ink-700 dark:text-stone-200">{ref}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs rounded-md">
                  {error}
                </div>
              )}

              {/* Simulation explanation */}
              <div className="flex items-start gap-2.5 text-xs text-ink-600 dark:text-emerald-200 p-3 bg-brand-50/60 dark:bg-emerald-950/30 rounded-lg border border-brand-200/60 dark:border-emerald-800/50">
                <Sparkles className="w-4 h-4 text-[#077432] dark:text-[#34D399] shrink-0 mt-0.5" />
                <p>
                  This is the sandbox payment test window. Clicking "Authorize Test Payment" will simulate Paystack transaction fulfillment and grant book ownership.
                </p>
              </div>

              {/* Action */}
              <Button
                variant="primary"
                size="lg"
                className="w-full py-3 bg-[#0BA4DB] hover:bg-[#0993C5] text-white border-none shadow-md font-semibold"
                onClick={handleAuthorizePayment}
                isLoading={isProcessing}
              >
                <Lock className="w-4 h-4 mr-1.5" />
                Authorize Test Payment (${amount})
              </Button>

              <div className="text-center">
                <Link to="/books" className="text-xs text-ink-500 dark:text-stone-400 hover:text-[#077432] dark:hover:text-[#34D399] underline">
                  Cancel and return to store
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
