import React from 'react';
import { Modal } from '../common/Modal';
import { Sun, Moon, Coffee, Type, AlignLeft, Maximize2 } from 'lucide-react';

export interface ReaderSettings {
  theme: 'paper' | 'sepia' | 'dark';
  fontSize: number; // 14, 16, 18, 20, 24
  fontFamily: 'serif' | 'sans';
  maxWidth: 'compact' | 'standard' | 'wide';
  lineHeight: 'tight' | 'normal' | 'relaxed';
}

interface ReaderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
}

export const ReaderSettingsModal: React.FC<ReaderSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reading Preferences" maxWidth="md">
      <div className="space-y-6 text-ink-900">
        {/* Themes Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
            Reading Theme
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onUpdateSettings({ theme: 'paper' })}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all ${
                settings.theme === 'paper'
                  ? 'border-brand-500 ring-2 ring-brand-500/20 bg-[#FAF8F5] text-ink-950 font-bold'
                  : 'border-stone-200 bg-[#FAF8F5] text-ink-700 hover:border-stone-300'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-600" />
              <span>Paper / Day</span>
            </button>

            <button
              onClick={() => onUpdateSettings({ theme: 'sepia' })}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all ${
                settings.theme === 'sepia'
                  ? 'border-brand-500 ring-2 ring-brand-500/20 bg-[#F6EFE2] text-[#382C1E] font-bold'
                  : 'border-stone-200 bg-[#F6EFE2] text-[#5A4731] hover:border-stone-300'
              }`}
            >
              <Coffee className="w-4 h-4 text-[#8C6B45]" />
              <span>Warm Sepia</span>
            </button>

            <button
              onClick={() => onUpdateSettings({ theme: 'dark' })}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all ${
                settings.theme === 'dark'
                  ? 'border-brand-500 ring-2 ring-brand-500/20 bg-[#121110] text-white font-bold'
                  : 'border-stone-700 bg-[#1A1918] text-stone-300 hover:border-stone-600'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Obsidian Night</span>
            </button>
          </div>
        </div>

        {/* Font Size Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
            Font Size: {settings.fontSize}px
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif">A</span>
            <input
              type="range"
              min={14}
              max={24}
              step={1}
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
              className="flex-1 accent-brand-500 cursor-pointer h-1.5 bg-stone-200 rounded"
            />
            <span className="text-xl font-serif">A</span>
          </div>
        </div>

        {/* Typeface Toggle */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
            Typography Style
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onUpdateSettings({ fontFamily: 'serif' })}
              className={`p-3 rounded-lg border text-sm transition-all text-center ${
                settings.fontFamily === 'serif'
                  ? 'border-brand-500 ring-2 ring-brand-500/20 bg-white font-serif font-bold text-ink-950'
                  : 'border-stone-200 bg-white font-serif text-ink-700 hover:border-stone-300'
              }`}
            >
              Classic Serif (Playfair)
            </button>
            <button
              onClick={() => onUpdateSettings({ fontFamily: 'sans' })}
              className={`p-3 rounded-lg border text-sm transition-all text-center ${
                settings.fontFamily === 'sans'
                  ? 'border-brand-500 ring-2 ring-brand-500/20 bg-white font-sans font-bold text-ink-950'
                  : 'border-stone-200 bg-white font-sans text-ink-700 hover:border-stone-300'
              }`}
            >
              Clean Modern Sans
            </button>
          </div>
        </div>

        {/* Reading Column Width */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
            Reading Width
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs font-medium">
            <button
              onClick={() => onUpdateSettings({ maxWidth: 'compact' })}
              className={`py-2 rounded-md border text-center transition-all ${
                settings.maxWidth === 'compact'
                  ? 'border-brand-500 bg-brand-50 text-brand-900 font-bold'
                  : 'border-stone-200 bg-white text-ink-700 hover:bg-stone-50'
              }`}
            >
              Compact
            </button>
            <button
              onClick={() => onUpdateSettings({ maxWidth: 'standard' })}
              className={`py-2 rounded-md border text-center transition-all ${
                settings.maxWidth === 'standard'
                  ? 'border-brand-500 bg-brand-50 text-brand-900 font-bold'
                  : 'border-stone-200 bg-white text-ink-700 hover:bg-stone-50'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => onUpdateSettings({ maxWidth: 'wide' })}
              className={`py-2 rounded-md border text-center transition-all ${
                settings.maxWidth === 'wide'
                  ? 'border-brand-500 bg-brand-50 text-brand-900 font-bold'
                  : 'border-stone-200 bg-white text-ink-700 hover:bg-stone-50'
              }`}
            >
              Wide
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
