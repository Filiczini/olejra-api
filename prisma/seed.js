import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // тимчасово додай у seed.js на початок main()
  const [{ current_database, current_schema }] = await prisma.$queryRaw`
  SELECT current_database(), current_schema();
`;
  console.log({ current_database, current_schema });
  const email = 'test@olejra.app';
  const plain = 'changeme123';

  const passwordHash = await bcrypt.hash(plain, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  const demo = [
    { title: 'Design API', status: 'BACKLOG', order: 0 },
    { title: 'Setup DB', status: 'BACKLOG', order: 1 },
    { title: 'Configure Prisma', status: 'BACKLOG', order: 2 },
    { title: 'Create board UI', status: 'TODO', order: 0 },
    { title: 'Implement login', status: 'TODO', order: 1 },
    { title: 'Build AuthGate', status: 'TODO', order: 2 },
    { title: 'Implement tasks GET', status: 'IN_PROGRESS', order: 0 },
    { title: 'Implement tasks POST', status: 'IN_PROGRESS', order: 1 },
    { title: 'Implement tasks advance', status: 'IN_PROGRESS', order: 2 },
    { title: 'Deploy backend', status: 'DONE', order: 0 },
    { title: 'Deploy frontend', status: 'DONE', order: 1 },
    { title: 'Fix CORS issues', status: 'DONE', order: 2 },
    { title: 'Refactor API layer', status: 'BACKLOG', order: 3 },
    { title: 'Improve UI styling', status: 'TODO', order: 3 },
    { title: 'Write unit tests', status: 'IN_PROGRESS', order: 3 },
  ];

  for (const t of demo) {
    await prisma.task.create({ data: { ...t, authorId: user.id } });
  }

  console.log('Seeded user:', { id: user.id, email: user.email });
  console.log('Dev password:', plain);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
