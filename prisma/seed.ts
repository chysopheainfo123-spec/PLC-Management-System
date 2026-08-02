import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Delete existing users to prevent duplicate key errors on multiple runs
  await prisma.user.deleteMany();

  // Create default admin user
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin",
      fullName: "PLC Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log("Created Admin:", admin.email);

  // Create default teacher user
  const teacherPasswordHash = await bcrypt.hash("teacher123", 10);
  const teacher = await prisma.user.create({
    data: {
      email: "teacher@plc.com",
      fullName: "Sok Sophea",
      passwordHash: teacherPasswordHash,
      role: "TEACHER",
    },
  });
  console.log("Created Teacher:", teacher.email);

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
