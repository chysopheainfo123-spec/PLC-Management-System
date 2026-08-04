const fs = require('fs');

const extraKhmer = {
  "Welcome back": "សូមស្វាគមន៍",
  "Export": "នាំចេញ",
  "Total Students": "សិស្សសរុប",
  "Total Teachers": "គ្រូបង្រៀនសរុប",
  "Expected Revenue": "ចំណូលរំពឹងទុក",
  "Collection Rate": "អត្រាប្រមូលប្រាក់",
  "Active": "សកម្ម",
  "Active Students": "សិស្សសកម្ម",
  "Currently studying": "កំពុងសិក្សាបច្ចុប្បន្ន",
  "Progress": "វឌ្ឍនភាព",
  "Total Enrolled": "បានចុះឈ្មោះសរុប",
  "Pending": "រង់ចាំ",
  "Students with Due": "សិស្សជំពាក់",
  "Needs collection": "ត្រូវការប្រមូល",
  "Unpaid": "មិនទាន់បង់",
  "Total Due Amount": "ប្រាក់ជំពាក់សរុប",
  "Pending collection": "រង់ចាំប្រមូល",
  "Expected": "រំពឹងទុក",
  "Collected": "បានប្រមូល",
  "Total Collected": "បានប្រមូលសរុប",
  "Secured revenue": "ចំណូលដែលទទួលបាន",
  "Revenue Analytics": "វិភាគចំណូល",
  "Comprehensive revenue performance metrics": "រង្វាស់សមិទ្ធផលចំណូលលម្អិត",
  "This Month": "ខែនេះ",
  "This Year": "ឆ្នាំនេះ",
  "Enrolled": "បានចុះឈ្មោះ",
  "Avg/Student": "មធ្យម/សិស្ស",
  "Live Activity": "សកម្មភាពផ្ទាល់",
  "Real-time updates": "ការធ្វើបច្ចុប្បន្នភាពជាក់ស្តែង",
  "was enrolled in": "ត្រូវបានចុះឈ្មោះក្នុង",
  "Recently": "ថ្មីៗនេះ",
  "No recent activity": "គ្មានសកម្មភាពថ្មីៗ",
  "View All Activities": "មើលសកម្មភាពទាំងអស់",
  "Quick Actions": "សកម្មភាពរហ័ស",
  "Frequently used admin tasks": "ការងារដែលប្រើញឹកញាប់",
  "Add Student": "បន្ថែមសិស្ស",
  "Enroll new student": "ចុះឈ្មោះសិស្សថ្មី",
  "Add Teacher": "បន្ថែមគ្រូ",
  "Create new teacher": "បង្កើតគ្រូថ្មី",
  "View Reports": "មើលរបាយការណ៍",
  "Analytics data": "ទិន្នន័យវិភាគ",
  "Settings": "ការកំណត់",
  "Configure system": "កំណត់ប្រព័ន្ធ",
  "Top Courses": "វគ្គសិក្សាកំពូល",
  "Based on enrollment & revenue": "ផ្អែកលើការចុះឈ្មោះ និង ចំណូល",
  "View All": "មើលទាំងអស់",
  "students": "សិស្ស",
  "Revenue": "ចំណូល",
  "No courses available": "មិនមានវគ្គសិក្សា",
  "Pending Actions": "សកម្មភាពរង់ចាំ",
  "Items requiring your immediate attention": "បញ្ហាដែលទាមទារការយកចិត្តទុកដាក់",
  "Unpaid Fees": "ថ្លៃសិក្សាមិនទាន់បង់",
  "Students with pending due balances": "សិស្សដែលមានសមតុល្យជំពាក់",
  "Review Now": "ពិនិត្យឥឡូវនេះ",
  "System Updates": "ការធ្វើបច្ចុប្បន្នភាពប្រព័ន្ធ",
  "No new system updates available": "គ្មានការធ្វើបច្ចុប្បន្នភាពថ្មី",
  "Up to date": "ទាន់សម័យ",
  "Reported Issues": "បញ្ហាដែលបានរាយការណ៍",
  "No urgent issues reported today": "គ្មានបញ្ហាបន្ទាន់ថ្ងៃនេះ",
  "All Clear": "គ្មានបញ្ហា",
  "January": "មករា",
  "February": "កុម្ភៈ",
  "March": "មីនា",
  "Admin": "អ្នកគ្រប់គ្រង"
};

let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

let khMatch = code.match(/kh:\s*\{([^}]*)\}/);
if (khMatch) {
  let khObjStr = khMatch[1];
  let additions = '';
  for (const [k, v] of Object.entries(extraKhmer)) {
    if (!khObjStr.includes(`"${k}"`) && !khObjStr.includes(`'${k}'`)) {
      additions += `\n    "${k}": "${v}",`;
    }
  }
  
  code = code.replace(/kh:\s*\{([^}]*)\}/, `kh: {$1${additions}\n  }`);
}

fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log("Translations updated");
