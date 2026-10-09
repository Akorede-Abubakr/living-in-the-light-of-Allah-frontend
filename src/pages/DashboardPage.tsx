import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Bookmark,
  Receipt,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  User,
  Settings,
  Phone,
  MapPin,
  Compass,
  Shield,
  Trash2,
  Save,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Award,
  FileText,
  Heart,
  LogOut,
  AlertTriangle,
  Pencil,
  Lock,
  Unlock,
} from 'lucide-react';
import { libraryApi, ordersApi, progressApi, bookmarksApi, authApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SEO } from '../components/common/SEO';
import { Badge } from '../components/common/Badge';

export const DashboardPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab selection (defaults to 'profile')
  const activeTab = searchParams.get('tab') || 'profile';

  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // 1. Fetch Purchased Library
  const { data: libraryData, isLoading: isLibraryLoading } = useQuery({
    queryKey: ['myLibrary'],
    queryFn: () => libraryApi.getMyLibrary(),
  });

  // 2. Fetch Reading Progress
  const { data: progressData } = useQuery({
    queryKey: ['myProgress'],
    queryFn: () => progressApi.getRecentProgress(),
  });

  // 3. Fetch Bookmarks
  const { data: bookmarksData } = useQuery({
    queryKey: ['myBookmarks'],
    queryFn: () => bookmarksApi.getMyBookmarks(),
  });

  // 4. Fetch Order History
  const { data: ordersData } = useQuery({
    queryKey: ['myOrders'],
    queryFn: () => ordersApi.getMyOrders(),
  });

  const library = libraryData?.data.data || [];
  const progressList = progressData?.data.data || [];
  const bookmarks = bookmarksData?.data.data || [];
  const orders = ordersData?.data.data || [];

  // Profile Edit Form State
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.bio || '',
    spiritualFocus: user?.spiritualFocus || '',
    city: user?.city || '',
    country: user?.country || '',
    preferredReadingMode: user?.preferredReadingMode || 'classic',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Sync profile form when user updates
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || (user.name ? user.name.split(' ')[0] : ''),
        lastName: user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : ''),
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || '',
        spiritualFocus: user.spiritualFocus || '',
        city: user.city || '',
        country: user.country || '',
        preferredReadingMode: user.preferredReadingMode || 'classic',
      });
    }
  }, [user]);

  // Password Change Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // Delete Account Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Logout Confirmation State from Sidebar
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // First name extraction for welcome message
  const userFirstName = user?.firstName || (user?.name ? user.name.split(' ')[0] : 'Seeker');
  const userLastName = user?.lastName || (user?.name ? user.name.split(' ').slice(1).join(' ') : '');

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.firstName.trim()) {
      showErrorToast('First name is required.');
      return;
    }

    try {
      setIsSavingProfile(true);
      const res = await authApi.updateProfile({
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phoneNumber: profileForm.phoneNumber.trim(),
        bio: profileForm.bio.trim(),
        spiritualFocus: profileForm.spiritualFocus.trim(),
        city: profileForm.city.trim(),
        country: profileForm.country.trim(),
        preferredReadingMode: profileForm.preferredReadingMode,
      });

      if (res.data.success && res.data.user) {
        updateUser(res.data.user);
        showSuccessToast('Profile details updated successfully.');
        setIsEditingProfile(false);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      showErrorToast(msg);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      showErrorToast('Please enter your current password.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showErrorToast('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showErrorToast('New passwords do not match.');
      return;
    }

    try {
      setIsSavingPassword(true);
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      showSuccessToast('Password changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsEditingPassword(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update password.';
      showErrorToast(msg);
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== 'DELETE') {
      showErrorToast('Please type DELETE to confirm account deletion.');
      return;
    }

    try {
      setIsDeletingAccount(true);
      await authApi.deleteAccount();
      showSuccessToast('Your account has been permanently deleted.');
      queryClient.clear();
      await logout();
      navigate('/', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete account.';
      showErrorToast(msg);
      setIsDeletingAccount(false);
    }
  };

  const handleSidebarLogout = async () => {
    try {
      await logout();
      showSuccessToast('Logged out successfully');
    } catch (err) {
      console.error(err);
    } finally {
      queryClient.clear();
      setIsLogoutModalOpen(false);
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fadeIn space-y-8">
      <SEO
        title="Seeker Dashboard — Living in the light of Allah"
        description="View your seeker profile, sacred book collection, reading progress, and personal settings."
      />

      {/* Main Grid: Left Sidebar Navigation & Right Content Area */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          {/* Seeker Profile Mini Card */}
          <div className="bg-white dark:bg-[#071A17] rounded-3xl border border-[#DDE8E1] dark:border-white/10 p-6 shadow-sm text-center space-y-4">
            <div className="relative inline-block mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#077432] to-[#054E22] text-[#C6A15B] font-serif font-bold text-3xl flex items-center justify-center shadow-md mx-auto border-2 border-[#C6A15B]/30">
                {userFirstName.charAt(0).toUpperCase()}
              </div>
            </div>

            <div>
              <h2 className="font-serif font-bold text-lg text-[#202522] dark:text-white truncate">
                {userFirstName} {userLastName}
              </h2>
            </div>

            {user?.spiritualFocus && (
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans italic border-t border-stone-100 dark:border-white/10 pt-3">
                "{user.spiritualFocus}"
              </p>
            )}
          </div>

          {/* Navigation Sections */}
          <nav className="bg-white dark:bg-[#071A17] rounded-3xl border border-[#DDE8E1] dark:border-white/10 p-3 shadow-sm space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-sans uppercase font-bold text-stone-400 dark:text-stone-500 tracking-wider">
              Dashboard Sections
            </div>

            {/* Tab: Seeker Profile */}
            <button
              onClick={() => setTab('profile')}
              type="button"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-sans font-semibold transition-all cursor-pointer ${activeTab === 'profile'
                  ? 'bg-[#077432] text-white shadow-sm'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-[#077432]/10 hover:text-[#077432] dark:hover:text-[#34D399]'
                }`}
            >
              <div className="flex items-center gap-3">
                <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-white' : 'text-[#077432]'}`} />
                <span>My Profile</span>
              </div>
            </button>

            {/* Tab: My Library */}
            <button
              onClick={() => setTab('library')}
              type="button"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-sans font-semibold transition-all cursor-pointer ${activeTab === 'library'
                  ? 'bg-[#077432] text-white shadow-sm'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-[#077432]/10 hover:text-[#077432] dark:hover:text-[#34D399]'
                }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className={`w-4 h-4 ${activeTab === 'library' ? 'text-white' : 'text-[#077432]'}`} />
                <span>Sacred Library</span>
              </div>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${activeTab === 'library'
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-400'
                  }`}
              >
                {library.length}
              </span>
            </button>

            {/* Tab: Bookmarks */}
            <button
              onClick={() => setTab('bookmarks')}
              type="button"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-sans font-semibold transition-all cursor-pointer ${activeTab === 'bookmarks'
                  ? 'bg-[#077432] text-white shadow-sm'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-[#077432]/10 hover:text-[#077432] dark:hover:text-[#34D399]'
                }`}
            >
              <div className="flex items-center gap-3">
                <Bookmark className={`w-4 h-4 ${activeTab === 'bookmarks' ? 'text-white' : 'text-[#077432]'}`} />
                <span>Bookmarks & Notes</span>
              </div>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${activeTab === 'bookmarks'
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-400'
                  }`}
              >
                {bookmarks.length}
              </span>
            </button>

            {/* Tab: Orders */}
            <button
              onClick={() => setTab('orders')}
              type="button"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-sans font-semibold transition-all cursor-pointer ${activeTab === 'orders'
                  ? 'bg-[#077432] text-white shadow-sm'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-[#077432]/10 hover:text-[#077432] dark:hover:text-[#34D399]'
                }`}
            >
              <div className="flex items-center gap-3">
                <Receipt className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-[#077432]'}`} />
                <span>Order Invoices</span>
              </div>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${activeTab === 'orders'
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-400'
                  }`}
              >
                {orders.length}
              </span>
            </button>

            {/* Tab: Settings */}
            <button
              onClick={() => setTab('settings')}
              type="button"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-sans font-semibold transition-all cursor-pointer ${activeTab === 'settings'
                  ? 'bg-[#077432] text-white shadow-sm'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-[#077432]/10 hover:text-[#077432] dark:hover:text-[#34D399]'
                }`}
            >
              <div className="flex items-center gap-3">
                <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-white' : 'text-[#077432]'}`} />
                <span>Account Settings</span>
              </div>
            </button>

            {/* Sidebar Logout Trigger */}
            <div className="pt-2 border-t border-stone-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-sans font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 w-full min-w-0 space-y-6">
          {/* TAB 1: SEEKER PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Seeker Welcome Banner (White on light theme, ONLY first name, NO email displaying) */}
              <div className="bg-white dark:bg-[#071A17] p-6 sm:p-8 rounded-3xl border border-[#DDE8E1] dark:border-white/10 shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                    </div>
                    {/* Welcome message strictly attaching only the first name */}
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522] dark:text-white tracking-tight">
                      Welcome, {userFirstName}
                    </h1>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl">
                      May your journey seeking beneficial knowledge illuminate your heart, elevate your understanding, and draw you nearer to Allah.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                    <button
                      onClick={() => setTab('settings')}
                      className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/15 text-stone-800 dark:text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#077432] dark:text-[#34D399]" />
                      <span>Edit Details</span>
                    </button>
                    <Link
                      to="/books"
                      className="px-4 py-2.5 bg-[#077432] hover:bg-[#065F29] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Catalog</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Seeker Identity & Detail Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Overview */}
                <div className="bg-white dark:bg-[#071A17] rounded-3xl border border-[#DDE8E1] dark:border-white/10 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-3">
                    <h3 className="font-serif font-bold text-base text-[#202522] dark:text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-[#077432]" />
                      <span>Seeker Identity</span>
                    </h3>
                    <button
                      onClick={() => setTab('settings')}
                      className="text-xs text-[#077432] dark:text-[#34D399] hover:underline font-semibold cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-3.5 text-xs font-sans">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-stone-500 dark:text-stone-400">First Name</span>
                      <span className="font-semibold text-stone-900 dark:text-white">
                        {userFirstName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-stone-500 dark:text-stone-400">Last Name</span>
                      <span className="font-semibold text-stone-900 dark:text-white">
                        {userLastName || '—'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-stone-500 dark:text-stone-400">Phone Number</span>
                      <span className="font-semibold text-stone-900 dark:text-white flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#077432]" />
                        {user?.phoneNumber || 'Not provided yet'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-stone-500 dark:text-stone-400">Location</span>
                      <span className="font-semibold text-stone-900 dark:text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#077432]" />
                        {user?.city || user?.country
                          ? [user.city, user.country].filter(Boolean).join(', ')
                          : 'Not specified'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-stone-500 dark:text-stone-400">Member Since</span>
                      <span className="font-semibold text-stone-900 dark:text-white font-mono">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          : 'Active Member'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Spiritual Focus & Study Preference */}
                <div className="bg-white dark:bg-[#071A17] rounded-3xl border border-[#DDE8E1] dark:border-white/10 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-3">
                    <h3 className="font-serif font-bold text-base text-[#202522] dark:text-white flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#077432]" />
                      <span>Spiritual Aspiration</span>
                    </h3>
                    <span className="text-[10px] font-sans font-bold uppercase text-[#C6A15B] tracking-wider">
                      Study Focus
                    </span>
                  </div>

                  <div className="space-y-4 text-xs font-sans">
                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#077432] dark:text-[#34D399] tracking-wider block">
                        Primary Intellectual Focus
                      </span>
                      <p className="font-semibold text-stone-800 dark:text-stone-100 text-sm">
                        {user?.spiritualFocus || 'Sacred Knowledge & Quranic Reflection'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-stone-500 dark:text-stone-400 font-semibold">About the Seeker:</span>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed italic bg-stone-50 dark:bg-white/5 p-3 rounded-xl border border-stone-100 dark:border-white/5">
                        {user?.bio
                          ? `"${user.bio}"`
                          : 'Dedicated to studying the eternal light of divine wisdom and applying illuminated teachings.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-stone-500 dark:text-stone-400">Reading Mode Preference:</span>
                      <span className="font-bold text-[#077432] dark:text-[#34D399] capitalize">
                        {user?.preferredReadingMode === 'modern' ? 'Continuous Modern' : 'Classic Illuminated'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spiritual Milestones & Statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#071A17] p-5 rounded-2xl border border-[#DDE8E1] dark:border-white/10 shadow-sm text-center space-y-1">
                  <span className="text-2xl font-serif font-bold text-[#077432] dark:text-[#34D399]">
                    {library.length}
                  </span>
                  <p className="text-xs font-sans font-semibold text-stone-700 dark:text-stone-300">Volumes Acquired</p>
                  <p className="text-[10px] text-stone-400">Permanent Library</p>
                </div>

                <div className="bg-white dark:bg-[#071A17] p-5 rounded-2xl border border-[#DDE8E1] dark:border-white/10 shadow-sm text-center space-y-1">
                  <span className="text-2xl font-serif font-bold text-[#C6A15B]">
                    {progressList.length}
                  </span>
                  <p className="text-xs font-sans font-semibold text-stone-700 dark:text-stone-300">Active Readings</p>
                  <p className="text-[10px] text-stone-400">Studies In-Progress</p>
                </div>

                <div className="bg-white dark:bg-[#071A17] p-5 rounded-2xl border border-[#DDE8E1] dark:border-white/10 shadow-sm text-center space-y-1">
                  <span className="text-2xl font-serif font-bold text-[#077432] dark:text-[#34D399]">
                    {bookmarks.length}
                  </span>
                  <p className="text-xs font-sans font-semibold text-stone-700 dark:text-stone-300">Sacred Bookmarks</p>
                  <p className="text-[10px] text-stone-400">Saved Reflections</p>
                </div>

                <div className="bg-white dark:bg-[#071A17] p-5 rounded-2xl border border-[#DDE8E1] dark:border-white/10 shadow-sm text-center space-y-1">
                  <span className="text-2xl font-serif font-bold text-[#C6A15B]">
                    {orders.length}
                  </span>
                  <p className="text-xs font-sans font-semibold text-stone-700 dark:text-stone-300">Total Invoices</p>
                  <p className="text-[10px] text-stone-400">Acquisition History</p>
                </div>
              </div>

              {/* Hadith / Sacred Quote Card */}
              <div className="bg-white dark:bg-[#071A17] p-6 rounded-3xl border border-[#DDE8E1] dark:border-white/10 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-[#C6A15B]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[11px] font-sans font-bold uppercase tracking-wider">
                    Wisdom for the Seeker of Knowledge
                  </span>
                </div>
                <p className="font-serif text-base sm:text-lg text-[#202522] dark:text-white italic leading-relaxed">
                  "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ"
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  "Whoever takes a path upon which to obtain knowledge, Allah makes the path to Paradise easy for him."
                  <span className="font-semibold text-[#077432] dark:text-[#34D399] ml-1.5">— Sahih Muslim</span>
                </p>
              </div>

              {/* Quick Resume Recent Reading */}
              {library.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-lg text-[#202522] dark:text-white">
                      Your Sacred Shelf Quick View
                    </h3>
                    <button
                      onClick={() => setTab('library')}
                      className="text-xs text-[#077432] dark:text-[#34D399] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All Volumes ({library.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {library.slice(0, 3).map((item: any) => {
                      const book = item.book;
                      const progress = progressList.find((p: any) => p.book?._id === book?._id || p.book === book?._id);
                      const percent = progress?.percentage || 0;

                      return (
                        <div
                          key={book?._id}
                          className="bg-white dark:bg-[#071A17] rounded-2xl border border-[#DDE8E1] dark:border-white/10 p-4 flex gap-3 items-center shadow-xs hover:shadow-sm transition-all"
                        >
                          <img
                            src={book?.coverImage}
                            alt={book?.title}
                            className="w-14 h-20 object-cover rounded-lg shadow-sm shrink-0"
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <h4 className="font-serif font-bold text-xs text-[#202522] dark:text-white truncate">
                              {book?.title}
                            </h4>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                              by {book?.author}
                            </p>
                            <div className="w-full h-1 bg-stone-100 dark:bg-white/10 rounded-full overflow-hidden mt-1">
                              <div
                                className="h-full bg-[#077432]"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <Link
                              to={`/read/${book?._id}?page=${progress?.currentPage || 1}`}
                              className="inline-block text-[11px] font-bold text-[#077432] dark:text-[#34D399] hover:underline pt-0.5"
                            >
                              Resume Read →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY SACRED LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#202522] dark:text-white">
                    My Sacred Library
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Your lifetime digital collection of illuminated volumes and religious manuscripts.
                  </p>
                </div>
                <Link
                  to="/books"
                  className="px-4 py-2 bg-[#077432] hover:bg-[#0A8D3E] text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Explore More Books</span>
                </Link>
              </div>

              {library.length === 0 ? (
                <div className="bg-white dark:bg-[#071A17] p-12 text-center rounded-3xl border border-[#DDE8E1] dark:border-white/10 space-y-4 shadow-sm">
                  <BookOpen className="w-12 h-12 text-[#077432] dark:text-[#34D399] mx-auto opacity-40" />
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-bold text-[#202522] dark:text-white">
                      Your Sacred Library is Empty
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                      Acquire illuminated books to unlock unlimited lifetime reading, bookmarks, and sacred insights.
                    </p>
                  </div>
                  <Link
                    to="/books"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#077432] text-white rounded-xl text-xs font-bold hover:bg-[#0A8D3E] transition-colors"
                  >
                    Browse Books Catalog
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {library.map((item: any) => {
                    const book = item.book;
                    const progress = progressList.find((p: any) => p.book?._id === book._id || p.book === book._id);
                    const percent = progress?.percentage || 0;

                    return (
                      <div
                        key={book._id}
                        className="bg-white dark:bg-[#071A17] rounded-3xl border border-[#DDE8E1] dark:border-white/10 p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-4">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-20 aspect-[3/4] object-cover rounded-xl shadow-book book-spine-shadow shrink-0"
                          />
                          <div className="space-y-1 min-w-0">
                            <span className="text-[10px] font-sans font-bold text-[#077432] dark:text-[#34D399] uppercase tracking-wider block">
                              Purchased Volume
                            </span>
                            <h3 className="font-serif font-bold text-base text-[#202522] dark:text-white truncate">
                              {book.title}
                            </h3>
                            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans truncate">
                              by {book.author}
                            </p>
                            <p className="text-[11px] text-stone-400 dark:text-stone-500 font-mono pt-1">
                              {book.pageCount || 15} Pages
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-white/10">
                          <div className="flex justify-between text-[11px] font-sans text-stone-600 dark:text-stone-300">
                            <span>Reading Progress</span>
                            <span className="font-mono font-bold text-[#077432] dark:text-[#34D399]">{percent}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#077432] dark:bg-[#34D399] rounded-full transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>

                        <Link
                          to={`/read/${book._id}?page=${progress?.currentPage || 1}`}
                          className="w-full py-2.5 bg-[#077432] hover:bg-[#0A8D3E] text-white text-xs font-semibold rounded-xl text-center transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>{percent > 0 ? 'Continue Reading' : 'Start Reading'}</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BOOKMARKS & NOTES */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#202522] dark:text-white">
                  Bookmarks & Sacred Reflections
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Quick access to all passages, pages, and personal annotations you bookmarked while reading.
                </p>
              </div>

              <div className="bg-white dark:bg-[#071A17] rounded-3xl border border-[#DDE8E1] dark:border-white/10 p-6 space-y-4 shadow-sm">
                {bookmarks.length === 0 ? (
                  <p className="text-xs text-stone-500 dark:text-stone-400 text-center py-12">
                    You have not saved any bookmarks yet. Click the bookmark icon inside any book reader to save highlights and personal thoughts.
                  </p>
                ) : (
                  <div className="divide-y divide-stone-100 dark:divide-white/10">
                    {bookmarks.map((bm: any) => (
                      <div key={bm._id} className="py-4 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-xs font-mono font-bold text-[#077432] dark:text-[#34D399]">
                            Page #{bm.pageNumber}
                          </span>
                          <h4 className="font-serif font-bold text-sm text-[#202522] dark:text-white">
                            {bm.book?.title || 'Book Title'}
                          </h4>
                          {bm.note && (
                            <p className="text-xs text-stone-600 dark:text-stone-300 italic">
                              "{bm.note}"
                            </p>
                          )}
                        </div>

                        <Link
                          to={`/read/${bm.book?._id || bm.book}?page=${bm.pageNumber}`}
                          className="px-3.5 py-1.5 bg-stone-100 dark:bg-white/5 hover:bg-[#E8F6ED] dark:hover:bg-[#077432]/30 text-[#077432] dark:text-[#34D399] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                        >
                          <span>Open Page</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ORDER INVOICES */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#202522] dark:text-white">
                  Order Invoices & Transactions
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Review complete receipts and acquisition records for your purchases.
                </p>
              </div>

              <div className="bg-white dark:bg-[#071A17] rounded-3xl border border-[#DDE8E1] dark:border-white/10 overflow-hidden shadow-sm">
                {orders.length === 0 ? (
                  <p className="text-xs text-stone-500 dark:text-stone-400 text-center py-12">
                    No order transactions recorded yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-stone-50 dark:bg-white/5 border-b border-[#DDE8E1] dark:border-white/10 text-stone-700 dark:text-stone-300 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="py-3 px-4">Invoice Reference</th>
                          <th className="py-3 px-4">Purchased Titles</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-white/10 font-mono">
                        {orders.map((ord: any) => (
                          <tr key={ord._id} className="hover:bg-stone-50 dark:hover:bg-white/5">
                            <td className="py-3.5 px-4 font-bold text-[#077432] dark:text-[#34D399]">
                              {ord.transactionReference}
                            </td>
                            <td className="py-3.5 px-4 font-sans text-[#202522] dark:text-stone-200">
                              {ord.items?.map((i: any) => i.title).join(', ')}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-[#202522] dark:text-white">
                              ${ord.totalAmount?.toFixed(2)} {ord.currency}
                            </td>
                            <td className="py-3.5 px-4">
                              <Badge variant={ord.paymentStatus}>{ord.paymentStatus}</Badge>
                            </td>
                            <td className="py-3.5 px-4 text-stone-500 dark:text-stone-400 text-[11px]">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ACCOUNT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#202522] dark:text-white">
                  Account Settings
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Update your personal seeker details, modify your password, or manage your account status.
                </p>
              </div>

              {/* 1. Edit Profile Form */}
              <div className="bg-white dark:bg-[#071A17] rounded-3xl border border-[#DDE8E1] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-stone-100 dark:border-white/10 pb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#202522] dark:text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-[#077432]" />
                      <span>Personal & Contact Information</span>
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {isEditingProfile
                        ? 'Fields unlocked for editing. Update your details below.'
                        : 'Input fields are locked. Click the pencil icon to edit your information.'}
                    </p>
                  </div>

                  {/* Top Right Pencil Action Button */}
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-sans font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs border ${
                      isEditingProfile
                        ? 'bg-[#077432] text-white border-[#077432] shadow-sm'
                        : 'bg-stone-50 hover:bg-stone-100 dark:bg-white/5 dark:hover:bg-white/10 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-white/10'
                    }`}
                    title={isEditingProfile ? 'Lock inputs' : 'Unlock and edit inputs'}
                    aria-label="Toggle profile editing"
                  >
                    <Pencil className={`w-3.5 h-3.5 ${isEditingProfile ? 'text-white' : 'text-[#077432] dark:text-[#34D399]'}`} />
                    <span>{isEditingProfile ? 'Editing' : 'Edit'}</span>
                  </button>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-sans font-bold text-stone-700 dark:text-stone-300">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        required
                        disabled={!isEditingProfile}
                        className={`w-full px-4 py-2.5 text-xs rounded-xl border transition-all ${
                          !isEditingProfile
                            ? 'bg-stone-100/60 dark:bg-white/[0.03] border-stone-200/80 dark:border-white/10 text-stone-600 dark:text-stone-300 cursor-not-allowed select-none'
                            : 'bg-stone-50 dark:bg-white/5 border-[#077432]/40 dark:border-[#077432]/60 text-[#202522] dark:text-white focus:outline-none focus:border-[#077432] focus:ring-1 focus:ring-[#077432]'
                        }`}
                        placeholder="e.g. Ahmad"
                      />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-sans font-bold text-stone-700 dark:text-stone-300">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        disabled={!isEditingProfile}
                        className={`w-full px-4 py-2.5 text-xs rounded-xl border transition-all ${
                          !isEditingProfile
                            ? 'bg-stone-100/60 dark:bg-white/[0.03] border-stone-200/80 dark:border-white/10 text-stone-600 dark:text-stone-300 cursor-not-allowed select-none'
                            : 'bg-stone-50 dark:bg-white/5 border-[#077432]/40 dark:border-[#077432]/60 text-[#202522] dark:text-white focus:outline-none focus:border-[#077432] focus:ring-1 focus:ring-[#077432]'
                        }`}
                        placeholder="e.g. Al-Mansoor"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-sans font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#077432]" />
                        <span>Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phoneNumber}
                        onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                        disabled={!isEditingProfile}
                        className={`w-full px-4 py-2.5 text-xs rounded-xl border transition-all ${
                          !isEditingProfile
                            ? 'bg-stone-100/60 dark:bg-white/[0.03] border-stone-200/80 dark:border-white/10 text-stone-600 dark:text-stone-300 cursor-not-allowed select-none'
                            : 'bg-stone-50 dark:bg-white/5 border-[#077432]/40 dark:border-[#077432]/60 text-[#202522] dark:text-white focus:outline-none focus:border-[#077432] focus:ring-1 focus:ring-[#077432]'
                        }`}
                        placeholder="e.g. +1 234 567 8900"
                      />
                    </div>

                    {/* Spiritual Focus */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-sans font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-[#077432]" />
                        <span>Spiritual / Scholarly Focus</span>
                      </label>
                      <select
                        value={profileForm.spiritualFocus}
                        onChange={(e) => setProfileForm({ ...profileForm, spiritualFocus: e.target.value })}
                        disabled={!isEditingProfile}
                        className={`w-full px-4 py-2.5 text-xs rounded-xl border transition-all ${
                          !isEditingProfile
                            ? 'bg-stone-100/60 dark:bg-white/[0.03] border-stone-200/80 dark:border-white/10 text-stone-600 dark:text-stone-300 cursor-not-allowed select-none'
                            : 'bg-stone-50 dark:bg-white/5 border-[#077432]/40 dark:border-[#077432]/60 text-[#202522] dark:text-white focus:outline-none focus:border-[#077432] focus:ring-1 focus:ring-[#077432]'
                        }`}
                      >
                        <option value="" className="text-black bg-white">Select an area of interest</option>
                        <option value="Quranic Reflection & Tafsir" className="text-black bg-white">Quranic Reflection & Tafsir</option>
                        <option value="Hadith Sciences & Prophetic Sunnah" className="text-black bg-white">Hadith Sciences & Prophetic Sunnah</option>
                        <option value="Islamic Jurisprudence (Fiqh)" className="text-black bg-white">Islamic Jurisprudence (Fiqh)</option>
                        <option value="Purification of Soul (Tazkiyah)" className="text-black bg-white">Purification of Soul (Tazkiyah)</option>
                        <option value="Islamic History & Civilizations" className="text-black bg-white">Islamic History & Civilizations</option>
                        <option value="General Islamic Wisdom & Morals" className="text-black bg-white">General Islamic Wisdom & Morals</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* City */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-sans font-bold text-stone-700 dark:text-stone-300">
                        City
                      </label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        disabled={!isEditingProfile}
                        className={`w-full px-4 py-2.5 text-xs rounded-xl border transition-all ${
                          !isEditingProfile
                            ? 'bg-stone-100/60 dark:bg-white/[0.03] border-stone-200/80 dark:border-white/10 text-stone-600 dark:text-stone-300 cursor-not-allowed select-none'
                            : 'bg-stone-50 dark:bg-white/5 border-[#077432]/40 dark:border-[#077432]/60 text-[#202522] dark:text-white focus:outline-none focus:border-[#077432] focus:ring-1 focus:ring-[#077432]'
                        }`}
                        placeholder="e.g. Medina, London, Dallas"
                      />
                    </div>

                    {/* Country */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-sans font-bold text-stone-700 dark:text-stone-300">
                        Country
                      </label>
                      <input
                        type="text"
                        value={profileForm.country}
                        onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                        disabled={!isEditingProfile}
                        className={`w-full px-4 py-2.5 text-xs rounded-xl border transition-all ${
                          !isEditingProfile
                            ? 'bg-stone-100/60 dark:bg-white/[0.03] border-stone-200/80 dark:border-white/10 text-stone-600 dark:text-stone-300 cursor-not-allowed select-none'
                            : 'bg-stone-50 dark:bg-white/5 border-[#077432]/40 dark:border-[#077432]/60 text-[#202522] dark:text-white focus:outline-none focus:border-[#077432] focus:ring-1 focus:ring-[#077432]'
                        }`}
                        placeholder="e.g. United Kingdom"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-bold text-stone-700 dark:text-stone-300">
                      Personal Bio / Spiritual Reflection
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      disabled={!isEditingProfile}
                      className={`w-full px-4 py-2.5 text-xs rounded-xl border transition-all ${
                        !isEditingProfile
                          ? 'bg-stone-100/60 dark:bg-white/[0.03] border-stone-200/80 dark:border-white/10 text-stone-600 dark:text-stone-300 cursor-not-allowed select-none'
                          : 'bg-stone-50 dark:bg-white/5 border-[#077432]/40 dark:border-[#077432]/60 text-[#202522] dark:text-white focus:outline-none focus:border-[#077432] focus:ring-1 focus:ring-[#077432]'
                      }`}
                      placeholder="Share your goals or love for Islamic literature..."
                    />
                  </div>

                  {isEditingProfile && (
                    <div className="flex items-center justify-end gap-3 pt-2 animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => {
                          if (user) {
                            setProfileForm({
                              firstName: user.firstName || (user.name ? user.name.split(' ')[0] : ''),
                              lastName: user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : ''),
                              phoneNumber: user.phoneNumber || '',
                              bio: user.bio || '',
                              spiritualFocus: user.spiritualFocus || '',
                              city: user.city || '',
                              country: user.country || '',
                              preferredReadingMode: user.preferredReadingMode || 'classic',
                            });
                          }
                          setIsEditingProfile(false);
                        }}
                        className="px-4 py-2.5 border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="px-6 py-2.5 bg-[#077432] hover:bg-[#065F29] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* 2. Security: Change Password */}
              <div className="bg-white dark:bg-[#071A17] rounded-3xl border border-[#DDE8E1] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-stone-100 dark:border-white/10 pb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#202522] dark:text-white flex items-center gap-2">
                      <Key className="w-5 h-5 text-[#077432]" />
                      <span>Security & Password</span>
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {isEditingPassword
                        ? 'Password fields unlocked. Enter your current and new credentials.'
                        : 'Password fields are locked. Click the pencil icon to change your password.'}
                    </p>
                  </div>

                  {/* Top Right Pencil Action Button */}
                  <button
                    type="button"
                    onClick={() => setIsEditingPassword(!isEditingPassword)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-sans font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs border ${
                      isEditingPassword
                        ? 'bg-[#077432] text-white border-[#077432] shadow-sm'
                        : 'bg-stone-50 hover:bg-stone-100 dark:bg-white/5 dark:hover:bg-white/10 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-white/10'
                    }`}
                    title={isEditingPassword ? 'Lock password fields' : 'Unlock and change password'}
                    aria-label="Toggle password editing"
                  >
                    <Pencil className={`w-3.5 h-3.5 ${isEditingPassword ? 'text-white' : 'text-[#077432] dark:text-[#34D399]'}`} />
                    <span>{isEditingPassword ? 'Editing' : 'Edit'}</span>
                  </button>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-bold text-stone-700 dark:text-stone-300">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        required
                        disabled={!isEditingPassword}
                        className={`w-full pl-4 pr-10 py-2.5 text-xs rounded-xl border transition-all ${
                          !isEditingPassword
                            ? 'bg-stone-100/60 dark:bg-white/[0.03] border-stone-200/80 dark:border-white/10 text-stone-600 dark:text-stone-300 cursor-not-allowed select-none'
                            : 'bg-stone-50 dark:bg-white/5 border-[#077432]/40 dark:border-[#077432]/60 text-[#202522] dark:text-white focus:outline-none focus:border-[#077432] focus:ring-1 focus:ring-[#077432]'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        disabled={!isEditingPassword}
                        className={`absolute right-3 top-2.5 transition-colors ${
                          !isEditingPassword
                            ? 'text-stone-300 dark:text-stone-600 cursor-not-allowed'
                            : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer'
                        }`}
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-bold text-stone-700 dark:text-stone-300">
                      New Password (minimum 6 characters)
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                        disabled={!isEditingPassword}
                        className={`w-full pl-4 pr-10 py-2.5 text-xs rounded-xl border transition-all ${
                          !isEditingPassword
                            ? 'bg-stone-100/60 dark:bg-white/[0.03] border-stone-200/80 dark:border-white/10 text-stone-600 dark:text-stone-300 cursor-not-allowed select-none'
                            : 'bg-stone-50 dark:bg-white/5 border-[#077432]/40 dark:border-[#077432]/60 text-[#202522] dark:text-white focus:outline-none focus:border-[#077432] focus:ring-1 focus:ring-[#077432]'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        disabled={!isEditingPassword}
                        className={`absolute right-3 top-2.5 transition-colors ${
                          !isEditingPassword
                            ? 'text-stone-300 dark:text-stone-600 cursor-not-allowed'
                            : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer'
                        }`}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-bold text-stone-700 dark:text-stone-300">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      disabled={!isEditingPassword}
                      className={`w-full px-4 py-2.5 text-xs rounded-xl border transition-all ${
                        !isEditingPassword
                          ? 'bg-stone-100/60 dark:bg-white/[0.03] border-stone-200/80 dark:border-white/10 text-stone-600 dark:text-stone-300 cursor-not-allowed select-none'
                          : 'bg-stone-50 dark:bg-white/5 border-[#077432]/40 dark:border-[#077432]/60 text-[#202522] dark:text-white focus:outline-none focus:border-[#077432] focus:ring-1 focus:ring-[#077432]'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>

                  {isEditingPassword && (
                    <div className="flex items-center justify-end gap-3 pt-2 animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => {
                          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          setIsEditingPassword(false);
                        }}
                        className="px-4 py-2.5 border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingPassword}
                        className="px-6 py-2.5 bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Key className="w-4 h-4" />
                        <span>{isSavingPassword ? 'Updating Password...' : 'Update Password'}</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* 3. Danger Zone: Delete Account */}
              <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-3xl border border-rose-200 dark:border-rose-900/40 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5 text-rose-600">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <h3 className="font-serif font-bold text-lg">Delete Account</h3>
                </div>

                <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed max-w-2xl">
                  Deleting your account is permanent. If you delete your account, your profile data, lifetime library access to acquired books, study bookmarks, and order invoices will be permanently wiped.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete My Account</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white dark:bg-[#071A17] rounded-3xl border border-stone-200 dark:border-white/10 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif text-2xl font-bold text-[#202522] dark:text-white">
                Permanent Account Deletion
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                This action cannot be undone. All your sacred volumes, bookmarks, and account records will be permanently erased.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-sans font-bold text-stone-700 dark:text-stone-300">
                To confirm, type <span className="font-mono text-rose-600 font-extrabold">DELETE</span> below:
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-white/5 border border-rose-300 dark:border-rose-900 rounded-xl text-[#202522] dark:text-white focus:outline-none focus:border-rose-600 text-center font-mono font-bold uppercase tracking-wider"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmationText('');
                }}
                className="py-3 px-4 rounded-xl text-xs font-sans font-bold border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmationText !== 'DELETE' || isDeletingAccount}
                className="py-3 px-4 rounded-xl text-xs font-sans font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isDeletingAccount ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal from Dashboard Sidebar */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white dark:bg-[#071A17] rounded-3xl border border-stone-200 dark:border-white/10 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center transform transition-all scale-100"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center mx-auto shadow-inner">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-[#202522] dark:text-white">
                Confirm Sign Out
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                Are you sure you want to end your current session? You can return anytime to continue your sacred readings.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-sans font-bold border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSidebarLogout}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-sans font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors cursor-pointer"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
