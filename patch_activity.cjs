const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/<div className="absolute left-\[19px\] top-4 bottom-4 w-px bg-slate-100 z-0"><\/div>/g, 
  '<div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-slate-200 via-slate-100 to-transparent z-0"></div>');

code = code.replace(/<div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white/g,
  '<div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm ring-4 ring-white/50');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
