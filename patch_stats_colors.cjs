const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/className="bg-gradient-to-br from-white to-blue-50\/80 rounded-3xl p-6 shadow-\[0_8px_30px_rgba\(0,0,0,0\.03\)\] border border-slate-100 transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.06\)\] hover:border-blue-100"/g, 
  'className="bg-gradient-to-br from-blue-50/70 to-blue-100/70 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-blue-100/50 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-blue-200"');

code = code.replace(/className="bg-gradient-to-br from-white to-orange-50\/80 rounded-3xl p-6 shadow-\[0_8px_30px_rgba\(0,0,0,0\.03\)\] border border-slate-100 transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.06\)\] hover:border-orange-100"/g, 
  'className="bg-gradient-to-br from-orange-50/70 to-orange-100/70 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-orange-100/50 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-orange-200"');

code = code.replace(/className="bg-gradient-to-br from-white to-amber-50\/80 rounded-3xl p-6 shadow-\[0_8px_30px_rgba\(0,0,0,0\.03\)\] border border-slate-100 transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.06\)\] hover:border-amber-100"/g, 
  'className="bg-gradient-to-br from-amber-50/70 to-amber-100/70 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-amber-100/50 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-amber-200"');

code = code.replace(/className="bg-gradient-to-br from-white to-emerald-50\/80 rounded-3xl p-6 shadow-\[0_8px_30px_rgba\(0,0,0,0\.03\)\] border border-slate-100 transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.06\)\] hover:border-emerald-100"/g, 
  'className="bg-gradient-to-br from-emerald-50/70 to-emerald-100/70 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-emerald-100/50 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-emerald-200"');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
