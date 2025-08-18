import Fastify from "fastify";

const app = Fastify({ logger: true });
app.get("/health", { logLevel: "warn" }, async () => ({ ok: true }));
app.get("/", async () => ({ message: "Olejra API is running" }));

const PORT = Number(process.env.PORT || 5174);
const HOST = "0.0.0.0";

app.listen({ port: PORT, host: HOST }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
