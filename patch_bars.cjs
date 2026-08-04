const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/<div className="bg-blue-600 h-full rounded-lg flex items-center justify-end pr-4 text-white text-xs font-bold"/g, 
  '<div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-lg flex items-center justify-end pr-4 text-white text-xs font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"');

code = code.replace(/<div className="w-full bg-slate-100 h-9 rounded-lg overflow-hidden relative">/g,
  '<div className="w-full bg-slate-100 h-9 rounded-[10px] overflow-hidden relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] border border-slate-200/50">');

// Bottom summary cards
code = code.replace(/<div className="bg-slate-50\/50 rounded-xl p-4 text-center border border-slate-100">/g,
  '<div className="bg-white rounded-2xl p-4 text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow">');
code = code.replace(/text-lg font-black text-slate-850 tracking-tight mb-1/g,
  'text-xl font-black text-slate-800 tracking-tight mb-1');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
