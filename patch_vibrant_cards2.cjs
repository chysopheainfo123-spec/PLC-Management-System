const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

// Replace Blue card
code = code.replace(/className="bg-gradient-to-br from-\[#eef4ff\] to-\[#e0eaff\] rounded-3xl p-6 shadow-sm border border-\[#d0e0ff\] transition-all hover:shadow-md hover:border-\[#b0caff\]"/g, 
  'className="bg-gradient-to-br from-blue-100 to-blue-200/80 rounded-3xl p-6 shadow-sm border border-blue-200 transition-all hover:shadow-md hover:border-blue-300"');

// Replace Orange card
code = code.replace(/className="bg-gradient-to-br from-\[#fff4eb\] to-\[#ffecd9\] rounded-3xl p-6 shadow-sm border border-\[#ffe0c2\] transition-all hover:shadow-md hover:border-\[#ffd0a6\]"/g, 
  'className="bg-gradient-to-br from-orange-100 to-orange-200/80 rounded-3xl p-6 shadow-sm border border-orange-200 transition-all hover:shadow-md hover:border-orange-300"');

// Replace Amber card
code = code.replace(/className="bg-gradient-to-br from-\[#fffbe6\] to-\[#fff6d6\] rounded-3xl p-6 shadow-sm border border-\[#ffeaab\] transition-all hover:shadow-md hover:border-\[#ffdd80\]"/g, 
  'className="bg-gradient-to-br from-amber-100 to-amber-200/80 rounded-3xl p-6 shadow-sm border border-amber-200 transition-all hover:shadow-md hover:border-amber-300"');

// Replace Emerald card
code = code.replace(/className="bg-gradient-to-br from-\[#ebfcf1\] to-\[#dcfce7\] rounded-3xl p-6 shadow-sm border border-\[#bbf7d0\] transition-all hover:shadow-md hover:border-\[#86efac\]"/g, 
  'className="bg-gradient-to-br from-emerald-100 to-emerald-200/80 rounded-3xl p-6 shadow-sm border border-emerald-200 transition-all hover:shadow-md hover:border-emerald-300"');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
