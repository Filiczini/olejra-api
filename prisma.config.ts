import * as dotenv from "dotenv";
// Load env from prisma/.env so env('DATABASE_URL') works in config
dotenv.config({ path: "prisma/.env" });
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});