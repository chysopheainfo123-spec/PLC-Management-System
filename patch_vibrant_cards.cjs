const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

// Replace Blue card
code = code.replace(/className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 shadow-\[0_8px_30px_rgba\(0,0,0,0\.03\)\] border border-blue-100\/50 transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.08\)\] hover:border-blue-200"/g, 
  'className="bg-gradient-to-br from-[#eef4ff] to-[#e0eaff] rounded-3xl p-6 shadow-sm border border-[#d0e0ff] transition-all hover:shadow-md hover:border-[#b0caff]"');

// Replace Orange card
code = code.replace(/className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 shadow-\[0_8px_30px_rgba\(0,0,0,0\.03\)\] border border-orange-100\/50 transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.08\)\] hover:border-orange-200"/g, 
  'className="bg-gradient-to-br from-[#fff4eb] to-[#ffecd9] rounded-3xl p-6 shadow-sm border border-[#ffe0c2] transition-all hover:shadow-md hover:border-[#ffd0a6]"');

// Replace Amber card
code = code.replace(/className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-6 shadow-\[0_8px_30px_rgba\(0,0,0,0\.03\)\] border border-amber-100\/50 transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.08\)\] hover:border-amber-200"/g, 
  'className="bg-gradient-to-br from-[#fffbe6] to-[#fff6d6] rounded-3xl p-6 shadow-sm border border-[#ffeaab] transition-all hover:shadow-md hover:border-[#ffdd80]"');

// Replace Emerald card
code = code.replace(/className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 shadow-\[0_8px_30px_rgba\(0,0,0,0\.03\)\] border border-emerald-100\/50 transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.08\)\] hover:border-emerald-200"/g, 
  'className="bg-gradient-to-br from-[#ebfcf1] to-[#dcfce7] rounded-3xl p-6 shadow-sm border border-[#bbf7d0] transition-all hover:shadow-md hover:border-[#86efac]"');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
