// index.js (бек)
import Fastify from "fastify";
import cors from "@fastify/cors";

const PORT = Number(process.env.PORT || 5174);
const HOST = "0.0.0.0";
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

const app = Fastify({ logger: true });

async function start() {
  await app.register(cors, {
    origin: FRONTEND_ORIGIN,
    credentials: true,
  });

  app.get("/api/hello", async () => ({ message: "Hello from Olejra API 👋" }));
  app.post("/api/echo", async (req) => ({ youSent: req.body ?? null }));
  app.get("/", async () => ({ message: "Olejra API is running" }));

  try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`➡️  Listening on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
