import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Book } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { ordersApi } from '../../api';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  onPurchaseSuccess?: () => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  book,
  onPurchaseSuccess,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/books/${book._id}`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const res = await ordersApi.initializeOrder({
        bookIds: [book._id],
        currency: book.currency || 'USD',
      });

      if (res.data.success && res.data.data) {
        const { reference, authorizationUrl } = res.data.data;
        const verifyRes = await ordersApi.verifyOrder(reference);

        if (verifyRes.data.success) {
          setIsSuccess(true);
          if (onPurchaseSuccess) onPurchaseSuccess();
        } else {
          window.location.href = authorizationUrl;
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment initialization failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      {isSuccess ? (
        <div className="text-center py-6 space-y-5 animate-scaleUp">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-bold text-[#202522]">
              Payment Successful!
            </h3>
            <p className="text-sm text-stone-600 max-w-sm mx-auto">
              <strong>{book.title}</strong> is now unlocked and added to your permanent digital library.
            </p>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-white/5 rounded-xl text-xs font-mono text-stone-700 dark:text-stone-300 space-y-1 border border-[#DDE8E1] dark:border-white/10">
            <p>Access Granted: Lifetime Unrestricted</p>
            <p>Format: Interactive Reader + Cloud Sync</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              className="flex-1"
              onClick={() => {
                onClose();
                navigate('/dashboard');
              }}
            >
              Go to My Library
            </Button>
            <Button
              variant="editorial"
              size="md"
              className="flex-1"
              onClick={() => {
                onClose();
                navigate(`/read/${book._id}?page=1`);
              }}
            >
              Start Reading
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[#077432] dark:text-[#34D399] text-xs font-mono font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Digital Checkout</span>
          </div>

          {/* Book Summary Card */}
          <div className="flex gap-4 p-4 bg-stone-50 dark:bg-white/5 rounded-xl border border-[#DDE8E1] dark:border-white/10">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-16 aspect-[3/4] object-cover rounded shadow-sm shrink-0"
            />
            <div className="flex flex-col justify-center">
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#202522] dark:text-white line-clamp-1">
                {book.title}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">by {book.author}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-[#077432] dark:text-[#34D399]">
                  ${book.price.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono uppercase bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                  Full Digital Access
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-xs rounded-md border border-rose-200 dark:border-rose-900">
              {error}
            </div>
          )}

          {/* Value Props */}
          <div className="space-y-2.5 text-xs text-stone-700 dark:text-stone-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#077432] dark:text-[#34D399] shrink-0" />
              <span>Full access to all chapters, pages, and illuminated notes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#077432] dark:text-[#34D399] shrink-0" />
              <span>Kindle-grade reading with paper, sepia, and night modes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#077432] dark:text-[#34D399] shrink-0" />
              <span>Bookmarks and reading progress saved permanently</span>
            </div>
          </div>

          {/* Payment Provider Badge */}
          <div className="flex items-center justify-between p-3 bg-stone-100 dark:bg-white/5 rounded-lg text-xs text-stone-600 dark:text-stone-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#077432] dark:text-[#34D399]" />
              <span>Protected by Paystack & TLS 256-bit Encryption</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-[#202522] dark:text-white">
              Total: ${book.price.toFixed(2)}
            </span>
          </div>

          <Button
            variant="editorial"
            size="lg"
            className="w-full py-3.5 text-base font-semibold shadow-md"
            onClick={handleCheckout}
            isLoading={isProcessing}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {isAuthenticated ? `Complete Purchase ($${book.price.toFixed(2)})` : 'Sign in to Purchase'}
          </Button>
        </div>
      )}
    </Modal>
  );
};
