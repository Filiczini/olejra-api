import { PrismaClient, Status } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "test@olejra.app";
  const plain = "changeme123";

  const passwordHash = await bcrypt.hash(plain, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  const demo = [
    { title: "Design API", status: Status.BACKLOG, order: 0 },
    { title: "Setup DB", status: Status.TODO, order: 0 },
    { title: "Create board UI", status: Status.IN_PROGRESS, order: 0 },
    { title: "Deploy to Render", status: Status.DONE, order: 0 },
  ];

  for (const t of demo) {
    await prisma.task.create({ data: { ...t, authorId: user.id } });
  }

  console.log("Seeded user:", { id: user.id, email: user.email });
  console.log("Dev password:", plain);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
