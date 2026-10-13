import React, { useEffect, useState } from 'react';
import api from '../../api/client';

export const OriginalDocumentPage: React.FC<{ bookId: string; pageNumber: number; accessibleText?: string }> = ({ bookId, pageNumber, accessibleText }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl = '';
    setUrl(''); setError('');
    api.get(`/reader/${bookId}/page/${pageNumber}/original`, { responseType: 'blob', signal: controller.signal, timeout: 60000 })
      .then(response => {
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(response.data);
        setUrl(objectUrl);
      }).catch(async failure => {
        let message = 'Could not load the original page. Please retry.';
        try {
          const body = failure.response?.data;
          const detail = body instanceof Blob ? JSON.parse(await body.text()) : body;
          if (typeof detail?.message === 'string') message = detail.message;
        } catch { /* Keep the fallback for network or non-JSON errors. */ }
        if (!controller.signal.aborted) setError(message);
      });
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [bookId, pageNumber, attempt]);
  if (error) return <div role="alert" className="p-8 text-center space-y-3"><p>{error}</p><button className="underline" onClick={() => setAttempt(value => value + 1)}>Retry page</button></div>;
  if (!url) return <div role="status" className="bg-white text-stone-600 aspect-[3/4] grid place-items-center border shadow-sm">Loading original page...</div>;
  return <figure className="m-0 bg-white border border-stone-200 shadow-lg">
    <img src={url} alt={`Original document, page ${pageNumber}`} className="block w-full h-auto" onError={() => setError('Could not display this page. Please retry.')} />
    {accessibleText && <figcaption className="sr-only">{accessibleText}</figcaption>}
  </figure>;
};
