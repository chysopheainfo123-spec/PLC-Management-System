import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share, PlusSquare, MoreVertical } from 'lucide-react';

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    
    const hasDismissed = localStorage.getItem('pwa_banner_dismissed_v2') === 'true';

    // ONLY SHOW IF NOT STANDALONE AND NOT DISMISSED
    if (!isStandalone && !hasDismissed) {
      const timer = setTimeout(() => setShowBanner(true), 1500);

      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      window.addEventListener('beforeinstallprompt', handler);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // Show inline instructions instead of alert
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa_banner_dismissed_v2', 'true');
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 z-[9999] bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex flex-col gap-3 max-w-md mx-auto"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/20">
              <Download className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="text-sm font-bold text-slate-800 leading-tight">បន្ថែមកម្មវិធីទៅអេក្រង់ទូរស័ព្ទ</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">(Add App to Home Screen)</p>
            </div>
            <button 
              onClick={handleDismiss}
              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <AnimatePresence>
            {showInstructions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600 border border-slate-100 mb-2">
                  {isIOS ? (
                    <div className="flex flex-col gap-2">
                      <p className="font-bold text-slate-800 text-xs">សម្រាប់ iPhone/iPad៖</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-white p-1 rounded border border-slate-200"><Share className="w-3 h-3 text-blue-500" /></span>
                        <span>ចុចប៊ូតុង Share (ចែករំលែក)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-white p-1 rounded border border-slate-200"><PlusSquare className="w-3 h-3 text-slate-700" /></span>
                        <span>ជ្រើសរើសយក "Add to Home Screen"</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="font-bold text-slate-800 text-xs">សម្រាប់ Android / ផ្សេងៗ៖</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-white p-1 rounded border border-slate-200"><MoreVertical className="w-3 h-3 text-slate-700" /></span>
                        <span>ចុចលើម៉ឺនុយ Browser (ចំណុច៣)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-white p-1 rounded border border-slate-200"><Download className="w-3 h-3 text-slate-700" /></span>
                        <span>រើសយក "Add to Home screen" ឬ "Install app"</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showInstructions && (
            <button
              onClick={handleInstall}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>បន្ថែម (Add)</span>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
