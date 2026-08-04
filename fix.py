import sys
import re

with open('prisma/schema.mysql.prisma', 'r') as f:
    schema = f.read()

with open('src/components/tabs/MySQLDBTab.tsx', 'r') as f:
    content = f.read()

escaped_schema = schema.replace("`", "\\`")
new_code = "const PRISMA_SCHEMA_CODE = `" + escaped_schema + "`;"
content = re.sub(r'const PRISMA_SCHEMA_CODE = ;', new_code, content)

with open('src/components/tabs/MySQLDBTab.tsx', 'w') as f:
    f.write(content)
