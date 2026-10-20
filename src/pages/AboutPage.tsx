import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, HeartHandshake, Feather, Compass, ArrowRight } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Button } from '../components/common/Button';

export const AboutPage: React.FC = () => {
  const [showFullAuthor, setShowFullAuthor] = useState(false);

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
                loading="lazy"
                decoding="async"
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

      {/* About the Author */}
      <section className="py-16 sm:py-20 bg-stone-50/70 dark:bg-[#051814] border-y border-[#DDE8E1] dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522] dark:text-white">
              About the Author
            </h2>
          </div>

          <article className={`relative w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 pb-16 sm:p-8 sm:pb-16 bg-white dark:bg-[#071A17] rounded-3xl border border-[#DDE8E1] dark:border-white/10 shadow-sm transition-[max-height] duration-300 ${showFullAuthor ? 'max-h-[2000px]' : 'max-h-[420px] overflow-hidden'}`}>
            <div className="lg:col-span-4 flex items-start justify-center">
              <img
                src="/images/waliyat-sulaimon-bolanle.jpg"
                alt="Waliyat Sulaimon Bolanle"
                className="h-52 w-52 sm:h-56 sm:w-56 rounded-full object-cover border-4 border-[#077432]/20 shadow-md"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#077432] dark:text-[#34D399]">About</p>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522] dark:text-white">Waliyat Sulaimon Bolanle</h3>
                <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                  Greetings, I'm Waliyat—an accomplished entrepreneur and seasoned Human Resources administrator. Leveraging extensive experience in administration, I specialize in delivering professional services:
                </p>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                <li><strong className="text-[#202522] dark:text-white">Professional Writing:</strong> Crafting compelling content tailored to your specific needs.</li>
                <li><strong className="text-[#202522] dark:text-white">Translation Services:</strong> Proficient in translating both audio and video content.</li>
                <li><strong className="text-[#202522] dark:text-white">Accurate Transcription:</strong> Transforming spoken words into precise written text.</li>
                <li><strong className="text-[#202522] dark:text-white">Virtual Assistance:</strong> Providing reliable virtual support for various tasks.</li>
                <li><strong className="text-[#202522] dark:text-white">Email Copy Management:</strong> Expertly handling and composing effective email communications.</li>
                <li><strong className="text-[#202522] dark:text-white">Strategic Content Creation:</strong> Generating engaging and relevant content across diverse topics.</li>
                <li><strong className="text-[#202522] dark:text-white">Efficient Data Scraping:</strong> Extracting valuable insights through streamlined data scraping.</li>
                <li><strong className="text-[#202522] dark:text-white">Precise Data Entry:</strong> Ensuring accuracy and efficiency in handling data.</li>
                <li><strong className="text-[#202522] dark:text-white">Focused Web Scraping:</strong> Extracting targeted information from websites.</li>
              </ul>

              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed border-t border-[#DDE8E1] dark:border-white/10 pt-5">
                Dedication and expertise define my approach to every project, guaranteeing top-notch results. Let's collaborate to elevate your business to new heights!
              </p>
            </div>
            {!showFullAuthor && <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white dark:from-[#071A17] to-transparent pointer-events-none" />}
            <div className="absolute bottom-5 right-6 sm:right-8 z-10 text-right">
              <button
                type="button"
                aria-expanded={showFullAuthor}
                onClick={() => setShowFullAuthor(value => !value)}
                className="text-sm font-semibold text-[#077432] dark:text-[#A3DAB7] underline underline-offset-4 hover:text-[#065F29] dark:hover:text-white"
              >
                {showFullAuthor ? 'Read less' : 'Read more'}
              </button>
            </div>
          </article>
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
