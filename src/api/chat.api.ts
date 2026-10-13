import axios from 'axios';
import api from './client';

export type ChatLanguage = 'en' | 'yo' | 'ha' | 'ig';
export interface ChatMessage { role: 'user' | 'assistant'; content: string }

export function recentHistory(messages: ChatMessage[]): ChatMessage[] {
  const recent = messages.slice(-21);
  while (recent.length > 1 && recent.reduce((sum, m) => sum + [...m.content].length, 0) > 24000) recent.splice(0, 2);
  return recent;
}

export async function sendChat(messages: ChatMessage[], language: ChatLanguage, signal: AbortSignal): Promise<string> {
  const response = await api.post('/ai/chat', { messages: recentHistory(messages), language }, { signal, timeout: 150000 });
  const data = response.data?.data;
  if (!response.data?.success || typeof data?.reply !== 'string' || !data.reply.trim() ||
      data.language !== language || data.model !== 'NCAIR1/N-ATLaS') throw new Error('The response could not be read. Please retry.');
  return data.reply;
}

export function chatError(error: unknown): { message: string; signIn: boolean } {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return { message: 'Your session has expired. Sign in again to chat.', signIn: true };
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') return { message: 'The response took too long. Please retry.', signIn: false };
    return { message: typeof error.response?.data?.message === 'string' ? error.response.data.message : 'Could not reach LightBridge AI. Check your connection and retry.', signIn: false };
  }
  return { message: error instanceof Error ? error.message : 'The response failed. Please retry.', signIn: false };
}
