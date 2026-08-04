const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

// Subcard 1: Blue
code = code.replace(/className="bg-gradient-to-br from-blue-50\/80 to-sky-50\/30 rounded-2xl p-5 border border-blue-100\/50 hover:from-blue-100\/80 hover:to-sky-100\/30 transition-colors"/g, 
  'className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-colors"');

// Subcard 2: Emerald
code = code.replace(/className="bg-gradient-to-br from-emerald-50\/80 to-teal-50\/30 rounded-2xl p-5 border border-emerald-100\/50 hover:from-emerald-100\/80 hover:to-teal-100\/30 transition-colors"/g, 
  'className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 border border-emerald-200 hover:from-emerald-100 hover:to-emerald-200 transition-colors"');

// Subcard 3: Amber
code = code.replace(/className="bg-gradient-to-br from-amber-50\/80 to-orange-50\/30 rounded-2xl p-5 border border-amber-100\/50 hover:from-amber-100\/80 hover:to-orange-100\/30 transition-colors"/g, 
  'className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-5 border border-amber-200 hover:from-amber-100 hover:to-amber-200 transition-colors"');

// Subcard 4: Purple
code = code.replace(/className="bg-gradient-to-br from-purple-50\/80 to-fuchsia-50\/30 rounded-2xl p-5 border border-purple-100\/50 hover:from-purple-100\/80 hover:to-fuchsia-100\/30 transition-colors"/g, 
  'className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-colors"');

// Action 1: Orange
code = code.replace(/className="bg-gradient-to-br from-orange-50 to-orange-100\/80 rounded-3xl p-6 border border-orange-200 flex flex-col shadow-\[0_8px_30px_rgba\(0,0,0,0\.04\)\] transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.08\)\]"/g, 
  'className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:from-orange-100 hover:to-orange-200"');

// Action 2: Blue
code = code.replace(/className="bg-gradient-to-br from-blue-50 to-blue-100\/80 rounded-3xl p-6 border border-blue-200 flex flex-col shadow-\[0_8px_30px_rgba\(0,0,0,0\.04\)\] transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.08\)\]"/g, 
  'className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:from-blue-100 hover:to-blue-200"');

// Action 3: Red
code = code.replace(/className="bg-gradient-to-br from-red-50 to-red-100\/80 rounded-3xl p-6 border border-red-200 flex flex-col shadow-\[0_8px_30px_rgba\(0,0,0,0\.04\)\] transition-all hover:shadow-\[0_8px_30px_rgba\(0,0,0,0\.08\)\]"/g, 
  'className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-6 border border-red-200 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:from-red-100 hover:to-red-200"');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
