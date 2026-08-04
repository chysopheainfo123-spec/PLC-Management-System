const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500/g,
  'w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20');

code = code.replace(/w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500/g,
  'w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20');

code = code.replace(/w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500/g,
  'w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20');

code = code.replace(/w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500/g,
  'w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
