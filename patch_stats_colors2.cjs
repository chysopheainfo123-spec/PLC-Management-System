const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/from-blue-50\/70 to-blue-100\/70/g, 'from-blue-50 to-blue-100');
code = code.replace(/from-orange-50\/70 to-orange-100\/70/g, 'from-orange-50 to-orange-100');
code = code.replace(/from-amber-50\/70 to-amber-100\/70/g, 'from-amber-50 to-amber-100');
code = code.replace(/from-emerald-50\/70 to-emerald-100\/70/g, 'from-emerald-50 to-emerald-100');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
