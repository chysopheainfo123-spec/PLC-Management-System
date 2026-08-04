const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/bg-\[#fff7ed\] rounded-2xl p-5 border border-orange-100\/50 flex flex-col shadow-sm/g, "bg-[#fff7ed] rounded-3xl p-6 border border-orange-100/50 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]");
code = code.replace(/bg-\[#f0f9ff\] rounded-2xl p-5 border border-blue-100\/50 flex flex-col shadow-sm/g, "bg-[#f0f9ff] rounded-3xl p-6 border border-blue-100/50 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]");
code = code.replace(/bg-\[#fef2f2\] rounded-2xl p-5 border border-red-100\/50 flex flex-col shadow-sm/g, "bg-[#fef2f2] rounded-3xl p-6 border border-red-100/50 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]");

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
