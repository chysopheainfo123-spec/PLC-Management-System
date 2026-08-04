const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

// Action 1
code = code.replace(/<div className="bg-gradient-to-br from-\[#fff7ed\] to-\[#ffedd5\] rounded-3xl p-6 border border-orange-100\/50 flex flex-col shadow-\[0_8px_30px_rgba\(0,0,0,0\.03\)\] transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.06\)\]">/g, 
  '<div className="bg-gradient-to-br from-orange-50 to-orange-100/80 rounded-3xl p-6 border border-orange-200 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">');

// Action 2
code = code.replace(/<div className="bg-gradient-to-br from-\[#f0f9ff\] to-\[#e0f2fe\] rounded-3xl p-6 border border-blue-100\/50 flex flex-col shadow-\[0_8px_30px_rgba\(0,0,0,0\.03\)\] transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.06\)\]">/g, 
  '<div className="bg-gradient-to-br from-blue-50 to-blue-100/80 rounded-3xl p-6 border border-blue-200 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">');

// Action 3
code = code.replace(/<div className="bg-gradient-to-br from-\[#fef2f2\] to-\[#fee2e2\] rounded-3xl p-6 border border-red-100\/50 flex flex-col shadow-\[0_8px_30px_rgba\(0,0,0,0\.03\)\] transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.06\)\]">/g, 
  '<div className="bg-gradient-to-br from-red-50 to-red-100/80 rounded-3xl p-6 border border-red-200 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
