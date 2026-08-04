const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

let matches = 0;
code = code.replace(/<div className="bg-white rounded-3xl p-6 shadow-\[0_8px_30px_rgba\(0,0,0,0\.03\)\] border border-slate-100 transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.06\)\]">/g, (match) => {
  matches++;
  if (matches === 1) { // Blue
    return '<div className="bg-gradient-to-br from-white to-blue-50/80 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-blue-100">';
  } else if (matches === 2) { // Orange
    return '<div className="bg-gradient-to-br from-white to-orange-50/80 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-orange-100">';
  } else if (matches === 3) { // Amber
    return '<div className="bg-gradient-to-br from-white to-amber-50/80 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-amber-100">';
  } else if (matches === 4) { // Emerald
    return '<div className="bg-gradient-to-br from-white to-emerald-50/80 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-emerald-100">';
  }
  return match;
});

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
console.log("Replaced:", matches);
