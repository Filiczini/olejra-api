// Task board routes: protected by JWT cookie and backed by Prisma.

const STATUS_FLOW = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'];

async function authPreHandler(req, reply) {
  try {
    await req.jwtVerify({ onlyCookie: true });
  } catch {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
}

export default async function tasksRoutes(app) {
  app.get(
    '/',
    {
      preHandler: authPreHandler,
      schema: {
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'title', 'status'],
              additionalProperties: false,
              properties: {
                id: { type: 'integer' },
                title: { type: 'string' },
                status: { type: 'string', enum: STATUS_FLOW },
              },
            },
          },
          400: {
            type: 'object',
            required: ['error'],
            additionalProperties: false,
            properties: { error: { type: 'string' } },
          },
        },
      },
    },
    async () => {
      // Read tasks from PostgreSQL via Prisma. Sorting ensures stable column order.
      const rows = await app.prisma.task.findMany({
        orderBy: [{ status: 'asc' }, { order: 'asc' }, { id: 'asc' }],
        select: {
          id: true,
          title: true,
          status: true,
        },
      });

      return rows;
    }
  );
  app.post(
    '/:id/advance',
    {
      preHandler: authPreHandler,
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          additionalProperties: false,
          properties: {
            id: { type: 'integer' },
          },
        },
        response: {
          200: {
            type: 'object',
            required: ['id', 'title', 'status'],
            additionalProperties: false,
            properties: {
              id: { type: 'integer' },
              title: { type: 'string' },
              status: { type: 'string', enum: STATUS_FLOW },
            },
          },
          401: {
            type: 'object',
            required: ['error'],
            additionalProperties: false,
            properties: {
              error: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            required: ['error'],
            additionalProperties: false,
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (req, reply) => {
      const id = Number(req.params.id);

      const existing = await app.prisma.task.findUnique({
        where: { id },
        select: { id: true, title: true, status: true },
      });

      if (!existing) {
        return reply.code(404).send({ error: 'Not found' });
      }

      const currentIndex = STATUS_FLOW.indexOf(existing.status);
      const nextStatus = currentIndex < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIndex + 1] : existing.status;

      const updated = await app.prisma.task.update({
        where: { id },
        data: { status: nextStatus },
        select: { id: true, title: true, status: true },
      });

      return updated;
    }
  );
}
