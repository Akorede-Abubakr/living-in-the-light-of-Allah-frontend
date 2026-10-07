import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#077432] dark:bg-[#051814] text-[#F8F5ED] border-t border-[#0A8D3E] dark:border-white/10 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#0A8D3E]/60 dark:border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md">
                <img src="/logo.png" alt="Living in the light of Allah" className="w-full h-full object-contain" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Living in the light of Allah
              </span>
            </Link>
            <p className="text-sm text-[#DDE8E1]/90 max-w-sm leading-relaxed">
              A curated digital publishing platform and bookstore dedicated to timeless Islamic wisdom, classical philosophy, self-mastery, and spiritual illumination.
            </p>
            <div className="pt-2">
              <p className="text-xs uppercase tracking-widest text-[#C6A15B] font-mono font-semibold">
                Illuminating Hearts & Minds with Knowledge
              </p>
            </div>
          </div>

          {/* Col 1: Explore */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#C6A15B] font-semibold mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#DDE8E1]">
              <li>
                <Link to="/books" className="hover:text-white transition-colors">
                  All Books
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  My blog & Reflections
                </Link>
              </li>
              <li>
                <Link to="/books?featured=true" className="hover:text-white transition-colors">
                  Featured Works
                </Link>
              </li>
              <li>
                <Link to="/books?sortBy=popular" className="hover:text-white transition-colors">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link to="/books?sortBy=newest" className="hover:text-white transition-colors">
                  New Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#C6A15B] font-semibold mb-4">
              Curations
            </h4>
            <ul className="space-y-2.5 text-sm text-[#DDE8E1]">
              <li>
                <Link to="/books?category=philosophy-thought" className="hover:text-white transition-colors">
                  Philosophy & Thought
                </Link>
              </li>
              <li>
                <Link to="/books?category=self-development" className="hover:text-white transition-colors">
                  Self Development
                </Link>
              </li>
              <li>
                <Link to="/books?category=history-wisdom" className="hover:text-white transition-colors">
                  History & Wisdom
                </Link>
              </li>
              <li>
                <Link to="/books?category=business-ethics" className="hover:text-white transition-colors">
                  Business & Ethics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Reader & Account */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#C6A15B] font-semibold mb-4">
              Reading
            </h4>
            <ul className="space-y-2.5 text-sm text-[#DDE8E1]">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  My Library
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=bookmarks" className="hover:text-white transition-colors">
                  Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=orders" className="hover:text-white transition-colors">
                  Order Invoices
                </Link>
              </li>
              
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#DDE8E1]/75">
          <p>© {new Date().getFullYear()} Living in the light of Allah. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Publishing Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
