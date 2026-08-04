const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  console.log("Deleted all student and teacher profiles, but kept user accounts.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
