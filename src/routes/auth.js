import bcrypt from "bcryptjs";

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
      const { email, password } = req.body;

      const user = await app.prisma.user.findUnique({ where: { email } });
      if (!user) return reply.code(401).send({ error: "Invalid Credentials" });

      const hash = user.passwordHash ?? "";
      const ok = await bcrypt.compare(password, hash);
      if (!ok) return reply.code(401).send({ error: "Invalid credentials" });

      const token = await reply.jwtSign({ uid: user.id, email: user.email }, { expiresIn: "7d" });
      reply.setCookie("olejra_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
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
    async (req, reply) => {
      reply.clearCookie("olejra_token", { path: "/" });
      return reply.send({ ok: true });
    }
  );
  app.get(
    "/me",
    {
      schema: {
        response: {
          200: {
            type: "object",
            required: ["user"],
            additionalProperties: false,
            properties: {
              user: {
                type: "object",
                required: ["id", "email"],
                additionalProperties: false,
                properties: {
                  id: { type: "string" },
                  email: { type: "string", format: "email" },
                },
              },
            },
          },
          401: {
            type: "object",
            required: ["error"],
            additionalProperties: false,
            properties: { error: { type: "string" } },
          },
        },
      },
      preHandler: async (req, reply) => {
        try {
          await req.jwtVerify({ onlyCookie: true });
        } catch {
          return reply.code(401).send({ error: "Unauthorized" });
        }
      },
    },
    async (req) => {
      console.log(req.user);
      return { user: { id: req.user.uid, email: req.user.email } };
    }
  );
}
