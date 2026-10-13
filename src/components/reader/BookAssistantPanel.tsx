import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronDown, Languages, Loader2, Mic, RotateCcw, Send, Sparkles, History, Plus, X, Paperclip } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChatLanguage } from '../../api/chat.api';
import { BookAction, BookChapter, BookConversation, BookTurn, bookAiApi } from '../../api/book-ai.api';
import { MAX_AUDIO_BYTES, SpeechLanguage, transcribeAudio, transcriptionError } from '../../api/ai.api';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

const languages: { value: ChatLanguage; label: string }[] = [
  { value: 'en', label: 'English' }, { value: 'yo', label: 'Yoruba' },
  { value: 'ha', label: 'Hausa' }, { value: 'ig', label: 'Igbo' },
];
const speechLanguages: { value: SpeechLanguage; label: string; chat: ChatLanguage }[] = [
  { value: 'en-NG', label: 'English', chat: 'en' }, { value: 'yo', label: 'Yoruba', chat: 'yo' },
  { value: 'ha', label: 'Hausa', chat: 'ha' }, { value: 'ig', label: 'Igbo', chat: 'ig' },
];
const apiError = (error: any) => error?.response?.data?.message || error?.message || 'The book assistant could not complete that request.';
const turnError = (code: string) => ({
  ungrounded_response: 'The previous response had invalid citation formatting. Retry this request with the updated assistant.',
  ai_connection_unavailable: 'The inference service could not be reached. Retry this saved request when it is available.',
  ai_timeout: 'The model took too long. Retry to continue from saved progress.',
  no_evidence: 'No matching passage was found. Try book-wide search or ask about a specific passage.',
  conversation_stale: 'The book was updated. Start a new conversation.',
  context_too_long: 'The supplied context exceeded the model limit. Start a new conversation with a more specific question.',
} as Record<string, string>)[code] || `This request stopped (${code || 'book_ai_failed'}). Retry to continue from saved progress.`;
const newRequestId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

interface Props {
  initiallyExpanded?: boolean;
  bookId: string;
  isAuthenticated: boolean;
  hasFullAccess: boolean;
  pageNumber: number;
  chapterTitle: string;
  currentChapterKey?: string;
  theme: 'paper' | 'sepia' | 'dark';
  onGoToPage: (page: number) => void;
}

export const BookAssistantPanel: React.FC<Props> = ({ bookId, isAuthenticated, hasFullAccess, pageNumber,
  chapterTitle, currentChapterKey, theme, onGoToPage, initiallyExpanded = false }) => {
  const queryClient = useQueryClient();
  const recorder = useAudioRecorder();
  const fileInput = useRef<HTMLInputElement>(null);
  const request = useRef<AbortController | null>(null);
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [conversationId, setConversationId] = useState('');
  const [responseLanguage, setResponseLanguage] = useState<ChatLanguage>('en');
  const [inputLanguage, setInputLanguage] = useState<ChatLanguage>('en');
  const [chapterKey, setChapterKey] = useState('');
  const [question, setQuestion] = useState('');
  const [currentPageOnly, setCurrentPageOnly] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState<SpeechLanguage>('en-NG');
  const [working, setWorking] = useState(false);
  const [activeTurnId, setActiveTurnId] = useState('');
  const [activeTurn, setActiveTurn] = useState<BookTurn | null>(null);
  const [progress, setProgress] = useState<BookTurn['progress']>(null);
  const [error, setError] = useState('');
  const [toolbar, setToolbar] = useState<'tools' | 'languages' | 'history' | null>(null);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [toolAction, setToolAction] = useState<BookAction>('summarize_book');
  const [submittedQuestion, setSubmittedQuestion] = useState('');
  const messageList = useRef<HTMLDivElement>(null);
  const followMessages = useRef(true);

  const enabled = expanded && isAuthenticated && hasFullAccess;
  const context = useQuery({ queryKey: ['bookAiContext', bookId], queryFn: () => bookAiApi.context(bookId), enabled });
  const conversations = useQuery({ queryKey: ['bookAiConversations', bookId], queryFn: () => bookAiApi.conversations(bookId), enabled });
  const conversation = useQuery({
    queryKey: ['bookAiConversation', bookId, conversationId],
    queryFn: () => bookAiApi.conversation(bookId, conversationId),
    enabled: enabled && !!conversationId,
  });
  const chapters: BookChapter[] = context.data?.chapters || [];
  const turns = conversation.data?.turns || [];
  const pendingTurn = activeTurn || turns.find(turn => turn.status === 'pending');
  const visibleTurns = activeTurn
    ? turns.some(turn => turn.id === activeTurn.id)
      ? turns.map(turn => turn.id === activeTurn.id ? activeTurn : turn)
      : [...turns, activeTurn]
    : turns;

  useEffect(() => { followMessages.current = true; }, [conversationId]);
  useEffect(() => {
    const list = messageList.current;
    if (list && followMessages.current) list.scrollTop = list.scrollHeight;
  }, [conversationId, turns, activeTurn, submittedQuestion, working, error, expanded]);

  useEffect(() => {
    setConversationId(''); setActiveTurnId(''); setActiveTurn(null); setProgress(null); setError('');
  }, [bookId]);
  useEffect(() => {
    if (!chapterKey && chapters.length) setChapterKey(currentChapterKey && chapters.some(ch => ch.key === currentChapterKey)
      ? currentChapterKey : chapters[0].key);
  }, [chapters, chapterKey, currentChapterKey]);
  useEffect(() => {
    if (!conversationId && conversations.data?.length) setConversationId(conversations.data[0]._id);
  }, [conversationId, conversations.data]);
  useEffect(() => () => { request.current?.abort(); recorder.reset(); }, [recorder.reset]);

  const ensureConversation = async () => {
    if (conversationId) return conversationId;
    const existing = conversations.data?.[0] || (await bookAiApi.conversations(bookId))[0];
    const selected: BookConversation = existing || await bookAiApi.createConversation(bookId);
    setConversationId(selected._id);
    await queryClient.invalidateQueries({ queryKey: ['bookAiConversations', bookId] });
    return selected._id;
  };

  const runSteps = async (conversationKey: string, turn: BookTurn) => {
    setActiveTurnId(turn.id);
    let current = turn;
    setActiveTurn(current);
    setProgress(current.progress);
    for (let count = 0; current.status === 'pending' && count < 5000; count++) {
      if (request.current?.signal.aborted) return;
      try { current = await bookAiApi.step(bookId, conversationKey, turn.id); }
      catch (cause: any) {
        setActiveTurn({ ...current, status: 'failed', errorCode: cause.response?.data?.error?.code || 'book_ai_failed' });
        throw cause;
      }
      setActiveTurn(current);
      setProgress(current.progress);
      if (current.status === 'failed') throw new Error(turnError(current.errorCode));
    }
    if (current.status === 'pending') throw new Error('This summary is still in progress. Select Resume to continue.');
    await queryClient.invalidateQueries({ queryKey: ['bookAiConversation', bookId, conversationKey] });
    setActiveTurnId(''); setActiveTurn(null); setProgress(null);
  };

  const begin = async (action: BookAction, text = question, passage = '') => {
    if (working || request.current) return;
    followMessages.current = true;
    setToolbar(null);
    setSubmittedQuestion(text || ({ summarize_book: 'Give me a book overview', summarize_detailed: 'Give me a detailed summary', summarize_lessons: 'What are the key lessons?', summarize_chapter: 'Summarize this chapter' } as Record<string, string>)[action] || 'Explain this passage');
    setError(''); setWorking(true);
    const controller = new AbortController(); request.current = controller;
    try {
      const conversationKey = await ensureConversation();
      await bookAiApi.updatePreferences(bookId, conversationKey, { inputLanguage, responseLanguage, chapterKey });
      const turn = await bookAiApi.createTurn(bookId, conversationKey, {
        requestId: newRequestId(), action, question: text, inputLanguage, responseLanguage,
        chapterKey: action === 'summarize_chapter' ? chapterKey : '',
        ...((currentPageOnly || action === 'explain') ? { readerPage: pageNumber } : {}), ...(passage ? { passage } : {}),
      });
      setQuestion('');
      setSubmittedQuestion('');
      await runSteps(conversationKey, turn);
      await queryClient.invalidateQueries({ queryKey: ['bookAiConversations', bookId] });
    } catch (cause) {
      if (!controller.signal.aborted) setError(apiError(cause));
    } finally {
      if (request.current === controller) request.current = null;
      setWorking(false);
      setSubmittedQuestion('');
      void queryClient.invalidateQueries({ queryKey: ['bookAiConversation', bookId] });
    }
  };

  const retryTurn = async (turn: BookTurn) => {
    if (!conversationId || working) return;
    setError(''); setWorking(true);
    const controller = new AbortController(); request.current = controller;
    try { await runSteps(conversationId, { ...turn, status: 'pending' }); }
    catch (cause) { if (!controller.signal.aborted) setError(apiError(cause)); }
    finally {
      if (request.current === controller) request.current = null;
      setWorking(false);
      void queryClient.invalidateQueries({ queryKey: ['bookAiConversation', bookId, conversationId] });
    }
  };

  const resume = async () => {
    if (!conversationId || !pendingTurn || working) return;
    setError(''); setWorking(true);
    const controller = new AbortController(); request.current = controller;
    try {
      const current = pendingTurn;
      if (current.status !== 'pending') throw new Error('There is no pending request to resume.');
      setActiveTurnId(current.id);
      await runSteps(conversationId, current);
    } catch (cause) { if (!controller.signal.aborted) setError(apiError(cause)); }
    finally { if (request.current === controller) request.current = null; setWorking(false); }
  };

  const createNewConversation = async () => {
    setError('');
    try {
      const created = await bookAiApi.createConversation(bookId);
      setConversationId(created._id); setActiveTurnId(''); setActiveTurn(null); setProgress(null);
      await queryClient.invalidateQueries({ queryKey: ['bookAiConversations', bookId] });
    } catch (cause) { setError(apiError(cause)); }
  };

  const transcribe = async () => {
    if (!recorder.audio || working) return;
    setError(''); setWorking(true);
    const controller = new AbortController(); request.current = controller;
    try {
      const result = await transcribeAudio(recorder.audio, speechLanguage, controller.signal);
      const spoken = speechLanguages.find(language => language.value === result.language);
      if (!spoken) throw new Error('The transcription language did not match the selected language.');
      setInputLanguage(spoken.chat); setQuestion(result.transcript);
      setError('Transcription ready. Choose the response language, then send it to the book assistant.');
      recorder.reset();
    } catch (cause) { if (!controller.signal.aborted) setError(transcriptionError(cause).message); }
    finally { if (request.current === controller) request.current = null; setWorking(false); }
  };

  const selectedText = () => window.getSelection()?.toString().trim().slice(0, 1200) || '';
  const hasSelection = !!selectedText();
  const dark = theme === 'dark';
  const card = dark ? 'bg-[#0C2922] border-white/10 text-[#F8F5ED]' : 'bg-white border-emerald-900/10 text-[#202522]';
  const muted = dark ? 'text-stone-300' : 'text-stone-600';
  const field = `${dark ? 'bg-[#071A17] border-white/15 text-white' : 'bg-[#F8FAF9] border-[#DDE8E1] text-[#202522]'} w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#077432] disabled:opacity-60`;

  const navButton = (name: NonNullable<typeof toolbar>) => `inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${toolbar === name ? 'bg-emerald-700 text-white' : dark ? 'text-stone-200 hover:bg-white/10' : 'text-stone-600 hover:bg-emerald-50'}`;
  const actionLabel: Record<string, string> = { summarize_book: 'Book overview', summarize_detailed: 'Detailed summary', summarize_lessons: 'Key lessons', summarize_chapter: 'Chapter summary', explain: 'Explain selected text' };
  const progressLabel = progress ? `${progress.phase === 'map' ? 'Reading sections' : progress.phase === 'reduce' ? 'Combining summaries' : 'Finishing'} (${progress.completed}/${progress.total})` : 'Thinking about your book...';

  return <section className={`mx-auto w-full overflow-hidden rounded-2xl border shadow-sm ${card}`} aria-label="LightBridge book assistant">
    {!initiallyExpanded && <button type="button" onClick={() => setExpanded(value => !value)} aria-expanded={expanded} className="flex w-full items-center justify-between gap-3 p-4 text-left">
      <span className="flex items-center gap-2"><Sparkles size={18} /><strong>LightBridge AI</strong></span>
      <ChevronDown size={18} className={expanded ? 'rotate-180' : ''} />
    </button>}
    {expanded && (!isAuthenticated ? <p className="p-5">Sign in to use the book assistant.</p>
      : !hasFullAccess ? <p className="p-5">Purchase this book to ask questions about its full text.</p>
      : context.isLoading ? <p role="status" className="flex items-center gap-2 p-5"><Loader2 className="animate-spin" size={16} />Loading book assistant...</p>
      : context.isError ? <div role="alert" className="p-5 text-sm"><p>{apiError(context.error)}</p><button type="button" className="mt-2 underline" onClick={() => void context.refetch()}>Retry</button></div>
      : <div className="flex min-h-0 flex-col" style={{ height: 'min(680px, calc(100dvh - 12rem))' }}>
        <nav aria-label="Book assistant options" className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-inherit px-2 py-2">
          {(['tools', 'languages', 'history'] as const).map(name => {
            const Icon = { tools: BookOpen, languages: Languages, history: History }[name];
            return <button key={name} type="button" className={navButton(name)} aria-expanded={toolbar === name} aria-controls={`assistant-options-${bookId}`} onClick={() => setToolbar(toolbar === name ? null : name)}><Icon size={15} />{{ tools: 'Book tools', languages: 'Languages', history: 'History' }[name]}</button>;
          })}
          <button type="button" title="New conversation" aria-label="New conversation" disabled={working} onClick={() => { setToolbar(null); void createNewConversation(); }} className="ml-auto shrink-0 rounded-lg p-2 hover:bg-emerald-500/10 disabled:opacity-40"><Plus size={18} /></button>
        </nav>

        {toolbar && <div id={`assistant-options-${bookId}`} className={`relative max-h-44 shrink-0 overflow-y-auto border-b border-inherit p-3 pr-10 ${dark ? 'bg-white/5' : 'bg-stone-50'}`}>
          <button type="button" aria-label="Close options" onClick={() => setToolbar(null)} className="absolute right-2 top-2 rounded p-1.5 hover:bg-emerald-500/10"><X size={15} /></button>
          {toolbar === 'tools' && <div className="flex flex-wrap items-end gap-2">
            <label className="min-w-40 flex-1 text-xs">Action<select aria-label="Book action" className={`${field} mt-1 !py-2`} value={toolAction} disabled={working} onChange={event => setToolAction(event.target.value as BookAction)}>{Object.entries(actionLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            {toolAction === 'summarize_chapter' && <label className="min-w-36 flex-1 text-xs">Chapter<select className={`${field} mt-1 !py-2`} value={chapterKey} disabled={working || !chapters.length} onChange={event => setChapterKey(event.target.value)}>{chapters.map(chapter => <option key={chapter.key} value={chapter.key}>{chapter.title}</option>)}</select></label>}
            <button type="button" disabled={working || (toolAction === 'summarize_chapter' && !chapterKey) || (toolAction === 'explain' && !hasSelection)} onClick={() => void begin(toolAction, toolAction === 'explain' ? 'Explain this passage.' : '', toolAction === 'explain' ? selectedText() : '')} className="rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-40">Run</button>
            {toolAction === 'explain' && !hasSelection && <p className={`w-full text-xs ${muted}`}>Select readable text from a passage first.</p>}
          </div>}
          {toolbar === 'languages' && <div className="grid grid-cols-2 gap-3">
            <label className="text-xs">Your message<select className={`${field} mt-1 !py-2`} value={inputLanguage} disabled={working} onChange={event => setInputLanguage(event.target.value as ChatLanguage)}>{languages.map(language => <option key={language.value} value={language.value}>{language.label}</option>)}</select></label>
            <label className="text-xs">AI response<select className={`${field} mt-1 !py-2`} value={responseLanguage} disabled={working} onChange={event => setResponseLanguage(event.target.value as ChatLanguage)}>{languages.map(language => <option key={language.value} value={language.value}>{language.label}</option>)}</select></label>
          </div>}
          {toolbar === 'history' && <label className="block text-xs">Conversation<select className={`${field} mt-1 !py-2`} value={conversationId} disabled={working} onChange={event => { setConversationId(event.target.value); setActiveTurnId(''); setActiveTurn(null); setError(''); setProgress(null); setToolbar(null); }}><option value="">Choose a conversation</option>{(conversations.data || []).map(item => <option key={item._id} value={item._id}>{item.title || 'Book conversation'} · {new Date(item.updatedAt).toLocaleDateString()}</option>)}</select></label>}

        </div>}
        <input ref={fileInput} type="file" accept="audio/webm,audio/ogg,audio/wav,audio/wave,audio/x-wav" className="hidden" onChange={event => { const file = event.target.files?.[0]; if (file && file.size <= MAX_AUDIO_BYTES) recorder.chooseFile(file); else if (file) setError('The recording exceeds the upload size limit.'); event.currentTarget.value = ''; }} />

        <div className={`flex shrink-0 items-center justify-between gap-2 px-4 py-2 text-[11px] ${muted}`}><span className="truncate">{context.data?.title} · Page {pageNumber}</span><span className="shrink-0">{languages.find(language => language.value === responseLanguage)?.label}</span></div>
        <div ref={messageList} onScroll={event => { const el = event.currentTarget; followMessages.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80; }} role="log" aria-label="Book conversation" aria-live="polite" aria-relevant="additions text" className={`min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5 ${dark ? 'bg-black/10' : 'bg-[#F5F8F6]'}`}>
          {conversation.isLoading && <p className={`text-center text-xs ${muted}`}>Loading conversation...</p>}
          {conversation.isError && <p role="alert" className="text-xs">Could not load conversation history. <button type="button" className="underline" onClick={() => void conversation.refetch()}>Retry</button></p>}
          {!visibleTurns.length && !working && !conversation.isLoading && <div className="flex h-full min-h-28 flex-col items-center justify-center gap-3 text-center"><Sparkles className="text-emerald-600" size={28} /><h3 className="font-serif text-lg">What would you like to know?</h3><p className={`max-w-xs text-sm ${muted}`}>Ask about this book, or choose a summary from Book tools.</p></div>}
          {visibleTurns.map(turn => <div key={turn.id} className="space-y-3">
            <div className="flex justify-end"><article aria-label="Your message" className="max-w-[88%] rounded-2xl rounded-br-sm bg-[#077432] px-4 py-3 text-sm text-white shadow-sm"><p className="whitespace-pre-wrap break-words">{turn.question}</p></article></div>
            <div className="flex items-start gap-2"><span aria-hidden="true" className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-emerald-900' : 'bg-emerald-100 text-emerald-800'}`}><Sparkles size={14} /></span><article aria-label="LightBridge AI response" className={`min-w-0 max-w-[90%] rounded-2xl rounded-tl-sm border px-4 py-3 text-sm shadow-sm ${dark ? 'border-white/10 bg-[#10332A]' : 'border-stone-200/70 bg-white'}`}>
              <p className={`mb-1.5 text-[10px] font-semibold uppercase tracking-wide ${muted}`}>LightBridge AI</p>
              {turn.status === 'completed' ? <><p className="whitespace-pre-wrap break-words leading-relaxed">{turn.answer}</p>{turn.sources.length > 0 && <details className="mt-3 border-t border-inherit pt-2 text-xs"><summary className="cursor-pointer font-medium">Book references</summary><p className={`mt-2 ${muted}`}>{turn.sourceKind === 'context' ? 'Passages supplied to the assistant' : 'Sources from this book'}</p><div className="mt-2 flex flex-wrap gap-2">{Array.from(new Map(turn.sources.map(source => [source.href || source.id, source])).values()).slice(0, 8).map(source => <button key={source.id} type="button" onClick={() => source.readerPage && onGoToPage(source.readerPage)} disabled={!source.readerPage} className="rounded-full border border-emerald-600/30 px-2.5 py-1 text-xs hover:bg-emerald-500/10 disabled:opacity-50">{source.pageNumber ? `Page ${source.pageNumber}` : source.chapterTitle}</button>)}</div></details>}</>
                : turn.status === 'pending' ? <div role="status" className={`flex items-center gap-2 text-xs ${muted}`}>{working && activeTurnId === turn.id && <Loader2 size={14} className="shrink-0 animate-spin" />}<span>{working && activeTurnId === turn.id ? progressLabel : 'Saved — ready to continue.'}</span></div>
                  : <div className="space-y-2 text-xs"><p>{turnError(turn.errorCode)}</p><button type="button" disabled={working} onClick={() => void retryTurn(turn)} className="font-semibold underline disabled:opacity-40">Retry saved request</button></div>}
            </article></div>
          </div>)}
          {submittedQuestion && <div className="flex justify-end"><p className="max-w-[88%] whitespace-pre-wrap break-words rounded-2xl rounded-br-sm bg-[#077432] px-4 py-3 text-sm text-white">{submittedQuestion}</p></div>}
          {working && !activeTurn && <p role="status" className={`flex items-center gap-2 text-xs ${muted}`}><Loader2 size={14} className="animate-spin" />{submittedQuestion ? 'Sending your message...' : 'Working...'}</p>}
          {error && <p role="status" className={`rounded-xl border border-amber-500/20 px-3 py-2 text-xs ${dark ? 'bg-amber-950/20 text-amber-100' : 'bg-amber-50 text-amber-900'}`}>{error}</p>}
        </div>

        <form onSubmit={event => { event.preventDefault(); if (question.trim()) void begin('ask'); }} className="shrink-0 space-y-2 border-t border-inherit p-3 sm:p-4">
          {!working && pendingTurn?.status === 'pending' && <button type="button" onClick={() => void resume()} className="inline-flex items-center gap-1.5 text-xs font-semibold underline"><RotateCcw size={13} />Resume saved progress</button>}
          <div className={`rounded-2xl border p-2 focus-within:ring-2 focus-within:ring-emerald-600/30 ${dark ? 'border-white/20 bg-black/10' : 'border-stone-200 bg-white'}`}>
          {voiceOpen && <div id={`assistant-voice-${bookId}`} className="flex max-h-36 flex-wrap items-center gap-2 overflow-y-auto border-b border-inherit px-1 pb-3 mb-2">
            <select aria-label="Spoken language" value={speechLanguage} disabled={working || ['requesting', 'recording', 'stopping'].includes(recorder.phase)} onChange={event => setSpeechLanguage(event.target.value as SpeechLanguage)} className={`${field} !w-auto !py-2`}>{speechLanguages.map(language => <option key={language.value} value={language.value}>{language.label}</option>)}</select>
            {recorder.phase === 'recording' ? <button type="button" onClick={recorder.stop} className="rounded-lg bg-rose-700 px-3 py-2 text-xs text-white">Stop · {Math.floor(recorder.duration)}s</button>
              : <button type="button" onClick={() => void recorder.start()} disabled={working || ['requesting', 'stopping'].includes(recorder.phase)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs disabled:opacity-40"><Mic size={14} />{recorder.phase === 'requesting' ? 'Allow microphone...' : 'Record'}</button>}
            <button type="button" onClick={() => fileInput.current?.click()} disabled={working} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs disabled:opacity-40"><Paperclip size={14} />Upload audio</button>
            {recorder.audio && <><button type="button" onClick={() => void transcribe()} disabled={working} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs text-white disabled:opacity-40">Transcribe</button><button type="button" onClick={recorder.reset} disabled={working} aria-label="Clear recording" className="p-2"><RotateCcw size={15} /></button></>}
            {recorder.error && <p role="alert" className="w-full text-xs text-rose-600">{recorder.error}</p>}
          </div>}
            <div className="flex items-end gap-2">
            <button type="button" aria-label="Voice input" title="Voice input" aria-expanded={voiceOpen} aria-controls={`assistant-voice-${bookId}`} onClick={() => { setVoiceOpen(value => !value); setToolbar(null); }} className="shrink-0 rounded-xl p-2.5 hover:bg-emerald-500/10"><Mic size={18} /></button>
            <textarea rows={2} className="max-h-28 min-h-12 min-w-0 flex-1 resize-none bg-transparent py-2 text-sm outline-none disabled:opacity-60" maxLength={1500} value={question} disabled={working} onChange={event => setQuestion(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (question.trim()) void begin('ask'); } }} placeholder="Ask about this book..." aria-label="Message about the book" />
            <button type="submit" disabled={working || !question.trim()} aria-label="Send message" title="Send message" className="shrink-0 rounded-xl bg-[#077432] p-2.5 text-white hover:bg-[#056128] disabled:opacity-40">{working ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}</button>
          </div>
            </div>
          <div className={`flex flex-wrap items-center justify-between gap-2 text-[10px] ${muted}`}><label className="flex items-center gap-1.5"><input type="checkbox" checked={currentPageOnly} disabled={working} onChange={event => setCurrentPageOnly(event.target.checked)} />Current page only</label><span>Enter to send · Shift+Enter for a new line</span></div>
        </form>
      </div>)}
  </section>;
};
