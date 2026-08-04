const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/<button className="w-full py-2\.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-\[13px\] font-bold transition-colors shadow-sm flex items-center justify-center gap-1\.5">/g,
  '<button className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5">');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
