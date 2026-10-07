import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Shield, HeartHandshake, Feather, Compass, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Button } from '../components/common/Button';

export const AboutPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#071A17] text-[#202522] dark:text-[#F8F5ED] transition-colors duration-200 animate-fadeIn">
      <SEO
        title="About Us — Living in the light of Allah"
        description="Learn about our mission to curate timeless Islamic wisdom, classical philosophy, and spiritual enlightenment for seekers worldwide."
      />

      {/* Hero / Header Section */}
      <section className="relative py-16 sm:py-24 border-b border-[#DDE8E1] dark:border-white/10 bg-gradient-to-b from-[#FAF8F5] via-white to-white dark:from-[#09221D] dark:via-[#071A17] dark:to-[#071A17]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#202522] dark:text-white leading-[1.15]">
            Illuminating Hearts & Minds <br className="hidden sm:inline" />
            <span className="italic text-[#077432] dark:text-[#34D399]">Through Timeless Knowledge.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
            <strong>Living in the light of Allah</strong> is a curated digital publishing sanctuary committed to timeless Islamic literature, spiritual philosophy, and the preservation of classical intellectual heritage.
          </p>
        </div>
      </section>

      {/* Narrative & Editorial Mission */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6 space-y-5 font-sans text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522] dark:text-white leading-snug">
              Bridging Millennia of Wisdom with the Needs of the Modern Soul
            </h2>
            <p>
              In an age characterized by ceaseless distraction and fragmented information, genuine depth has become a rarity. We believe that true spiritual and intellectual fulfillment requires deliberate contemplation of enduring truths.
            </p>
            <p>
              Our platform curates texts authored by classical masters and rigorous contemporary thinkers — works crafted to nurture the spirit, discipline the intellect, and guide human purpose.
            </p>
            <div className="pt-2">
              <div className="p-4 rounded-xl border-l-4 border-[#077432] bg-stone-50 dark:bg-white/5 font-serif italic text-sm text-stone-800 dark:text-stone-200">
                "Knowledge is that which enters the heart and transforms conduct, not merely that which fills the page."
              </div>
            </div>
          </div>

          <div className="md:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-[#DDE8E1] dark:border-white/10 group">
              <img
                src="/images/hero-bg.jpg"
                alt="Sacred Architecture"
                className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                <p className="text-xs font-mono text-white/90">
                  Classical sanctuary architecture — symbolizing harmony, precision, and devotion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="py-16 sm:py-20 bg-stone-50/70 dark:bg-[#051814] border-y border-[#DDE8E1] dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#202522] dark:text-white">
              What Defines Our Platform
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Every volume, digital feature, and community standard adheres to four foundational values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white dark:bg-[#071A17] rounded-2xl border border-[#DDE8E1] dark:border-white/10 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#077432]/10 dark:bg-[#077432]/25 text-[#077432] dark:text-[#34D399] flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#202522] dark:text-white">
                Sacred Scholarship
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                Rigorous vetting of editions, translations, and commentaries to preserve doctrinal accuracy and intellectual prestige.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#071A17] rounded-2xl border border-[#DDE8E1] dark:border-white/10 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#077432]/10 dark:bg-[#077432]/25 text-[#077432] dark:text-[#34D399] flex items-center justify-center">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#202522] dark:text-white">
                Mindful Reader UI
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                Engineered for deep contemplation with Kindle-level typography, chapter pagination, bookmarks, and sepia & night modes.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#071A17] rounded-2xl border border-[#DDE8E1] dark:border-white/10 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#077432]/10 dark:bg-[#077432]/25 text-[#077432] dark:text-[#34D399] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#202522] dark:text-white">
                Categorical Breadth
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                Covering philosophy, spirituality, ethical commerce, history, and classical logic across organized thematic domains.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#071A17] rounded-2xl border border-[#DDE8E1] dark:border-white/10 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#077432]/10 dark:bg-[#077432]/25 text-[#077432] dark:text-[#34D399] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#202522] dark:text-white">
                Lifetime Stewardship
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                Unrestricted lifetime digital ownership of your acquired library with automated sync across every device you read on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advisory & Curation Fellowship */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522] dark:text-white">
            Editorial Direction
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Guided by scholars, translators, and educators dedicated to classical clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 bg-white dark:bg-[#071A17] rounded-2xl border border-[#DDE8E1] dark:border-white/10 text-center space-y-3 shadow-sm">
            <img
              src="/images/scholar-1.jpg"
              alt="Shaykh Tariq Al-Mansoor"
              className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-[#077432]/30 shadow-md"
            />
            <div>
              <h4 className="font-serif font-bold text-base text-[#202522] dark:text-white">
                Shaykh Tariq Al-Mansoor
              </h4>
              <p className="text-xs text-[#077432] dark:text-[#34D399] font-mono">Classical Islamic Thought</p>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
              Specialist in classical jurisprudential texts and traditional metaphysical philosophy.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-[#071A17] rounded-2xl border border-[#DDE8E1] dark:border-white/10 text-center space-y-3 shadow-sm">
            <img
              src="/images/scholar-2.jpg"
              alt="Dr. Hamza Yusufi"
              className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-[#077432]/30 shadow-md"
            />
            <div>
              <h4 className="font-serif font-bold text-base text-[#202522] dark:text-white">
                Dr. Hamza Yusufi
              </h4>
              <p className="text-xs text-[#077432] dark:text-[#34D399] font-mono">Philosophy & Ethics</p>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
              Researcher in comparative intellectual history, modern epistemology, and bioethics.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-[#071A17] rounded-2xl border border-[#DDE8E1] dark:border-white/10 text-center space-y-3 shadow-sm">
            <img
              src="/images/scholar-3.jpg"
              alt="Ustadha Fatima Zahra"
              className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-[#077432]/30 shadow-md"
            />
            <div>
              <h4 className="font-serif font-bold text-base text-[#202522] dark:text-white">
                Ustadha Fatima Zahra
              </h4>
              <p className="text-xs text-[#077432] dark:text-[#34D399] font-mono">Spiritual Development</p>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
              Educator focusing on moral purification (Tazkiyah) and spiritual equilibrium in daily life.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-stone-50 to-white dark:from-[#051814] dark:to-[#071A17] border-t border-[#DDE8E1] dark:border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#202522] dark:text-white">
            Begin Your Journey of Sacred Knowledge
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto leading-relaxed font-sans">
            Explore our curated catalog of illuminated titles, sample early chapters for free, and curate your private library.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/books">
              <Button variant="editorial" size="lg" className="w-full sm:w-auto px-8 py-3.5 text-base shadow-md">
                Browse Full Catalog
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
