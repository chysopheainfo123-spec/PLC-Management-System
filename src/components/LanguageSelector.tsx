import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'kh', label: 'ភាសាខ្មែរ', flag: 'https://flagcdn.com/w40/kh.png' },
  { code: 'en', label: 'English', flag: 'https://flagcdn.com/w40/us.png' },
];

export default function LanguageSelector({ className = '' }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(
    localStorage.getItem('plc_lang') || 'kh'
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleLangChange = (e: any) => {
      if (e.detail) setCurrentLang(e.detail);
    };
    window.addEventListener("plcLanguageChange", handleLangChange);
    return () => window.removeEventListener("plcLanguageChange", handleLangChange);
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    
    // Update our internal system language
    localStorage.setItem("plc_lang", langCode);
    window.dispatchEvent(new CustomEvent("plcLanguageChange", { detail: langCode }));
    // Also trigger storage event for components that listen to it
    window.dispatchEvent(new Event("storage"));

    // Google Translate integration
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    
    // Map internal language codes to Google Translate expected codes
    let googLangCode = langCode;
    if (langCode === 'zh') googLangCode = 'zh-CN';
    if (langCode === 'kh') googLangCode = 'km';

    if (select) {
      select.value = googLangCode;
      select.dispatchEvent(new Event('change'));
    } else {
      document.cookie = `googtrans=/km/${googLangCode}; path=/; domain=${window.location.hostname}`;
      if (window.location.hostname.split('.').length > 1) {
        document.cookie = `googtrans=/km/${googLangCode}; path=/; domain=.${window.location.hostname}`;
      }
    }
  };

  const selectedLang = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className={`relative inline-block text-left shrink-0 ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-1 py-1 text-white hover:text-white/80 cursor-pointer transition-all duration-200 active:scale-95 shrink-0 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={currentLang === 'kh' ? 'ជ្រើសរើសភាសា' : 'Select Language'}
      >
        <div className="w-4.5 h-4.5 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-white/40 shadow-2xs">
          <img src={selectedLang.flag} alt="" className="w-full h-full object-cover scale-110" />
        </div>
        <span className="text-[11px] font-black tracking-wider uppercase font-sans leading-none">{selectedLang.code}</span>
        <ChevronDown className={`w-3 h-3 text-white/80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-[999] mt-2 w-48 origin-top-right bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden text-slate-800"
          >
            <div className="px-3.5 py-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
              <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                {currentLang === 'kh' ? 'ជ្រើសរើសភាសា' : 'Select Language'}
              </p>
            </div>
            <div className="p-1.5 space-y-0.5">
              {LANGUAGES.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 text-[#4352b2]'
                        : 'text-slate-700 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-200/80 flex items-center justify-center shrink-0 bg-white shadow-2xs">
                        <img src={lang.flag} alt="" className="w-full h-full object-cover scale-110" />
                      </div>
                      <span className="font-sans">{lang.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#4352b2]" strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
