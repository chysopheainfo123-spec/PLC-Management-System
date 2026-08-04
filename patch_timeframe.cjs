const fs = require('fs');
let code = fs.readFileSync('src/components/tabs/DashboardTab.tsx', 'utf-8');

// Add useState if not there
if (!code.includes('import React, { useState }')) {
  code = code.replace(/import React from 'react';/, "import React, { useState } from 'react';");
} else {
  code = code.replace(/import React from 'react';/, "import React, { useState } from 'react';");
}

code = code.replace(/if \(activeTab !== "Dashboard"\) return null;/g, 
  'const [chartTimeframe, setChartTimeframe] = useState("month");\n\n  if (activeTab !== "Dashboard") return null;');

code = code.replace(/<button className="px-5 py-1\.5 text-xs font-bold bg-blue-600 text-white rounded-md shadow-sm">\{t\('This Month'\)\}<\/button>\s*<button className="px-5 py-1\.5 text-xs font-semibold text-slate-500 hover:text-slate-700">\{t\('This Year'\)\}<\/button>/g,
  `<button onClick={() => setChartTimeframe('month')} className={\`px-5 py-1.5 text-xs font-bold rounded-md transition-all \${chartTimeframe === 'month' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}>{t('This Month')}</button>
              <button onClick={() => setChartTimeframe('year')} className={\`px-5 py-1.5 text-xs font-bold rounded-md transition-all \${chartTimeframe === 'year' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}>{t('This Year')}</button>`);

fs.writeFileSync('src/components/tabs/DashboardTab.tsx', code);
