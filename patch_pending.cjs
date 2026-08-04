const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/w-11 h-11 rounded-\[10px\] bg-orange-500 text-white flex items-center justify-center shadow-sm/g, 
  'w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20');
code = code.replace(/w-11 h-11 rounded-\[10px\] bg-\[#0284c7\] text-white flex items-center justify-center shadow-sm/g, 
  'w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20');
code = code.replace(/w-11 h-11 rounded-\[10px\] bg-red-500 text-white flex items-center justify-center shadow-sm/g, 
  'w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/20');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
