const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
code = code.replace(
  'return (translations as any)[uiLang]?.[key] || translations.kh[key] || key;',
  'if (uiLang === "en") return (translations.en as any)?.[key] || key;\n    return (translations as any)[uiLang]?.[key] || (translations.kh as any)[key] || key;'
);
fs.writeFileSync('src/components/Dashboard.tsx', code);
