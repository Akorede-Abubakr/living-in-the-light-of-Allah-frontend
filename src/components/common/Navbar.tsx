import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Bookmark,
  Receipt,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Settings,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success: showSuccessToast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmLogout = async () => {
    try {
      await logout();
      showSuccessToast('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      queryClient.clear();
      setIsLogoutModalOpen(false);
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
      navigate('/', { replace: true });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const homePath = isAuthenticated ? '/dashboard' : '/';

  const navLinks = [
    { name: 'Home', path: homePath },
    { name: 'Bookstore', path: '/books' },
    { name: 'Speech to Text', path: '/transcribe' },
    { name: 'LightBridge AI', path: '/chat' },
    { name: 'Journal', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/' || path === '/dashboard') {
      return isAuthenticated ? location.pathname === '/dashboard' : location.pathname === '/';
    }
    if (path === '/books' && (location.pathname === '/books' || location.pathname.startsWith('/books/'))) return true;
    if (path === '/blog' && (location.pathname === '/blog' || location.pathname.startsWith('/blog/'))) return true;
    return location.pathname === path;
  };

  const userFirstName = user?.firstName || (user?.name ? user.name.split(' ')[0] : 'Seeker');

  return (
    <>
      <header className="site-header sticky top-0 z-40 bg-white/95 dark:bg-[#071A17]/95 backdrop-blur-md border-b border-[#DDE8E1] dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link to={homePath} className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Living in the light of Allah"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-serif text-sm sm:text-lg font-bold text-[#202522] dark:text-white tracking-tight group-hover:text-[#077432] dark:group-hover:text-[#A3DAB7] transition-colors leading-none">
                  Living in the light of Allah
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  className={`px-2 py-2 rounded-xl text-sm font-sans transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-[#077432] text-white font-semibold shadow-sm'
                      : 'text-stone-700 dark:text-stone-300 hover:text-[#077432] dark:hover:text-[#A3DAB7] hover:bg-[#077432]/10 font-medium'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Action Icons & Auth */}
            <div className="hidden xl:flex items-center gap-3">
              {/* Search Bar Trigger */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs bg-white dark:bg-white/5 border border-[#DDE8E1] dark:border-white/10 rounded-full text-[#202522] dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-[#077432] w-40 focus:w-44 transition-all shadow-sm"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-2.5 pointer-events-none" />
              </form>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#C6A15B]" />
                ) : (
                  <Moon className="w-4 h-4 text-stone-600" />
                )}
              </button>

              {isAuthenticated ? (
                /* Authenticated User Pill with Dropdown */
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    type="button"
                    className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-stone-50 dark:bg-white/5 hover:bg-[#077432]/10 border border-stone-200 dark:border-white/10 transition-all cursor-pointer group shadow-xs"
                    aria-expanded={isUserMenuOpen}
                    aria-label="User navigation menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#077432] text-white flex items-center justify-center font-serif font-bold text-xs shadow-xs">
                      {userFirstName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-sans font-semibold text-stone-800 dark:text-stone-100 group-hover:text-[#077432] dark:group-hover:text-[#A3DAB7] transition-colors">
                      {userFirstName}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                        isUserMenuOpen ? 'rotate-180 text-[#077432]' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#071A17] rounded-2xl border border-stone-200 dark:border-white/10 shadow-xl py-2 z-50 animate-fadeIn divide-y divide-stone-100 dark:divide-white/10">
                      <div className="px-4 py-2.5 flex items-center gap-1.5 border-b border-stone-100 dark:border-white/10">
                        <span className="text-[11px] font-sans text-stone-500 dark:text-stone-400">
                          Signed in as
                        </span>
                        <span className="font-serif font-bold text-xs sm:text-sm text-[#077432] dark:text-[#34D399] truncate">
                          {userFirstName}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard?tab=profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-sans text-stone-700 dark:text-stone-200 hover:bg-[#077432]/10 hover:text-[#077432] dark:hover:text-[#A3DAB7] transition-colors"
                        >
                          <User className="w-4 h-4 text-[#077432]" />
                          <span>My profile</span>
                        </Link>
                        <Link
                          to="/dashboard?tab=library"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-sans text-stone-700 dark:text-stone-200 hover:bg-[#077432]/10 hover:text-[#077432] dark:hover:text-[#A3DAB7] transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-[#077432]" />
                          <span>My Sacred Library</span>
                        </Link>
                        <Link
                          to="/dashboard?tab=settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-sans text-stone-700 dark:text-stone-200 hover:bg-[#077432]/10 hover:text-[#077432] dark:hover:text-[#A3DAB7] transition-colors"
                        >
                          <Settings className="w-4 h-4 text-[#077432]" />
                          <span>Settings</span>
                        </Link>
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsLogoutModalOpen(true);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-sans text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-600" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-sm font-sans font-medium text-stone-700 dark:text-stone-300 hover:text-[#077432] dark:hover:text-[#A3DAB7] transition-colors rounded-lg border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent active:outline-none active:ring-0 active:border-transparent active:bg-transparent select-none cursor-pointer"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 text-sm font-sans font-medium text-white bg-[#077432] hover:bg-[#065F29] rounded-full shadow-sm transition-all border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none focus:ring-offset-0 active:outline-none active:ring-0 active:border-transparent active:bg-transparent active:text-[#077432] dark:active:text-[#A3DAB7] active:shadow-none select-none cursor-pointer"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions: Theme Toggle & Menu Button */}
            <div className="flex xl:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-[#C6A15B]" />
                ) : (
                  <Moon className="w-5 h-5 text-stone-600" />
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-stone-600 dark:text-stone-300 hover:text-[#202522] rounded-lg cursor-pointer"
                aria-label="Toggle menu" aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-navigation" className="xl:hidden bg-white dark:bg-[#071A17] border-b border-[#DDE8E1] dark:border-white/10 px-4 pt-3 pb-6 space-y-4 animate-fadeIn">

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-stone-50 dark:bg-white/5 border border-[#DDE8E1] dark:border-white/10 rounded-xl text-[#202522] dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#077432]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            </form>

            <nav className="flex flex-col space-y-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-sans transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-[#077432] text-white font-semibold shadow-sm'
                      : 'text-stone-700 dark:text-stone-200 hover:bg-[#077432]/10 hover:text-[#077432] font-medium'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-3 border-t border-stone-100 dark:border-white/10 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-1.5 text-xs font-sans text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                    <span>Signed in as</span>
                    <span className="font-serif font-bold text-[#077432] dark:text-[#34D399]">{userFirstName}</span>
                  </div>
                  <Link
                    to="/dashboard?tab=profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-sans text-stone-700 dark:text-stone-200 flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-white/5 rounded-lg"
                  >
                    <User className="w-4 h-4 text-[#077432]" />
                    <span>My profile</span>
                  </Link>
                  <Link
                    to="/dashboard?tab=library"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-sans text-stone-700 dark:text-stone-200 flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-white/5 rounded-lg"
                  >
                    <BookOpen className="w-4 h-4 text-[#077432]" />
                    <span>My Sacred Library</span>
                  </Link>
                  <Link
                    to="/dashboard?tab=bookmarks"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-sans text-stone-700 dark:text-stone-200 flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-white/5 rounded-lg"
                  >
                    <Bookmark className="w-4 h-4 text-[#077432]" />
                    <span>Bookmarks &amp; Notes</span>
                  </Link>
                  <Link
                    to="/dashboard?tab=orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-sans text-stone-700 dark:text-stone-200 flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-white/5 rounded-lg"
                  >
                    <Receipt className="w-4 h-4 text-[#077432]" />
                    <span>Order Invoices</span>
                  </Link>
                  <Link
                    to="/dashboard?tab=settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-sans text-stone-700 dark:text-stone-200 flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-white/5 rounded-lg"
                  >
                    <Settings className="w-4 h-4 text-[#077432]" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="px-3 py-2 text-sm font-sans text-rose-600 text-left flex items-center gap-2 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-xs font-sans font-medium text-center text-stone-700 dark:text-stone-200 border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent active:outline-none active:ring-0 active:border-transparent active:bg-transparent rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-xs font-sans font-medium text-center text-white bg-[#077432] rounded-lg border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent active:outline-none active:ring-0 active:border-transparent active:bg-transparent active:text-[#077432] dark:active:text-[#A3DAB7]"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Confirmation Overlay Modal for Logout */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white dark:bg-[#071A17] rounded-3xl border border-stone-200 dark:border-white/10 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center transform transition-all scale-100"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center mx-auto shadow-inner">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3
                id="logout-dialog-title"
                className="font-serif text-2xl font-bold text-[#202522] dark:text-white"
              >
                Confirm Sign Out
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                Are you sure you want to end your current session? You can return anytime to continue reading from your sacred library.
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
                onClick={handleConfirmLogout}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-sans font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors cursor-pointer"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
