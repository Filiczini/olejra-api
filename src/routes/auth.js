export default async function authRoutes(app) {
  app.post(
    "/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          additionalProperties: false,
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6, maxLength: 128 },
          },
        },
        response: {
          200: {
            type: "object",
            required: ["ok"],
            additionalProperties: false,
            properties: { ok: { type: "boolean" } },
          },
          401: {
            type: "object",
            required: ["error"],
            additionalProperties: false,
            properties: { error: { type: "string" } },
          },
        },
      },
    },
    async (req, reply) => {
      const { email } = req.body;
      const user = await app.prisma.user.findUnique({ where: { email } });
      if (!user) reply.code(401).send({ error: "Invalid Credentials" });
      return reply.send({ ok: true });
    }
  );

  app.post(
    "/logout",
    {
      schema: {
        response: {
          200: {
            type: "object",
            required: ["ok"],
            additionalProperties: false,
            properties: { ok: { type: "boolean" } },
          },
        },
      },
    },
    async (req, reply) => reply.code(501).send({ error: "Not implemented" })
  );
}
