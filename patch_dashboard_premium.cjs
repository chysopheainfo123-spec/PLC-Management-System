const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

// 1. Update Welcome Banner to a Dark Premium Gradient
code = code.replace(/<div className="bg-white rounded-3xl p-8 border border-slate-200\/80 shadow-\[0_8px_30px_rgba\(0,0,0,0\.02\)\] relative overflow-hidden">/g, 
  '<div className="bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">');

code = code.replace(/<div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5"><\/div>/g, 
  '<div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500 opacity-20 blur-3xl mix-blend-screen"></div>');

code = code.replace(/<div className="absolute bottom-0 right-40 -mb-20 w-48 h-48 rounded-full bg-white opacity-5"><\/div>/g, 
  '<div className="absolute bottom-0 right-40 -mb-20 w-48 h-48 rounded-full bg-indigo-500 opacity-20 blur-3xl mix-blend-screen"></div>');

// Text colors inside Welcome Banner
code = code.replace(/<h2 className="text-3xl font-black text-slate-850 tracking-tight">/g, 
  '<h2 className="text-3xl font-black text-white tracking-tight">');
code = code.replace(/<span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-\[11px\] font-bold">/g, 
  '<span className="bg-white/10 text-blue-100 border border-white/20 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm">');
code = code.replace(/<p className="text-slate-500 font-medium text-\[13px\] mt-1\.5">/g, 
  '<p className="text-slate-300 font-medium text-[13px] mt-1.5">');

// Export / Refresh buttons inside Welcome Banner
code = code.replace(/<button className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200\/80 text-slate-700 shadow-sm transition-all px-4 py-2 rounded-lg text-xs font-semibold backdrop-blur-sm">/g,
  '<button className="flex items-center gap-2 bg-white/5 hover:bg-white/15 border border-white/10 text-white shadow-sm transition-all px-4 py-2 rounded-lg text-xs font-semibold backdrop-blur-md">');
code = code.replace(/<button className="flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200\/80 text-slate-700 shadow-sm transition-all w-9 h-9 rounded-lg backdrop-blur-sm">/g,
  '<button className="flex items-center justify-center bg-white/5 hover:bg-white/15 border border-white/10 text-white shadow-sm transition-all w-9 h-9 rounded-lg backdrop-blur-md">');

// Sub-cards inside Welcome Banner
code = code.replace(/<div className="bg-slate-50\/50 rounded-2xl p-5 border border-slate-100\/80">/g,
  '<div className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">');
code = code.replace(/<div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-3">/g,
  '<div className="flex items-center gap-2 text-slate-300 text-xs font-medium mb-3">');
code = code.replace(/<div className="text-3xl font-black text-slate-800 leading-none">/g,
  '<div className="text-3xl font-black text-white leading-none">');

// Write out the changes
fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
