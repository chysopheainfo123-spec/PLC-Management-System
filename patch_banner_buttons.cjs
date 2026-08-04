const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/<button className="flex items-center gap-2 bg-white\/5 hover:bg-white\/15 border border-white\/10 text-white shadow-sm transition-all px-4 py-2 rounded-lg text-xs font-semibold backdrop-blur-md">/g,
  '<button onClick={() => window.print()} className="flex items-center gap-2 bg-white/5 hover:bg-white/15 border border-white/10 text-white shadow-sm transition-all px-4 py-2 rounded-lg text-xs font-semibold backdrop-blur-md">');

code = code.replace(/<button className="flex items-center justify-center bg-white\/5 hover:bg-white\/15 border border-white\/10 text-white shadow-sm transition-all w-9 h-9 rounded-lg backdrop-blur-md">/g,
  '<button onClick={() => window.location.reload()} className="flex items-center justify-center bg-white/5 hover:bg-white/15 border border-white/10 text-white shadow-sm transition-all w-9 h-9 rounded-lg backdrop-blur-md">');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
