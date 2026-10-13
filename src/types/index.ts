export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  spiritualFocus?: string;
  city?: string;
  country?: string;
  preferredReadingMode?: 'paper' | 'sepia' | 'night' | 'classic' | 'modern';
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isFeatured: boolean;
  bookCount?: number;
}

export interface Book {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  author: string;
  authorBio?: string;
  description: string;
  coverImage: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: Category | string;
  language: string;
  isbn?: string;
  publicationDate?: string;
  pageCount: number;
  previewPages: number;
  previewPercentage: number;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isPopular: boolean;
  isNewRelease: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  chapters?: ChapterOutline[];
  previewLimit?: number;
  isPurchased?: boolean;
  readingProgress?: ReadingProgress | null;
  relatedBooks?: Book[];
  createdAt: string;
  updatedAt: string;
}

export interface ChapterOutline {
  id: string;
  title: string;
  order: number;
  description?: string;
  startPage?: number;
  endPage?: number;
  pageCount: number;
  pages?: PageOutline[];
}

export interface PageOutline {
  _id: string;
  pageNumber: number;
  chapterPageNumber: number;
  title?: string;
}

export interface Chapter {
  _id: string;
  book: string;
  title: string;
  order: number;
  description?: string;
  pages?: Page[];
  pageCount?: number;
}

export interface Page {
  _id: string;
  book: string;
  chapter: string | Chapter;
  pageNumber: number;
  chapterPageNumber: number;
  title?: string;
  content: string;
  wordCount?: number;
}

export interface OrderItem {
  book: Book | string;
  title: string;
  price: number;
  coverImage: string;
}

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionReference: string;
  accessGranted: boolean;
  paidAt?: string;
  createdAt: string;
}

export interface ReadingProgress {
  _id?: string;
  user?: string;
  book: Book | string;
  currentChapter?: Chapter | string;
  currentPage: number;
  totalPages: number;
  percentage: number;
  lastReadAt: string;
  isFinished: boolean;
}

export interface Bookmark {
  _id: string;
  user: string;
  book: Book | string;
  chapter?: Chapter | string;
  pageNumber: number;
  note?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  user: User;
  book: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isModerated: boolean;
  createdAt: string;
}

export interface LibraryItem {
  book: Book;
  purchasedAt?: string;
  progress: {
    currentPage: number;
    totalPages: number;
    percentage: number;
    lastReadAt: string | null;
    isFinished: boolean;
    currentChapter?: Chapter | null;
  };
}

export interface ReaderMetaData {
  originalPagesAvailable?: boolean;
  documentVersion?: string;
  book: {
    id: string;
    title: string;
    subtitle?: string;
    author: string;
    coverImage: string;
    price: number;
    currency: string;
    pageCount: number;
  };
  hasFullAccess: boolean;
  isPurchased: boolean;
  isAdmin: boolean;
  previewLimit: number;
  totalPages: number;
  chapters: ChapterOutline[];
  bookmarks: Bookmark[];
  savedProgress: {
    currentPage: number;
    percentage: number;
    lastReadAt: string;
  } | null;
}

export interface PageResponse {
  page: {
    id: string;
    pageNumber: number;
    chapterPageNumber: number;
    title?: string;
    content: string;
    wordCount?: number;
    chapter: {
      _id: string;
      title: string;
      order: number;
      description?: string;
    };
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextPage: number | null;
    prevPage: number | null;
    isWithinPreview: boolean;
    isPreviewEnd: boolean;
  };
  access: {
    hasFullAccess: boolean;
    previewLimit: number;
    isPurchased: boolean;
  };
  isBookmarked: boolean;
  bookmarkId: string | null;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  authorBio?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  readTimeMinutes: number;
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
