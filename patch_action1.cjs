const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

// Unpaid Fees Card
code = code.replace(/<div className="bg-\[#fff7ed\] rounded-3xl p-6 border border-orange-100\/50 flex flex-col shadow-\[0_8px_30px_rgba\(0,0,0,0\.03\)\] transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.06\)\]">/g, 
  '<div className="bg-gradient-to-br from-[#fff7ed] to-[#ffedd5] rounded-3xl p-6 border border-orange-100/50 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
