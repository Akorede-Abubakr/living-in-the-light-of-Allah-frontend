import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Loader2, MessageCircle, Mic, Plus, RotateCcw, Square } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useAuth } from '../context/AuthContext';
import { ChatLanguage, ChatMessage, chatError, sendChat } from '../api/chat.api';
import { MAX_AUDIO_BYTES, SpeechLanguage, transcribeAudio, transcriptionError } from '../api/ai.api';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

const languages: { code: ChatLanguage; label: string }[] = [
  { code: 'en', label: 'English' }, { code: 'yo', label: 'Yoruba · Yorùbá' },
  { code: 'ha', label: 'Hausa' }, { code: 'ig', label: 'Igbo' },
];

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  return <ChatSession key={user?.id} />;
};

const ChatSession: React.FC = () => {
  const recorder = useAudioRecorder();
  const [language, setLanguage] = useState<ChatLanguage>('en');
  const [speechLanguage, setSpeechLanguage] = useState<SpeechLanguage>('en-NG');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; signIn: boolean } | null>(null);
  const [voicePending, setVoicePending] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const speechController = useRef<AbortController | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const conversation = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  useEffect(() => () => { controller.current?.abort(); speechController.current?.abort(); }, []);
  useEffect(() => {
    if (conversation.current) conversation.current.scrollTop = conversation.current.scrollHeight;
  }, [messages, pending]);

  const cancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the click's default action after React swaps the action button.
    event.preventDefault();
    controller.current?.abort(); controller.current = null;
    if (pending !== null) setDraft(pending);
    setPending(null);
  };
  const reset = () => {
    controller.current?.abort(); controller.current = null;
    speechController.current?.abort(); speechController.current = null;
    recorder.reset(); setVoicePending(false);
    setMessages([]); setDraft(''); setPending(null); setError(null); input.current?.focus();
  };
  const ask = async (content: string) => {
    if (!content || controller.current || content.length > 4000) return;
    const request = new AbortController(); controller.current = request;
    const history: ChatMessage[] = [...messages, { role: 'user', content }];
    setPending(content); setDraft(''); setError(null);
    try {
      const reply = await sendChat(history, language, request.signal);
      if (controller.current === request && !request.signal.aborted) {
        setMessages([...history, { role: 'assistant', content: reply }]);
      }
    } catch (failure) {
      if (controller.current === request && !request.signal.aborted) {
        setDraft(content); setError(chatError(failure));
      }
    } finally {
      if (controller.current === request) {
        controller.current = null; setPending(null); input.current?.focus();
      }
    }
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = draft.trim();
    await ask(content);
  };
  const transcribeAndAsk = async () => {
    if (!recorder.audio || speechController.current || controller.current) return;
    const request = new AbortController(); speechController.current = request;
    setVoicePending(true); setError(null);
    try {
      const result = await transcribeAudio(recorder.audio, speechLanguage, request.signal);
      if (request.signal.aborted) return;
      const spokenQuestion = result.transcript.trim();
      if (!spokenQuestion) {
        setError({ message: 'No speech was recognized. Please record again in a quiet place.', signIn: false });
        return;
      }
      if (spokenQuestion.length > 4000) {
        setError({ message: 'The transcript is too long for one chat message. Use a shorter recording.', signIn: false });
        return;
      }
      await ask(spokenQuestion);
      recorder.reset();
    } catch (failure) {
      if (!request.signal.aborted) setError(transcriptionError(failure));
    } finally {
      if (speechController.current === request) speechController.current = null;
      if (!request.signal.aborted) setVoicePending(false);
    }
  };

  return <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <SEO title="LightBridge AI" description="Chat in English, Yoruba, Hausa and Igbo with LightBridge AI, powered by N-ATLaS." />
    <header className="flex flex-wrap items-start justify-between gap-4 mb-7">
      <div><p className="text-xs uppercase tracking-[.2em] text-[#617259] dark:text-[#A3DAB7] mb-2">A space for curiosity</p>
        <h1 className="font-serif text-3xl sm:text-4xl">LightBridge AI</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Ask, explore and learn in your language.</p></div>
      <button type="button" onClick={reset} className="flex items-center gap-2 border border-stone-300 dark:border-white/20 rounded-full px-4 py-2 text-sm hover:bg-stone-100 dark:hover:bg-white/10"><Plus size={16} />New chat</button>
    </header>
    <div className="border border-[#E4E7DF] dark:border-white/10 rounded-3xl overflow-hidden bg-[#FBFAF6] dark:bg-[#0B231E] shadow-sm">
      <div className="flex flex-wrap gap-3 items-center justify-between px-5 py-4 border-b border-[#E4E7DF] dark:border-white/10">
        <span className="flex items-center gap-2 text-sm font-medium"><MessageCircle size={18} className="text-[#617259] dark:text-[#A3DAB7]" />Your conversation</span>
        <label className="flex items-center gap-2 text-sm">Reply language
          <select aria-label="Reply language" value={language} disabled={pending !== null} onChange={e => setLanguage(e.target.value as ChatLanguage)} className="rounded-xl border border-stone-300 dark:border-white/20 bg-white dark:bg-[#153F35] py-2 px-3 max-w-full">
            {languages.map(item => <option key={item.code} value={item.code}>{item.label}</option>)}
          </select></label>
      </div>
      <div ref={conversation} role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text" className="h-[48vh] min-h-64 max-h-[650px] overflow-y-auto p-4 sm:p-6 space-y-5">
        {!messages.length && pending === null && <div className="max-w-md mx-auto text-center py-8 sm:py-14">
          <MessageCircle size={32} className="mx-auto mb-4 text-[#617259] dark:text-[#A3DAB7]" />
          <h2 className="font-serif text-2xl">Where shall we begin?</h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-3 leading-relaxed">Ask a question, explore an idea or practise a language. Choose how you would like LightBridge AI to reply.</p>
        </div>}
        {[...messages, ...(pending !== null ? [{ role: 'user' as const, content: pending }] : [])].map((message, index) => <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[92%] sm:max-w-[85%] rounded-2xl px-4 py-3 ${message.role === 'user' ? 'bg-[#153F35] text-white' : 'bg-white dark:bg-white/5 border border-[#E4E7DF] dark:border-white/10'}`}>
            <p className="text-xs font-semibold mb-2 opacity-75">{message.role === 'user' ? 'You' : 'LightBridge AI'}</p>
            <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm sm:text-base leading-relaxed">{message.content}</p>
          </div>
        </div>)}
        {pending !== null && <p role="status" className="flex gap-2 items-center text-sm text-stone-600 dark:text-stone-300"><Loader2 size={16} className="animate-spin" />LightBridge AI is thinking…</p>}
      </div>
      <form onSubmit={submit} className="border-t border-[#E4E7DF] dark:border-white/10 p-4 sm:p-5">
        {error && <div role="alert" className="mb-4 text-sm text-red-700 dark:text-red-300">{error.message} {error.signIn && <Link className="underline" to="/login?redirect=%2Fchat">Sign in again</Link>}</div>}
        <label htmlFor="chat-message" className="sr-only">Your message</label>
        <textarea ref={input} id="chat-message" value={draft} disabled={pending !== null || voicePending} onChange={e => setDraft(e.target.value)} maxLength={4000} rows={3} placeholder="Type your message…" aria-describedby="chat-hint"
          className="w-full resize-y min-h-24 max-h-64 rounded-2xl border border-stone-300 dark:border-white/20 bg-white dark:bg-[#071A17] p-4 text-base disabled:opacity-60" />
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <label htmlFor="chat-speech-language" className="sr-only">Spoken language</label>
          <select id="chat-speech-language" value={speechLanguage} disabled={pending !== null || voicePending || ['requesting', 'recording', 'stopping'].includes(recorder.phase)} onChange={event => setSpeechLanguage(event.target.value as SpeechLanguage)} className="rounded-xl border border-stone-300 dark:border-white/20 bg-white dark:bg-[#153F35] py-2 px-3 text-sm">
            <option value="en-NG">Spoken English</option><option value="yo">Spoken Yoruba</option><option value="ha">Spoken Hausa</option><option value="ig">Spoken Igbo</option>
          </select>
          {recorder.phase === 'recording'
            ? <button type="button" onClick={recorder.stop} className="flex items-center gap-2 rounded-full border border-stone-300 dark:border-white/20 px-4 py-2 text-sm"><Square size={14} />Stop recording</button>
            : <button type="button" onClick={() => { setError(null); void recorder.start(); }} disabled={pending !== null || voicePending || ['requesting', 'stopping'].includes(recorder.phase)} className="flex items-center gap-2 rounded-full border border-stone-300 dark:border-white/20 px-4 py-2 text-sm disabled:opacity-50"><Mic size={15} />{recorder.phase === 'requesting' ? 'Allow microphone…' : 'Record a question'}</button>}
          <button type="button" onClick={() => fileInput.current?.click()} disabled={pending !== null || voicePending} className="rounded-full border border-stone-300 dark:border-white/20 px-4 py-2 text-sm disabled:opacity-50">Choose audio</button>
          <input ref={fileInput} type="file" accept="audio/wav,audio/webm,audio/ogg,.wav,.webm,.ogg" className="hidden" aria-label="Choose an audio question" onChange={event => { const file = event.target.files?.[0]; if (file && file.size > MAX_AUDIO_BYTES) setError({ message: 'The recording exceeds the upload size limit.', signIn: false }); else if (file) { setError(null); recorder.chooseFile(file); } event.currentTarget.value = ''; }} />
          {recorder.audio && <><button type="button" onClick={() => void transcribeAndAsk()} disabled={pending !== null || voicePending} className="rounded-full bg-[#E8F6ED] dark:bg-[#077432]/20 px-4 py-2 text-sm font-semibold disabled:opacity-50">{voicePending ? 'Transcribing…' : 'Transcribe and ask LightBridge'}</button><button type="button" onClick={recorder.reset} disabled={pending !== null || voicePending} aria-label="Clear recording" className="rounded-full p-2"><RotateCcw size={15} /></button></>}
          {recorder.error && <span role="alert" className="text-xs text-red-700 dark:text-red-300">{recorder.error}</span>}
          {recorder.phase === 'recording' && <span role="status" className="text-xs text-stone-500">Recording {Math.floor(recorder.duration)}s</span>}
        </div>
        <div className="flex items-center justify-between gap-3 mt-3">
          <span id="chat-hint" className="text-xs text-stone-500 dark:text-stone-400">{draft.length.toLocaleString()} / 4,000</span>
          {pending !== null ? <button key="stop" type="button" onClick={cancel} className="flex items-center gap-2 rounded-full border border-stone-300 dark:border-white/20 px-5 py-2.5 text-sm"><Square size={14} />Stop waiting</button> :
            <button key="send" type="submit" disabled={!draft.trim() || voicePending} className="flex items-center gap-2 rounded-full bg-[#153F35] dark:bg-[#A3DAB7] text-white dark:text-[#071A17] px-5 py-2.5 text-sm disabled:opacity-40"><ArrowUp size={18} />Send message</button>}
        </div>
      </form>
    </div>
    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mt-4">Powered by NCAIR1/N-ATLaS. AI can make mistakes; verify important answers. Recent conversation context is sent with each message (up to 10 previous exchanges). This chat is kept only on this page and clears when you leave or refresh.</p>
  </section>;
};
