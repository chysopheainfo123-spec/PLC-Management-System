const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/bg-white rounded-2xl p-5 shadow-\[0_2px_10px_-4px_rgba\(0,0,0,0\.05\)\] border border-slate-100/g, "bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]");
code = code.replace(/bg-white rounded-2xl p-6 shadow-\[0_2px_10px_-4px_rgba\(0,0,0,0\.05\)\] border border-slate-100/g, "bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]");
code = code.replace(/bg-\[#115b9b\]/g, "bg-blue-600");

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
