export default async function authRoutes(app) {
  app.post("/login", async (_req, reply) => reply.code(501).send({ error: "Not implemented" }));
  app.post("/logout", async (_req, reply) => reply.code(501).send({ error: "Not implemented" }));
}
