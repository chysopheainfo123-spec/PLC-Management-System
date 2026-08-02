import React from 'react';
import { Printer } from 'lucide-react';

interface PrintWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  uiLang: string;
}

export function PrintWarningModal({ isOpen, onClose, uiLang }: PrintWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Printer className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {uiLang === "kh" ? "ទាមទារការបើកផ្ទាំងថ្មី" : "New Tab Required"}
        </h3>
        <p className="text-slate-500 mb-6 leading-relaxed">
          {uiLang === "kh" 
            ? "សូមបើកកម្មវិធីនេះក្នុងផ្ទាំងថ្មី (New Tab) ឬចុចលើសញ្ញាព្រួញ (↗️) នៅខាងលើស្ដាំនៃអេក្រង់ ដើម្បីអាចបោះពុម្ពបានដោយជោគជ័យ។" 
            : "Please open this app in a new tab (click the ↗️ arrow icon top right) to print successfully."}
        </p>
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
        >
          {uiLang === "kh" ? "យល់ព្រម" : "Understood"}
        </button>
      </div>
    </div>
  );
}
