const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/text-\[11px\] text-slate-500 font-medium">{t\('Enroll new student'\)}/g, 'text-[11px] text-blue-100 font-medium">{t(\'Enroll new student\')}');
code = code.replace(/bg-gradient-to-br from-\[#0d9488\] to-\[#14b8a6\]/g, "bg-gradient-to-br from-teal-600 to-teal-500");
code = code.replace(/bg-gradient-to-br from-\[#f59e0b\] to-\[#fcd34d\]/g, "bg-gradient-to-br from-amber-500 to-amber-400");
code = code.replace(/bg-gradient-to-br from-\[#8b5cf6\] to-\[#a78bfa\]/g, "bg-gradient-to-br from-purple-600 to-purple-500");

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
