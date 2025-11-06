const STATUS_FLOW = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'];

const tasks = [
  { id: 1, title: 'Design API', status: 'BACKLOG' },
  { id: 2, title: 'Setup DB', status: 'TODO' },
  { id: 3, title: 'Create board UI', status: 'IN_PROGRESS' },
];

export default async function tasksRoutes(app) {
  app.get(
    '/',
    {
      preHandler: async (req, reply) => {
        try {
          await req.jwtVerify({ onlyCookie: true });
        } catch {
          return reply.code(401).send({ error: 'Unauthorized' });
        }
      },
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
    async () => tasks
  );
  app.post(
    '/:id/advance',
    {
      preHandler: async (req, reply) => {
        try {
          await req.jwtVerify({ onlyCookie: true });
        } catch {
          return reply.code(401).send({ error: 'Unauthorized' });
        }
      },
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          additionalProperties: false,
          properties: { id: { type: 'integer' } },
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
            properties: { error: { type: 'string' } },
          },
          404: {
            type: 'object',
            required: ['error'],
            additionalProperties: false,
            properties: { error: { type: 'string' } },
          },
        },
      },
    },
    async (req, reply) => {
      const id = Number(req.params.id);
      const task = tasks.find((t) => t.id === id);
      if (!task) return reply.code(404).send({ error: 'Not found' });

      const i = STATUS_FLOW.indexOf(task.status);
      if (i < STATUS_FLOW.length - 1) task.status = STATUS_FLOW[i + 1];
      return task;
    }
  );
}
