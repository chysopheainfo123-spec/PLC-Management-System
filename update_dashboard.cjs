const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

// Replace "bg-[#f4f7fb]" with a cleaner bg color
code = code.replace(/bg-\[#f4f7fb\]/, "bg-slate-50/50");

// Update Welcome Banner
code = code.replace(/bg-\[#115b9b\] rounded-2xl p-6 text-white relative overflow-hidden shadow-sm/, "bg-white rounded-3xl p-8 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden");
code = code.replace(/text-\[28px\] font-bold/, "text-3xl font-black text-slate-850 tracking-tight");
code = code.replace(/text-blue-100 text-\[13px\]/, "text-slate-500 font-medium text-[13px] mt-1.5");
code = code.replace(/bg-white\/10 border border-white\/20 px-3 py-1 rounded-full text-\[11px\] font-semibold backdrop-blur-sm/g, "bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-[11px] font-bold");
code = code.replace(/bg-white\/10 hover:bg-white\/20 border border-white\/20 transition-colors/g, "bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 shadow-sm transition-all");

code = code.replace(/bg-white\/10 rounded-xl p-4 backdrop-blur-md border border-white\/10/g, "bg-slate-50/50 rounded-2xl p-5 border border-slate-100/80");
code = code.replace(/text-blue-100/g, "text-slate-500");
code = code.replace(/text-blue-200/g, "text-slate-400");
code = code.replace(/<div className="text-3xl font-bold leading-none/g, "<div className=\"text-3xl font-black text-slate-800 leading-none");

// Save
fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
