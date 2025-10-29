import Fastify from "fastify";
import cors from "@fastify/cors";
import authRoutes from "./routes/auth.js";

const PORT = Number(process.env.PORT || 5174);

const API_PREFIX = "/api";

// Static user && tasks for board
const fakeUser = { email: "admin@admin.ua", password: "1234" };
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
  ajv: { customOptions: { allErrors: true, removeAdditional: true, useDefaults: true, coerceTypes: "array" } },
});
await app.register(cors, { origin: true });
await app.register(authRoutes, { prefix: `${API_PREFIX}/auth` });

// Get all tasks
app.get("/tasks", async () => fakeTasks);

app.post("/login", async (req, reply) => {
  const { email, password } = req.body;
  if (email === fakeUser.email && password === fakeUser.password) {
    return { success: true };
  }
  reply.code(401).send({ success: false, message: "Invalid credentials" });
});

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
