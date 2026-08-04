const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace(/"Up to date": "ទាន់សម័យ",/g, '"Up to date": "ទាន់សម័យ",\n    "System is up to date. No new updates available.": "ប្រព័ន្ធទាន់សម័យ។ គ្មានការធ្វើបច្ចុប្បន្នភាពថ្មីទេ។",');
code = code.replace(/"All Clear": "គ្មានបញ្ហា",/g, '"All Clear": "គ្មានបញ្ហា",\n    "All systems clear. No urgent issues today.": "ប្រព័ន្ធដំណើរការល្អ។ គ្មានបញ្ហាបន្ទាន់ថ្ងៃនេះទេ។",');

fs.writeFileSync('src/components/Dashboard.tsx', code);
