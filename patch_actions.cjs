const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

code = code.replace(/shadow-sm flex flex-col items-center justify-center text-center h-\[120px\]/g, 
  'shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex flex-col items-center justify-center text-center h-[120px] relative overflow-hidden group');

code = code.replace(/<PlusCircle className="w-6 h-6 mb-2\.5 opacity-90" \/>/g,
  '<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div><PlusCircle className="w-6 h-6 mb-2.5 opacity-90 relative z-10" />');
code = code.replace(/<UserCheck className="w-6 h-6 mb-2\.5 opacity-90" \/>/g,
  '<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div><UserCheck className="w-6 h-6 mb-2.5 opacity-90 relative z-10" />');
code = code.replace(/<BarChart2 className="w-6 h-6 mb-2\.5 opacity-90" \/>/g,
  '<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div><BarChart2 className="w-6 h-6 mb-2.5 opacity-90 relative z-10" />');
code = code.replace(/<Settings className="w-6 h-6 mb-2\.5 opacity-90" \/>/g,
  '<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div><Settings className="w-6 h-6 mb-2.5 opacity-90 relative z-10" />');

code = code.replace(/<h4 className="text-\[13px\] font-bold mb-1">/g, '<h4 className="text-[13px] font-bold mb-1 relative z-10">');
code = code.replace(/<p className="text-\[11px\] text-(.*?)-100 font-medium">/g, '<p className="text-[11px] text-$1-100 font-medium relative z-10">');
code = code.replace(/<p className="text-\[11px\] text-blue-100 font-medium">/g, '<p className="text-[11px] text-blue-100 font-medium relative z-10">');

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
