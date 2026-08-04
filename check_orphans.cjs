const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const attendances = await prisma.attendance.count();
  const invoices = await prisma.invoice.count();
  const enrollments = await prisma.enrollment.count();
  const courses = await prisma.course.count();
  console.log(`Attendances: ${attendances}, Invoices: ${invoices}, Enrollments: ${enrollments}, Courses: ${courses}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
