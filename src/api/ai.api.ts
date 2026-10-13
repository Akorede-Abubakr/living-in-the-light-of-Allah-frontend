import axios from 'axios';
import api from './client';

export type SpeechLanguage = 'yo' | 'en-NG' | 'ha' | 'ig';
export interface Transcription {
  transcript: string;
  language: SpeechLanguage;
  model: string;
  processing_time_ms: number;
}

function limit(value: string | undefined, fallback: number, maximum: number) {
  const number = Number(value || fallback);
  return Number.isInteger(number) && number > 0 && number <= maximum ? number : fallback;
}

// Leave a second below the Python duration limit for encoder padding.
export const MAX_RECORDING_SECONDS = limit(import.meta.env.VITE_SPEECH_MAX_SECONDS, 59, 299);
export const MAX_AUDIO_BYTES = limit(import.meta.env.VITE_SPEECH_MAX_BYTES, 10485760, 52428800);
const requestTimeout = limit(import.meta.env.VITE_SPEECH_TIMEOUT_MS, 810000, 1860000);

export async function transcribeAudio(audio: Blob, language: SpeechLanguage, signal: AbortSignal): Promise<Transcription> {
  const form = new FormData();
  const extension = audio.type.includes('ogg') ? 'ogg' : audio.type.includes('wav') || audio.type.includes('wave') ? 'wav' : 'webm';
  form.append('audio', audio, `recording.${extension}`);
  form.append('language', language);
  const response = await api.post<{ success: boolean; data: Transcription }>('/ai/transcribe', form, {
    // Override the client's JSON default; the browser supplies the boundary.
    headers: { 'Content-Type': undefined }, timeout: requestTimeout, signal,
  });
  const data = response.data?.data;
  if (!response.data?.success || typeof data?.transcript !== 'string' || data.language !== language) {
    throw new Error('The transcription response could not be read. Please retry.');
  }
  return data;
}

export function transcriptionError(error: unknown): { message: string; signIn: boolean } {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return { message: 'Your session has expired. Sign in again to transcribe.', signIn: true };
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') return { message: 'Transcription took too long. Please retry or use a shorter recording.', signIn: false };
    const message = error.response?.data?.message;
    return { message: typeof message === 'string' ? message : 'Could not reach Speech to Text. Check your connection and retry.', signIn: false };
  }
  return { message: error instanceof Error ? error.message : 'Transcription failed. Please retry.', signIn: false };
}
