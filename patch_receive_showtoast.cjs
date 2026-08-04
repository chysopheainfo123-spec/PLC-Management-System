const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

// Add showToast to destructuring
code = code.replace(/setActiveTab,\n    students = \[\]/g, 'setActiveTab,\n    showToast,\n    students = []');

// Replace settings onClick with showToast
code = code.replace(/<button onClick=\{\(\) => setActiveTab && setActiveTab\("Settings"\)\} className="w-full py-2\.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-\[13px\] font-bold transition-all shadow-sm flex items-center justify-center gap-1\.5 transform hover:-translate-y-0\.5">\s*\{t\('Up to date'\)\} <CheckCircle2 className="w-4 h-4" \/>\s*<\/button>/g,
  '<button onClick={() => showToast && showToast(t("System is up to date. No new updates available."), "success")} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[13px] font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5">\n              {t("Up to date")} <CheckCircle2 className="w-4 h-4" />\n            </button>');

code = code.replace(/<button onClick=\{\(\) => setActiveTab && setActiveTab\("Settings"\)\} className="w-full py-2\.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-\[13px\] font-bold transition-all shadow-sm flex items-center justify-center gap-1\.5 transform hover:-translate-y-0\.5">\s*\{t\('All Clear'\)\} <CheckCircle2 className="w-4 h-4" \/>\s*<\/button>/g,
  '<button onClick={() => showToast && showToast(t("All systems clear. No urgent issues today."), "success")} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[13px] font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5">\n              {t("All Clear")} <CheckCircle2 className="w-4 h-4" />\n            </button>');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
