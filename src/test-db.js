// Purpose: simple script to test Prisma connection and read from User table
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Testing DB connection...");

  const users = await prisma.user.findMany();

  console.log("Users in DB:", users);
}

main()
  .catch((e) => {
    console.error("Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
