import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_AUDIO_BYTES, MAX_RECORDING_SECONDS } from '../api/ai.api';

type Phase = 'idle' | 'requesting' | 'recording' | 'stopping' | 'ready';
const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/ogg', 'audio/wav'];

function permissionMessage(error: unknown): string {
  switch ((error as { name?: string })?.name) {
    case 'NotAllowedError': case 'SecurityError': return 'Microphone permission was denied. Allow microphone access in your browser settings, then try again.';
    case 'NotFoundError': return 'No microphone was found. Connect a microphone or choose an audio file.';
    case 'NotReadableError': return 'Your microphone is unavailable or in use by another application. Close it there and try again.';
    default: return 'Recording could not start. Check your microphone or choose an audio file.';
  }
}

export function useAudioRecorder() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [audio, setAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const interval = useRef<ReturnType<typeof setInterval>>();
  const deadline = useRef<ReturnType<typeof setTimeout>>();
  const objectUrl = useRef('');
  const generation = useRef(0);
  const phaseRef = useRef<Phase>('idle');
  const started = useRef(0);

  const changePhase = useCallback((value: Phase) => { phaseRef.current = value; setPhase(value); }, []);
  const stopTracks = useCallback(() => {
    stream.current?.getTracks().forEach(track => { track.onended = null; track.stop(); });
    stream.current = null;
    clearInterval(interval.current);
    clearTimeout(deadline.current);
  }, []);
  const dispose = useCallback(() => {
    generation.current++;
    const current = recorder.current;
    recorder.current = null;
    if (current) {
      current.ondataavailable = null;
      current.onstop = null;
      current.onerror = null;
      try { if (current.state !== 'inactive') current.stop(); } catch { /* Tracks still must close. */ }
    }
    stopTracks();
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = '';
  }, [stopTracks]);

  useEffect(() => () => dispose(), [dispose]);

  const reset = useCallback(() => {
    dispose();
    changePhase('idle');
    setAudio(null); setAudioUrl(''); setDuration(0); setError('');
  }, [dispose, changePhase]);

  const fail = useCallback((message: string) => {
    dispose();
    changePhase('idle');
    setAudio(null); setAudioUrl(''); setError(message);
  }, [dispose, changePhase]);

  const stop = useCallback(() => {
    const current = recorder.current;
    if (!current || phaseRef.current !== 'recording') return;
    changePhase('stopping');
    setDuration(Math.min(MAX_RECORDING_SECONDS, (performance.now() - started.current) / 1000));
    try { current.stop(); }
    catch { fail('The recording was interrupted. Please record again.'); }
    finally { stopTracks(); }
  }, [changePhase, fail, stopTracks]);

  const start = useCallback(async () => {
    if (['requesting', 'recording', 'stopping'].includes(phaseRef.current)) return;
    reset();
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setError('Microphone recording requires HTTPS or localhost and a supported browser. You can choose an audio file instead.');
      return;
    }
    const mime = typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function'
      ? candidates.find(type => MediaRecorder.isTypeSupported(type)) : undefined;
    if (!mime) {
      setError('This browser cannot record a supported audio format. Try a browser with WebM or OGG recording, or choose a WAV, WebM or OGG file.');
      return;
    }
    const session = generation.current;
    changePhase('requesting');
    try {
      const acquired = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Permission prompts can resolve after navigation, reset or unmount.
      if (session !== generation.current) { acquired.getTracks().forEach(track => track.stop()); return; }
      stream.current = acquired;
      const current = new MediaRecorder(acquired, { mimeType: mime, audioBitsPerSecond: 64000 });
      recorder.current = current;
      const chunks: Blob[] = [];
      let size = 0;
      current.ondataavailable = event => {
        if (session !== generation.current || !event.data.size) return;
        size += event.data.size;
        if (size > MAX_AUDIO_BYTES) { fail('The recording is too large. Please make a shorter recording.'); return; }
        chunks.push(event.data);
      };
      current.onerror = () => { if (session === generation.current) fail('Your microphone recording was interrupted. Please record again.'); };
      current.onstop = () => {
        if (session !== generation.current) return;
        stopTracks();
        recorder.current = null;
        const blob = new Blob(chunks, { type: current.mimeType || mime });
        if (!blob.size) { fail('No audio was captured. Please record again.'); return; }
        const url = URL.createObjectURL(blob);
        objectUrl.current = url;
        setAudio(blob); setAudioUrl(url); changePhase('ready');
      };
      acquired.getTracks().forEach(track => { track.onended = stop; });
      current.start(250);
      started.current = performance.now();
      changePhase('recording');
      interval.current = setInterval(() => {
        if (session === generation.current) setDuration(Math.min(MAX_RECORDING_SECONDS, (performance.now() - started.current) / 1000));
      }, 200);
      deadline.current = setTimeout(() => { if (session === generation.current) stop(); }, MAX_RECORDING_SECONDS * 1000);
    } catch (cause) {
      if (session === generation.current) fail(permissionMessage(cause));
    }
  }, [reset, changePhase, fail, stop, stopTracks]);

  const chooseFile = useCallback((file: File) => {
    reset();
    const extension = file.name.split('.').pop()?.toLowerCase();
    const fallback: Record<string, string> = { wav: 'audio/wav', webm: 'audio/webm', ogg: 'audio/ogg' };
    const mime = file.type.split(';')[0].toLowerCase() || fallback[extension || ''];
    if (!['audio/wav', 'audio/wave', 'audio/x-wav', 'audio/webm', 'audio/ogg', 'application/ogg'].includes(mime)) {
      setError('Choose a WAV, WebM or OGG audio file.'); return;
    }
    if (!file.size || file.size > MAX_AUDIO_BYTES) { setError('Choose a non-empty audio file within the upload size limit.'); return; }
    const blob = new Blob([file], { type: mime });
    const url = URL.createObjectURL(blob);
    objectUrl.current = url;
    setAudio(blob); setAudioUrl(url); changePhase('ready');
  }, [reset, changePhase]);

  return { phase, audio, audioUrl, duration, error, start, stop, reset, chooseFile };
}
