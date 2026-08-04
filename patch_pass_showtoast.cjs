const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(/<DashboardTab setActiveTab=\{setActiveTab\} /g, '<DashboardTab showToast={showToast} setActiveTab={setActiveTab} ');

fs.writeFileSync('src/components/Dashboard.tsx', code);
