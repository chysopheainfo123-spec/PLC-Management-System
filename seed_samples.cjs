const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);
  
  // Create 3 teachers
  for (let i = 1; i <= 3; i++) {
    const user = await prisma.user.create({
      data: {
        email: `teacher${i}@plc.com`,
        fullName: `Teacher ${i}`,
        passwordHash,
        role: "TEACHER"
      }
    });
    
    await prisma.teacher.create({
      data: {
        teacherId: `T00${i}`,
        firstNameEn: "Teacher",
        lastNameEn: `${i}`,
        nameEn: `Teacher ${i}`,
        nameKh: `គ្រូ ${i}`,
        gender: "Male",
        userId: user.id
      }
    });
  }

  // Create 5 students
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: `student${i}@plc.com`,
        fullName: `Student ${i}`,
        passwordHash,
        role: "STUDENT"
      }
    });
    
    await prisma.student.create({
      data: {
        studentId: `S00${i}`,
        firstNameEn: "Student",
        lastNameEn: `${i}`,
        nameEn: `Student ${i}`,
        nameKh: `សិស្ស ${i}`,
        gender: "Female",
        userId: user.id
      }
    });
  }
  
  console.log("Sample teachers and students have been recreated.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
