import api from './client';
import {
  User,
  Book,
  Category,
  ReaderMetaData,
  PageResponse,
  Order,
  LibraryItem,
  ReadingProgress,
  Bookmark,
  Review,
  BlogPost,
} from '../types';

// Auth API
export const authApi = {
  register: (data: any) => api.post<{ success: boolean; token: string; user: User; message: string }>('/auth/register', data),
  login: (data: any) => api.post<{ success: boolean; token: string; user: User; message: string }>('/auth/login', data),
  logout: () => api.post<{ success: boolean; message: string }>('/auth/logout'),
  getMe: () => api.get<{ success: boolean; user: User }>('/auth/me'),
  updateProfile: (data: any) => {
    const isFormData = data instanceof FormData;
    return api.patch<{ success: boolean; user: User; message: string }>(
      '/auth/profile',
      data,
      isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    );
  },
  changePassword: (data: any) => api.patch<{ success: boolean; message: string }>('/auth/change-password', data),
  forgotPassword: (email: string) => api.post<{ success: boolean; message: string }>('/auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post<{ success: boolean; message: string }>('/auth/reset-password', data),
  deleteAccount: () => api.delete<{ success: boolean; message: string }>('/auth/account'),
};

// Books API
export const booksApi = {
  getBooks: (params?: Record<string, any>) =>
    api.get<{
      success: boolean;
      data: Book[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>('/books', { params }),
  getFeatured: () => api.get<{ success: boolean; data: Book[] }>('/books/featured'),
  getPopular: () => api.get<{ success: boolean; data: Book[] }>('/books/popular'),
  getNewReleases: () => api.get<{ success: boolean; data: Book[] }>('/books/new-releases'),
  getBookById: (id: string) => api.get<{ success: boolean; data: Book }>('/books/' + id),
  getBookBySlug: (slug: string) => api.get<{ success: boolean; data: Book }>('/books/slug/' + slug),
};

// Categories API
export const categoriesApi = {
  getCategories: () => api.get<{ success: boolean; data: Category[] }>('/categories'),
  getCategoryBySlug: (slug: string) =>
    api.get<{ success: boolean; data: { category: Category; books: Book[] } }>('/categories/slug/' + slug),
};

// Reader API
export const readerApi = {
  getMeta: (bookId: string) => api.get<{ success: boolean; data: ReaderMetaData }>(`/reader/${bookId}/meta`),
  getPreviewPages: (bookId: string) =>
    api.get<{ success: boolean; data: { previewLimit: number; totalPages: number; hasFullAccess: boolean; pages: any[] } }>(
      `/reader/${bookId}/preview`
    ),
  getPage: (bookId: string, pageNumber: number) =>
    api.get<{ success: boolean; data: PageResponse }>(`/reader/${bookId}/page/${pageNumber}`),
  getFullBook: (bookId: string) => api.get<{ success: boolean; data: { book: Book; chapters: any[] } }>(`/reader/${bookId}/full`),
};

// Orders & Payments API
export const ordersApi = {
  initializeOrder: (data: { bookIds: string[]; callbackUrl?: string; currency?: string }) =>
    api.post<{
      success: boolean;
      data: {
        authorizationUrl: string;
        accessCode: string;
        reference: string;
        orderId: string;
        amount: number;
        currency: string;
      };
    }>('/orders/initialize', data),
  verifyOrder: (reference: string) =>
    api.post<{ success: boolean; message: string; data: { order: Order; status: string } }>('/orders/verify', { reference }),
  getMyOrders: () => api.get<{ success: boolean; data: Order[] }>('/orders/my-orders'),
  getOrderById: (id: string) => api.get<{ success: boolean; data: Order }>('/orders/' + id),
};

// Library API
export const libraryApi = {
  getMyLibrary: () => api.get<{ success: boolean; data: LibraryItem[] }>('/library'),
  checkOwnership: (bookId: string) => api.get<{ success: boolean; isPurchased: boolean }>('/library/check/' + bookId),
};

// Reading Progress API
export const progressApi = {
  saveProgress: (data: { bookId: string; pageNumber: number; chapterId?: string; totalPages?: number }) =>
    api.post<{ success: boolean; data: ReadingProgress }>('/progress', data),
  getProgress: (bookId: string) => api.get<{ success: boolean; data: ReadingProgress | null }>('/progress/' + bookId),
  getRecentProgress: () => api.get<{ success: boolean; data: ReadingProgress[] }>('/progress/recent'),
};

// Bookmarks API
export const bookmarksApi = {
  getBookmarks: (bookId: string) => api.get<{ success: boolean; data: Bookmark[] }>(`/bookmarks/book/${bookId}`),
  getMyBookmarks: () => api.get<{ success: boolean; data: Bookmark[] }>('/bookmarks/my-bookmarks'),
  createBookmark: (data: { bookId: string; pageNumber: number; chapterId?: string; note?: string }) =>
    api.post<{ success: boolean; action: 'created' | 'removed' | 'updated'; message: string; data?: Bookmark }>('/bookmarks', data),
  deleteBookmark: (id: string) => api.delete<{ success: boolean; message: string }>('/bookmarks/' + id),
};

// Reviews API
export const reviewsApi = {
  getBookReviews: (bookId: string) =>
    api.get<{ success: boolean; data: { reviews: Review[]; total: number; distribution: Record<number, number> } }>(
      `/reviews/book/${bookId}`
    ),
  createReview: (bookId: string, data: { rating: number; title?: string; comment: string }) =>
    api.post<{ success: boolean; message: string; data: Review }>(`/reviews/book/${bookId}`, data),
  deleteReview: (id: string) => api.delete<{ success: boolean; message: string }>('/reviews/' + id),
};

// Blogs API
export const blogsApi = {
  getBlogs: (params?: Record<string, any>) =>
    api.get<{
      success: boolean;
      data: BlogPost[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
      categories: string[];
    }>('/blogs', { params }),
  getBlogBySlug: (slug: string) =>
    api.get<{
      success: boolean;
      data: { blog: BlogPost; related: BlogPost[] };
    }>(`/blogs/${slug}`),
};
