const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/<div className="bg-blue-600 h-full rounded-full"/g,
  '<div className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"');
code = code.replace(/<div className="bg-orange-500 h-full rounded-full"/g,
  '<div className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"');
code = code.replace(/<div className="bg-amber-500 h-full rounded-full"/g,
  '<div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"');
code = code.replace(/<div className="bg-emerald-500 h-full rounded-full"/g,
  '<div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
