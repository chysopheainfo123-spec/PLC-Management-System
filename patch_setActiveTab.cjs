const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

// Add setActiveTab to props destructuring
code = code.replace(/const \{ \n    activeTab, \n    students = \[\]/g, 
  'const { \n    activeTab, \n    setActiveTab,\n    students = []');

// Replace Add Student button
code = code.replace(/<div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-\[14px\] p-5 text-white hover:opacity-95 cursor-pointer transition-opacity shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center text-center h-\[120px\] relative overflow-hidden group">/g,
  '<div onClick={() => setActiveTab && setActiveTab("Students")} className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[14px] p-5 text-white hover:opacity-95 cursor-pointer transition-opacity shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center text-center h-[120px] relative overflow-hidden group">');

// Replace Add Teacher button
code = code.replace(/<div className="bg-gradient-to-br from-teal-600 to-teal-500 rounded-\[14px\] p-5 text-white hover:opacity-95 cursor-pointer transition-opacity shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center text-center h-\[120px\] relative overflow-hidden group">/g,
  '<div onClick={() => setActiveTab && setActiveTab("Teachers")} className="bg-gradient-to-br from-teal-600 to-teal-500 rounded-[14px] p-5 text-white hover:opacity-95 cursor-pointer transition-opacity shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center text-center h-[120px] relative overflow-hidden group">');

// Replace View Reports button
code = code.replace(/<div className="bg-gradient-to-br from-amber-500 to-amber-400 rounded-\[14px\] p-5 text-white hover:opacity-95 cursor-pointer transition-opacity shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center text-center h-\[120px\] relative overflow-hidden group">/g,
  '<div onClick={() => setActiveTab && setActiveTab("Analytics")} className="bg-gradient-to-br from-amber-500 to-amber-400 rounded-[14px] p-5 text-white hover:opacity-95 cursor-pointer transition-opacity shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center text-center h-[120px] relative overflow-hidden group">');

// Replace Settings button
code = code.replace(/<div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-\[14px\] p-5 text-white hover:opacity-95 cursor-pointer transition-opacity shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center text-center h-\[120px\] relative overflow-hidden group">/g,
  '<div onClick={() => setActiveTab && setActiveTab("Settings")} className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-[14px] p-5 text-white hover:opacity-95 cursor-pointer transition-opacity shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center text-center h-[120px] relative overflow-hidden group">');

// Review Now button
code = code.replace(/<button className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-\[13px\] font-bold transition-all shadow-md shadow-orange-500\/20 hover:shadow-orange-500\/40 flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5">/g,
  '<button onClick={() => setActiveTab && setActiveTab("Finance")} className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5">');

// View All Activities button
code = code.replace(/<button className="text-\[13px\] font-bold text-blue-600 hover:text-blue-800">\{t\('View All Activities'\)\}<\/button>/g,
  '<button onClick={() => setActiveTab && setActiveTab("Students")} className="text-[13px] font-bold text-blue-600 hover:text-blue-800">{t(\'View All Activities\')}</button>');

// View All Top Courses button
code = code.replace(/<button className="text-\[13px\] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">\s*\{t\('View All'\)\} <ChevronRight className="w-3\.5 h-3\.5" \/>\s*<\/button>/g,
  '<button onClick={() => setActiveTab && setActiveTab("Courses")} className="text-[13px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">\n              {t(\'View All\')} <ChevronRight className="w-3.5 h-3.5" />\n            </button>');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
