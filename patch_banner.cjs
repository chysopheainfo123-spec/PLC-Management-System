const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/<div className="bg-white rounded-3xl p-8 border border-slate-200\/80 shadow-\[0_8px_30px_rgba\(0,0,0,0\.02\)\] relative overflow-hidden">/g, 
  '<div className="bg-gradient-to-br from-slate-50 via-white to-slate-50/80 rounded-3xl p-8 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
