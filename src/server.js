import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";

import prismaPlugin from "./plugins/prisma.js";
import authRoutes from "./routes/auth.js";

const PORT = Number(process.env.PORT || 5174);

const API_PREFIX = "/api";

// Static tasks for board
const fakeTasks = [
  {
    id: 1,
    title: "Configure project for future work",
    status: "BACKLOG",
  },
  {
    id: 2,
    title: "To learn JavaScript for skill matrix",
    status: "TODO",
  },
  { id: 3, title: "To learn React for skill matrix", status: "BACKLOG" },
];

const app = Fastify({
  logger: true,
  ajv: { customOptions: { allErrors: true, removeAdditional: false, useDefaults: true, coerceTypes: "array" } },
});

// CORS for frontend; allow credentials for cookie-based auth
await app.register(cors, { origin: process.env.CORS_ORIGIN || true, credentials: true });
// Enable cookies and JWT
await app.register(cookie, { hook: "onRequest" });
await app.register(jwt, {
  secret: process.env.JWT_SECRET || "dev_secret_change_me",
  cookie: { cookieName: "olejra_token", signed: false },
});
await app.register(prismaPlugin);
await app.register(authRoutes, { prefix: `${API_PREFIX}/auth` });

// Get all tasks
app.get("/tasks", async () => fakeTasks);

app.post("/tasks/:id/advance", async (req, reply) => {
  const { id } = req.params;
  const task = fakeTasks.find((t) => t.id === Number(id));
  if (!task) return reply.code(404).send({ message: "Not found" });

  const order = ["BACKLOG", "TODO", "IN_PROGRESS", "DONE"];
  const indexOrder = order.indexOf(task.status);
  if (indexOrder < order.length - 1) task.status = order[indexOrder + 1];
  return task;
});

app.listen({ port: PORT });
console.log(`Server runing on ${PORT}`);
