const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
code = code.replace('return (translations as any)[uiLang]?.[key] || translations.kh[key] || "";', 'return (translations as any)[uiLang]?.[key] || translations.kh[key] || key;');
fs.writeFileSync('src/components/Dashboard.tsx', code);
