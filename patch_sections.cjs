const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

// Update section headers
code = code.replace(/text-\[17px\] font-bold text-slate-800 mb-1/g, "text-lg font-black text-slate-850 tracking-tight mb-1");
code = code.replace(/text-xs text-slate-500 font-medium/g, "text-xs text-slate-500 font-medium font-sans");

// Live Activity container
code = code.replace(/bg-white rounded-2xl p-6 shadow-\[0_2px_10px_-4px_rgba\(0,0,0,0\.05\)\] border border-slate-100 flex flex-col h-full/g, "bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col h-full transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]");

// Quick Actions & Top Sellers
code = code.replace(/bg-white rounded-2xl p-6 shadow-\[0_2px_10px_-4px_rgba\(0,0,0,0\.05\)\] border border-slate-100/g, "bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]");

// Quick Actions Buttons
code = code.replace(/bg-gradient-to-br from-\[#115b9b\] to-\[#1a6ebd\]/g, "bg-gradient-to-br from-blue-600 to-blue-700");

// Update pending actions
code = code.replace(/w-2 h-2 rounded-full bg-red-500/g, "w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse");

// Update any remaining rounded-2xl to rounded-3xl if needed for card consistency
// but mostly done in the previous steps.

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
