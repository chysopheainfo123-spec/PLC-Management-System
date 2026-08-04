const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-colors"/g, 
  'className="bg-gradient-to-br from-white/90 to-blue-50/80 rounded-2xl p-5 border border-blue-100/50 hover:from-white hover:to-blue-50 transition-colors backdrop-blur-sm"');

code = code.replace(/className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 border border-emerald-200 hover:from-emerald-100 hover:to-emerald-200 transition-colors"/g, 
  'className="bg-gradient-to-br from-white/90 to-emerald-50/80 rounded-2xl p-5 border border-emerald-100/50 hover:from-white hover:to-emerald-50 transition-colors backdrop-blur-sm"');

code = code.replace(/className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-5 border border-amber-200 hover:from-amber-100 hover:to-amber-200 transition-colors"/g, 
  'className="bg-gradient-to-br from-white/90 to-amber-50/80 rounded-2xl p-5 border border-amber-100/50 hover:from-white hover:to-amber-50 transition-colors backdrop-blur-sm"');

code = code.replace(/className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-colors"/g, 
  'className="bg-gradient-to-br from-white/90 to-purple-50/80 rounded-2xl p-5 border border-purple-100/50 hover:from-white hover:to-purple-50 transition-colors backdrop-blur-sm"');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
