const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');
let matches = [...code.matchAll(/t\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
matches = [...new Set(matches)];
console.log(matches.join('\n'));
