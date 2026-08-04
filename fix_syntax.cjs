const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');
code = code.replace("style={{ width: \\`\\${widthPercentage}%\\` }}", "style={{ width: `${widthPercentage}%` }}");
code = code.replace("{\\{widthPercentage}}%", "{widthPercentage}%");
fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
