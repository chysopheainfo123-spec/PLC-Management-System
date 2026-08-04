const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

// System Updates Card
code = code.replace(/<div className="bg-\[#f0f9ff\] rounded-3xl p-6 border border-blue-100\/50 flex flex-col shadow-\[0_8px_30px_rgba\(0,0,0,0\.03\)\] transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.06\)\]">/g, 
  '<div className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] rounded-3xl p-6 border border-blue-100/50 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">');

// Reported Issues Card
code = code.replace(/<div className="bg-\[#fef2f2\] rounded-3xl p-6 border border-red-100\/50 flex flex-col shadow-\[0_8px_30px_rgba\(0,0,0,0\.03\)\] transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.06\)\]">/g, 
  '<div className="bg-gradient-to-br from-[#fef2f2] to-[#fee2e2] rounded-3xl p-6 border border-red-100/50 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
