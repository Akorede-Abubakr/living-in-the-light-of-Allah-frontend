import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api';

export const CheckoutSuccessPage: React.FC = () => {
  const [params] = useSearchParams();
  const reference = params.get('reference') || params.get('trxref') || '';
  const client = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['paymentVerification', reference],
    queryFn: () => ordersApi.verifyOrder(reference),
    enabled: !!reference,
    retry: false,
  });
  const order = data?.data.data?.order;
  const complete = data?.data.success && order?.paymentStatus === 'completed' && order.accessGranted;
  useEffect(() => {
    if (complete) {
      for (const key of ['readerMeta', 'readerPage', 'bookMeta', 'readerAccess', 'myLibrary']) {
        void client.invalidateQueries({ queryKey: [key] });
      }
    }
  }, [complete, client]);
  return (
    <main className="max-w-xl mx-auto px-6 py-16 space-y-5 text-center">
      <h1 className="text-2xl font-serif">{complete ? 'Your book is unlocked' : 'Payment confirmation'}</h1>
      {!reference ? <p>Missing payment reference. Open your library to check your purchase.</p>
        : isLoading ? <p>Confirming your payment...</p>
        : complete ? order?.items.map(item => {
          const id = typeof item.book === 'string' ? item.book : item.book._id;
          return <Link key={id} className="block rounded-lg bg-[#077432] text-white px-4 py-3" to={`/read/${id}?page=1`}>Read {item.title}</Link>;
        }) : <div role="status" className="space-y-3">
          <p>{error ? 'We could not confirm your payment yet.' : data?.data.message || 'Payment is still pending.'} You can retry confirmation without paying again.</p>
          <button className="underline" onClick={() => refetch()}>Check payment again</button>
        </div>}
      <Link className="inline-block underline" to="/library">Open my library</Link>
    </main>
  );
};
