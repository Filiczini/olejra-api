// src/app.js
import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';

import prismaPlugin from './plugins/prisma.js';
import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';

const API_PREFIX = '/api';

export function buildApp() {
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

  // Enable cookies (required for cookie-based JWT)
  app.register(cookie, { hook: 'onRequest' });

  // CORS for frontend; allow credentials for cookie-based auth
  app.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.register(jwt, {
    secret: process.env.JWT_SECRET,
    cookie: { cookieName: 'olejra_token' },
  });

  app.register(prismaPlugin);

  app.register(authRoutes, { prefix: `${API_PREFIX}/auth` });
  app.register(tasksRoutes, { prefix: `${API_PREFIX}/tasks` });

  return app;
}
