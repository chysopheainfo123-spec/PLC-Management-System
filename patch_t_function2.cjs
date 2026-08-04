const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
code = code.replace(
  /if \(uiLang === "en"\) return \(translations\.en as any\)\?\.\[key\] \|\| key;\n    return \(translations as any\)\[uiLang\]\?\.\[key\] \|\| \(translations\.kh as any\)\[key\] \|\| key;/g,
  'if (uiLang === "en") return (translations.en as any)?.[key] || key;\n    if (uiLang === "zh") return (translations.zh as any)?.[key] || key;\n    return (translations as any)[uiLang]?.[key] || (translations.kh as any)[key] || key;'
);
fs.writeFileSync('src/components/Dashboard.tsx', code);
