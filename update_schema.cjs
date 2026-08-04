const fs = require('fs');
const mysqlSchema = fs.readFileSync('prisma/schema.mysql.prisma', 'utf8');
const tabFile = 'src/components/tabs/MySQLDBTab.tsx';
let tabContent = fs.readFileSync(tabFile, 'utf8');

const regex = /const PRISMA_SCHEMA_CODE = `[\s\S]*?`;/;
const newContent = 'const PRISMA_SCHEMA_CODE = `' + mysqlSchema.replace(/`/g, '\\`') + '`;';
tabContent = tabContent.replace(regex, newContent);
fs.writeFileSync(tabFile, tabContent);
