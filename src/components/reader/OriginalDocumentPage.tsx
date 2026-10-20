import React, { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy, type RenderTask } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { apiBaseUrl } from '../../api/config';

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface OriginalDocumentPageProps {
  bookId: string;
  pageNumber: number;
  documentVersion?: string;
  accessibleText?: string;
  prefetchNext?: boolean;
}

export const OriginalDocumentPage: React.FC<OriginalDocumentPageProps> = ({
  bookId,
  pageNumber,
  documentVersion = '',
  accessibleText,
  prefetchNext = false,
}) => {
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [width, setWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new ResizeObserver(entries => setWidth(entries[0]?.contentRect.width || element.clientWidth));
    observer.observe(element);
    setWidth(element.clientWidth);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setDocument(null);
    setLoading(true);
    setError('');
    const token = localStorage.getItem('brightmind_token');
    const loadingTask = getDocument({
      url: `${apiBaseUrl}/reader/${bookId}/document`,
      httpHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
      rangeChunkSize: 128 * 1024,
      disableStream: true,
      disableAutoFetch: true,
      isEvalSupported: false,
    });
    loadingTask.promise.then(pdf => {
      if (cancelled) { void pdf.destroy(); return; }
      setDocument(pdf);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setError('Could not load the original book file. Check your access and retry.');
        setLoading(false);
      }
    });
    return () => { cancelled = true; void loadingTask.destroy(); };
  }, [bookId, documentVersion, attempt]);

  useEffect(() => {
    if (!document || !prefetchNext || pageNumber >= document.numPages) return;
    let cancelled = false;
    void document.getPage(pageNumber + 1).then(page => cancelled ? undefined : page.getOperatorList()).catch(() => {});
    return () => { cancelled = true; };
  }, [document, pageNumber, prefetchNext]);

  useEffect(() => {
    if (!document || !canvas.current || width < 1) return;
    let cancelled = false;
    let task: RenderTask | undefined;
    setRendering(true);
    setError('');
    document.getPage(pageNumber).then(page => {
      if (cancelled || !canvas.current) return;
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: Math.min(width / base.width, 2) });
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const target = canvas.current;
      target.width = Math.ceil(viewport.width * pixelRatio);
      target.height = Math.ceil(viewport.height * pixelRatio);
      target.style.width = `${Math.ceil(viewport.width)}px`;
      target.style.height = `${Math.ceil(viewport.height)}px`;
      const context = target.getContext('2d', { alpha: false });
      if (!context) throw new Error('Canvas is unavailable');
      task = page.render({ canvas: target, canvasContext: context, viewport, transform: [pixelRatio, 0, 0, pixelRatio, 0, 0], background: '#ffffff' });
      return task.promise;
    }).then(() => {
      if (!cancelled) setRendering(false);
    }).catch(() => {
      if (!cancelled) {
        setError('Could not display this page. Please retry.');
        setRendering(false);
      }
    });
    return () => { cancelled = true; task?.cancel(); };
  }, [document, pageNumber, width, attempt]);

  if (error && !document) return <div role="alert" className="p-8 text-center space-y-3"><p>{error}</p><button className="underline" onClick={() => setAttempt(value => value + 1)}>Retry book file</button></div>;
  return <figure className="m-0 bg-white border border-stone-200 shadow-lg" aria-busy={loading || rendering}>
    <div ref={frame} className="relative min-h-[60vh] w-full bg-white grid place-items-start justify-center">
      <canvas ref={canvas} aria-label={`Original document, page ${pageNumber}`} className="block max-w-full h-auto" />
      {(loading || rendering) && <div role="status" className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-sm text-stone-600 shadow">{loading ? 'Loading book file…' : `Loading page ${pageNumber}…`}</div>}
      {error && document && <div role="alert" className="absolute inset-x-4 bottom-4 rounded-xl bg-rose-50 p-4 text-center text-sm text-rose-800 shadow">{error}<button className="ml-2 underline" onClick={() => setAttempt(value => value + 1)}>Retry</button></div>}
    </div>
    {accessibleText && <figcaption className="sr-only">{accessibleText}</figcaption>}
  </figure>;
};
