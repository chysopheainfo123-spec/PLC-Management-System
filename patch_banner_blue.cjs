const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

// Replace banner background
code = code.replace(/className="bg-gradient-to-r from-blue-50\/30 via-white to-purple-50\/30 rounded-3xl p-8 border border-slate-200\/80 shadow-\[0_8px_30px_rgba\(0,0,0,0\.02\)\] relative overflow-hidden"/g, 
  'className="bg-gradient-to-r from-[#0275d8] to-[#0dcaf0] rounded-3xl p-8 shadow-lg shadow-blue-500/20 relative overflow-hidden"');

// Replace decorative circles
code = code.replace(/<div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-50 opacity-50 blur-3xl mix-blend-multiply"><\/div>/g, 
  '<div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-2xl"></div>');
code = code.replace(/<div className="absolute bottom-0 right-40 -mb-20 w-48 h-48 rounded-full bg-indigo-50 opacity-50 blur-3xl mix-blend-multiply"><\/div>/g, 
  '<div className="absolute bottom-0 right-40 -mb-20 w-48 h-48 rounded-full bg-cyan-200 opacity-20 blur-2xl"></div>');

// Replace text colors
code = code.replace(/<h2 className="text-3xl font-black text-slate-850 tracking-tight">\{t\('Welcome back'\)\}, \{user\?\.displayName \|\| 'Admin'\}<\/h2>/g, 
  '<h2 className="text-3xl font-black text-white tracking-tight">{t(\'Welcome back\')}, {user?.displayName || \'Admin\'} 👋</h2>');

code = code.replace(/<span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-\[11px\] font-bold">\{formattedDate\}<\/span>/g, 
  '<span className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md">{formattedDate}</span>');

code = code.replace(/<p className="text-slate-500 font-medium text-\[13px\] mt-1\.5">\{t\("Here's your platform performance overview"\)\}<\/p>/g, 
  '<p className="text-blue-50 font-medium text-[13px] mt-1.5">{t("Here\'s your platform performance overview")}</p>');

// Replace buttons
code = code.replace(/<button onClick=\{.*\} className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200\/80 text-slate-700 shadow-sm transition-all px-4 py-2 rounded-lg text-xs font-semibold backdrop-blur-sm">/g, 
  (match) => match.replace('bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700', 'bg-white/10 hover:bg-white/20 border border-white/30 text-white'));

code = code.replace(/<button onClick=\{.*\} className="flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200\/80 text-slate-700 shadow-sm transition-all w-9 h-9 rounded-lg backdrop-blur-sm">/g, 
  (match) => match.replace('bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700', 'bg-white/10 hover:bg-white/20 border border-white/30 text-white'));

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
