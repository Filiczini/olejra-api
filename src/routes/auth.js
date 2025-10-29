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
    async (_req, reply) => {
      return reply.code(501).send({ error: "Not implemented" });
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
    async (_req, reply) => {
      // Real logout logic (clear cookie) will be added later.
      return reply.code(501).send({ error: "Not implemented" });
    }
  );
}
