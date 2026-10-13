import api from './client';
import { ChatLanguage } from './chat.api';

export type BookAction = 'ask' | 'explain' | 'translate' | 'summarize_book' | 'summarize_detailed' | 'summarize_lessons' | 'summarize_chapter';
export interface BookChapter { key: string; title: string }
export interface BookSource {
  id: string; bookTitle: string; chapterKey: string; chapterTitle: string;
  section: string; pageNumber: number | null; readerPage: number | null;
  excerpt: string; href: string | null;
}
export interface BookTurn {
  id: string; requestId: string; question: string; answer: string;
  action: BookAction; status: 'pending' | 'completed' | 'failed'; errorCode: string;
  sources: BookSource[]; sourceCount: number; responseLanguage: ChatLanguage;
  sourceKind?: 'context' | 'citations';
  inputLanguage: ChatLanguage; chapterKey: string; createdAt: string;
  progress: { phase: string; completed: number; total: number; coveredPassages: number } | null;
}
export interface BookConversation { _id: string; title: string; chapterKey: string; inputLanguage: ChatLanguage; responseLanguage: ChatLanguage; updatedAt: string }
export interface BookContext { title: string; sourceLanguage?: string; version: string; source: string; passageCount: number; chapters: BookChapter[] }

type Envelope<T> = { success: boolean; data: T; message?: string; error?: { code: string } };
const root = (bookId: string) => `/ai/books/${encodeURIComponent(bookId)}`;

export const bookAiApi = {
  context: async (bookId: string) => (await api.get<Envelope<BookContext>>(`${root(bookId)}/context`)).data.data,
  conversations: async (bookId: string) => (await api.get<Envelope<BookConversation[]>>(`${root(bookId)}/conversations`)).data.data,
  createConversation: async (bookId: string) => (await api.post<Envelope<BookConversation>>(`${root(bookId)}/conversations`)).data.data,
  conversation: async (bookId: string, conversationId: string) =>
    (await api.get<Envelope<{ conversation: BookConversation; turns: BookTurn[] }>>(`${root(bookId)}/conversations/${encodeURIComponent(conversationId)}`)).data.data,
  updatePreferences: (bookId: string, conversationId: string, preferences: { inputLanguage: ChatLanguage; responseLanguage: ChatLanguage; chapterKey: string }) =>
    api.patch(`${root(bookId)}/conversations/${encodeURIComponent(conversationId)}`, preferences),
  createTurn: async (bookId: string, conversationId: string, turn: {
    requestId: string; action: BookAction; question: string; inputLanguage: ChatLanguage;
    responseLanguage: ChatLanguage; chapterKey: string; readerPage?: number; passage?: string;
  }) => (await api.post<Envelope<BookTurn>>(`${root(bookId)}/conversations/${encodeURIComponent(conversationId)}/turns`, turn)).data.data,
  step: async (bookId: string, conversationId: string, turnId: string) =>
    (await api.post<Envelope<BookTurn>>(`${root(bookId)}/conversations/${encodeURIComponent(conversationId)}/turns/${encodeURIComponent(turnId)}/step`)).data.data,
};
