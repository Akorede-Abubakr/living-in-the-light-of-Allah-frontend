import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, FileAudio, Languages, Loader2, Mic, RotateCcw, Square, Waves } from 'lucide-react';
import { Button } from '../components/common/Button';
import { SEO } from '../components/common/SEO';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { MAX_AUDIO_BYTES, MAX_RECORDING_SECONDS, SpeechLanguage, Transcription, transcribeAudio, transcriptionError } from '../api/ai.api';

const languageNames = { yo: 'Yoruba', 'en-NG': 'Nigerian English', ha: 'Hausa', ig: 'Igbo' };
const clock = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;

export const TranscribePage: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const recording = useAudioRecorder();
  const [language, setLanguage] = useState<SpeechLanguage>('yo');
  const [result, setResult] = useState<Transcription | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [signIn, setSignIn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const pending = useRef<AbortController | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const preview = useRef<HTMLAudioElement>(null);
  const busyRecording = ['requesting', 'recording', 'stopping'].includes(recording.phase);

  useEffect(() => () => { pending.current?.abort(); pending.current = null; }, []);
  useEffect(() => {
    const player = preview.current;
    return () => player?.pause();
  }, [recording.audioUrl]);

  function clearResult() {
    setResult(null); setError(''); setSignIn(false); setCopied(false); setCopyMessage('');
    preview.current?.pause();
  }

  async function transcribe() {
    if (!recording.audio || pending.current) return;
    clearResult();
    const controller = new AbortController();
    pending.current = controller;
    setProcessing(true);
    try {
      const data = await transcribeAudio(recording.audio, language, controller.signal);
      if (!controller.signal.aborted) setResult(data);
    } catch (cause) {
      if (!controller.signal.aborted) {
        const failure = transcriptionError(cause);
        setError(failure.message); setSignIn(failure.signIn);
      }
    } finally {
      if (pending.current === controller) { pending.current = null; setProcessing(false); }
    }
  }

  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error();
      await navigator.clipboard.writeText(result?.transcript || '');
      setCopied(true); setCopyMessage('Transcript copied to clipboard.');
    } catch { setCopyMessage('Copy is unavailable. Select the transcript below and copy it manually.'); }
  }

  return (
    <div className={embedded ? '' : 'flex-1 bg-[#F8FAF9] dark:bg-[#071A17] px-4 sm:px-6 py-10 sm:py-16'}>
      {!embedded && <SEO title="Speech to Text" description="Turn your English, Yoruba, Hausa and Igbo recordings into text with N-ATLaS speech recognition." />}
      <div className="max-w-5xl mx-auto">
        {!embedded && <div className="max-w-2xl mb-9">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#077432] dark:text-[#A3DAB7]">
            <Waves size={18} aria-hidden="true" /> Your voice, in writing
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#202522] dark:text-[#F8F5ED] mt-4 mb-4">Speech to Text</h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">Speak in English, Yoruba, Hausa or Igbo. Preview your recording, then turn it into text you can copy and use.</p>
        </div>}

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <section aria-label="Audio recording" className="rounded-3xl bg-white dark:bg-[#09221D] border border-[#DDE8E1] dark:border-white/10 p-6 sm:p-8 shadow-soft">
            <label htmlFor="speech-language" className="flex items-center gap-2 text-sm font-semibold mb-3"><Languages size={17} aria-hidden="true" /> Recording language</label>
            <select id="speech-language" value={language} disabled={processing || busyRecording}
              onChange={event => { setLanguage(event.target.value as SpeechLanguage); clearResult(); }}
              className="w-full rounded-xl border border-[#DDE8E1] dark:border-white/15 bg-[#F8FAF9] dark:bg-[#071A17] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#077432] disabled:opacity-60">
              <option value="yo">Yoruba</option><option value="en-NG">Nigerian English</option><option value="ha">Hausa</option><option value="ig">Igbo</option>
            </select>

            <div className="flex flex-col items-center text-center py-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-5 ${recording.phase === 'recording' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 motion-safe:animate-pulse' : 'bg-[#E8F6ED] dark:bg-[#077432]/20 text-[#077432] dark:text-[#A3DAB7]'}`}>
                {recording.phase === 'requesting' || recording.phase === 'stopping' ? <Loader2 size={34} className="animate-spin" aria-hidden="true" /> : <Mic size={34} aria-hidden="true" />}
              </div>
              <span className="font-mono text-3xl tabular-nums tracking-wider" aria-label="Recording duration">{clock(recording.duration)}</span>
              <p role="status" className="text-sm text-stone-500 dark:text-stone-300 mt-2 min-h-6">
                {recording.phase === 'recording' ? <span className="inline-flex items-center gap-2 text-rose-600 dark:text-rose-300"><span className="w-2 h-2 rounded-full bg-current" /> Recording in progress</span>
                  : recording.phase === 'requesting' ? 'Waiting for microphone permission…'
                  : recording.phase === 'stopping' ? 'Preparing your recording…'
                  : recording.phase === 'ready' ? 'Your audio is ready to preview' : 'Ready when you are'}
              </p>
              <div className="mt-5">
                {recording.phase === 'recording' ? <Button variant="danger" onClick={recording.stop}><Square size={16} className="mr-2" aria-hidden="true" /> Stop recording</Button>
                  : <Button onClick={() => { clearResult(); void recording.start(); }} disabled={processing || busyRecording}>
                      <Mic size={16} className="mr-2" aria-hidden="true" />{recording.phase === 'ready' ? 'Record again' : 'Start recording'}
                    </Button>}
              </div>
              {recording.phase === 'requesting' && <button className="text-sm underline mt-3" onClick={recording.reset}>Cancel microphone request</button>}
            </div>

            {recording.error && <p role="alert" className="rounded-xl p-3 mb-4 text-sm bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200">{recording.error}</p>}
            {recording.audioUrl && <div className="border-t border-[#DDE8E1] dark:border-white/10 pt-5 mb-5">
              <p className="text-xs font-semibold mb-3">Listen before submitting</p>
              <audio ref={preview} controls src={recording.audioUrl} aria-label="Recording preview" className="w-full max-w-full" />
            </div>}

            <div className="flex flex-wrap gap-3">
              <Button className="flex-1 min-w-40" onClick={() => void transcribe()} disabled={!recording.audio || busyRecording || processing} isLoading={processing}>
                {error && !signIn ? 'Retry transcription' : 'Transcribe audio'}
              </Button>
              {recording.audio && <Button variant="outline" onClick={() => { clearResult(); recording.reset(); }} disabled={processing} aria-label="Clear recording"><RotateCcw size={17} /></Button>}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
              <span>Up to {MAX_RECORDING_SECONDS}s · {Math.round(MAX_AUDIO_BYTES / 1048576)} MB</span>
              <button className="inline-flex items-center gap-1.5 text-[#077432] dark:text-[#A3DAB7] font-semibold hover:underline disabled:opacity-50" disabled={processing || busyRecording} onClick={() => fileInput.current?.click()}>
                <FileAudio size={15} aria-hidden="true" /> Choose an audio file
              </button>
              <input ref={fileInput} type="file" aria-label="Choose audio file" accept=".wav,.webm,.ogg,audio/wav,audio/webm,audio/ogg" className="hidden"
                onChange={event => { const file = event.target.files?.[0]; if (file) { clearResult(); recording.chooseFile(file); } event.target.value = ''; }} />
            </div>
          </section>

          <section aria-label="Transcription result" aria-busy={processing} className="rounded-3xl bg-white dark:bg-[#09221D] border border-[#DDE8E1] dark:border-white/10 p-6 sm:p-8 shadow-soft min-h-96">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="font-serif text-xl">Your transcript</h2>
              {result?.transcript && <Button variant="ghost" size="sm" onClick={() => void copy()}>{copied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}{copied ? 'Copied' : 'Copy transcript'}</Button>}
            </div>
            {processing ? <div role="status" className="py-14 text-center">
              <Loader2 className="animate-spin mx-auto mb-4 text-[#077432] dark:text-[#A3DAB7]" size={28} aria-hidden="true" />
              <p className="font-semibold text-sm">Transcribing your audio…</p>
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">Your first transcription may take several minutes while the speech model gets ready. Keep this page open.</p>
            </div> : result ? <>
              <p role="status" className="text-xs text-[#077432] dark:text-[#A3DAB7] mb-4">{languageNames[result.language]} · Transcription complete</p>
              {result.transcript ? <textarea aria-label="Transcript" readOnly value={result.transcript} rows={9} className="w-full resize-y bg-[#F8FAF9] dark:bg-[#071A17] rounded-xl border border-[#DDE8E1] dark:border-white/10 p-4 text-base leading-7 focus:outline-none focus:ring-2 focus:ring-[#077432]" />
                : <p className="text-sm text-stone-500 dark:text-stone-300">No speech was recognized. Try recording again in a quiet place.</p>}
              <p role="status" className="text-xs mt-3 text-stone-500 dark:text-stone-400">{copyMessage}</p>
              <p className="text-xs mt-5 text-stone-500 dark:text-stone-400">Please review names, spelling and Yoruba tone marks before using your transcript.</p>
            </> : !error && <div className="py-14 text-center text-stone-500 dark:text-stone-400">
              <Waves size={32} className="mx-auto mb-4 text-[#C6A15B]" aria-hidden="true" />
              <p className="text-sm">A place for your words.</p><p className="text-xs mt-2">Record or choose audio to get started.</p>
            </div>}
            {error && <div role="alert" className="rounded-xl p-4 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200 text-sm leading-relaxed">
              <p>{error}</p>
              {signIn && <Link to="/login?redirect=%2Fchat%3Fmode%3Dtranscribe" className="inline-block font-semibold underline mt-3">Sign in again</Link>}
              {!signIn && recording.audio && <button onClick={() => void transcribe()} className="font-semibold underline mt-3">Retry with this recording</button>}
            </div>}
          </section>
        </div>
        <p className="max-w-3xl mt-7 text-xs leading-relaxed text-stone-500 dark:text-stone-400">Powered by official NCAIR N-ATLaS speech recognition. Developed by Awarri Technologies in partnership with the Federal Government of Nigeria. Audio is sent for transcription only when you submit it; recordings and transcripts are not saved to your library.</p>
      </div>
    </div>
  );
};
