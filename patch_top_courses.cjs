const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/idx === 0 \? 'bg-amber-500' : idx === 1 \? 'bg-slate-300' : 'bg-\[#ea580c\]'/g,
  "idx === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-500 shadow-amber-500/30' : idx === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 shadow-slate-400/30' : 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/30'");

code = code.replace(/<span className="w-4 h-4 bg-slate-800 text-white rounded-full text-\[10px\] font-bold flex items-center justify-center leading-none pb-\[1px\]">\{idx \+ 1\}<\/span>/g,
  '<span className="w-5 h-5 bg-slate-800 text-white rounded-full text-[10px] font-bold flex items-center justify-center leading-none shadow-sm">{idx + 1}</span>');
code = code.replace(/<div className="absolute -top-2 -right-2 w-\[22px\] h-\[22px\] bg-white rounded-full flex items-center justify-center shadow-sm">/g,
  '<div className="absolute -top-2 -right-2 w-[26px] h-[26px] bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-50">');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
