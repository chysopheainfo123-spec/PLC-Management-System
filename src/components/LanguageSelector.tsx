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
        className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-3xs flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 shrink-0 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-md overflow-hidden border border-white/40 flex items-center justify-center shrink-0 bg-white">
          <img src={selectedLang.flag} alt="" className="w-full h-full object-cover scale-110" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-[100] mt-2 w-48 origin-top-right bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-slate-50">
              <p className="text-[11px] font-bold text-slate-400 tracking-wide">
                {currentLang === 'kh' ? 'ជ្រើសរើសភាសា' : 'Select Language'}
              </p>
            </div>
            <div className="p-1.5">
              {LANGUAGES.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-bold transition-colors ${
                      isSelected
                        ? 'bg-primary-50/80 text-primary-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-[22px] h-[22px] rounded-md overflow-hidden border border-slate-200 flex items-center justify-center shrink-0 bg-white">
                        <img src={lang.flag} alt="" className="w-full h-full object-cover scale-110" />
                      </div>
                      <span className="pb-0.5">{lang.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary-600" strokeWidth={3} />}
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
