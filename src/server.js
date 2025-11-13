import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';

import prismaPlugin from './plugins/prisma.js';
import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';

const PORT = Number(process.env.PORT || 5174);

const API_PREFIX = '/api';

const app = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      allErrors: true,
      removeAdditional: false,
      useDefaults: true,
      coerceTypes: 'array',
    },
  },
});

// Enable cookies and JWT
await app.register(cookie, { hook: 'onRequest' });
// CORS for frontend; allow credentials for cookie-based auth
await app.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
});
await app.register(jwt, {
  secret: process.env.JWT_SECRET,
  cookie: { cookieName: 'olejra_token' },
});
await app.register(prismaPlugin);
await app.register(authRoutes, { prefix: `${API_PREFIX}/auth` });
await app.register(tasksRoutes, { prefix: `${API_PREFIX}/tasks` });

app.listen({ port: PORT });
console.log(`Server runing on ${PORT}`);
