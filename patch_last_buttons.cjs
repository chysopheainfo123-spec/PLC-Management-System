const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/<button className="w-full py-2\.5 bg-slate-200 text-slate-500 rounded-xl text-\[13px\] font-bold transition-colors shadow-sm flex items-center justify-center gap-1\.5 cursor-not-allowed" disabled>/g,
  '<button onClick={() => setActiveTab && setActiveTab("Settings")} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[13px] font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5">');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
