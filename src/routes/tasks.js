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
  // GET /api/tasks – return all tasks.
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
  // GET /api/tasks/:id – return full task details for the current user.
  app.get(
    '/:id',
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
              description: { type: 'string', nullable: true },
              status: { type: 'string', enum: STATUS_FLOW },
              createdAt: { type: 'string', format: 'data-time' },
              updatedAt: { type: 'string', format: 'data-time' },
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
          401: {
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

      const task = await app.prisma.task.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!task) {
        return reply.code(404).send({ error: 'Task not found. Brah...' });
      }
      return task;
    }
  );
  // POST /api/tasks/advance – move task forward one status.
  app.post(
    '/advance',
    {
      preHandler: authPreHandler,
      schema: {
        body: {
          type: 'object',
          required: ['taskId', 'from', 'to'],
          additionalProperties: false,
          properties: {
            taskId: { type: 'integer' },
            from: { type: 'string', enum: STATUS_FLOW },
            to: { type: 'string', enum: STATUS_FLOW },
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
      const { taskId, from, to } = req.body;

      const task = await app.prisma.task.findUnique({
        where: { id: taskId },
        select: {
          id: true,
          title: true,
          status: true,
        },
      });

      if (!task) return reply.code(404).send({ error: 'Task not found' });

      if (task.status !== from) {
        return reply
          .code(400)
          .send({ error: 'Invalid from status for this task' });
      }

      const fromIndex = STATUS_FLOW.indexOf(from);
      const toIndex = STATUS_FLOW.indexOf(to);

      const isNextStep = toIndex - fromIndex === 1;
      if (!isNextStep)
        return reply.code(400).send({ error: 'Usupported status transition' });

      const updated = await app.prisma.task.update({
        where: { id: taskId },
        data: { status: to },
        select: { id: true, title: true, status: true },
      });

      return updated;
    }
  );
}
