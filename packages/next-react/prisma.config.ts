import 'dotenv/config'
import { defineConfig } from 'prisma/config'

/**
 * Prisma configuration for CLI operations (migrate, db push, etc.)
 * Uses DATABASE_URL from environment, falls back to local SQLite for CI/generate.
 * @see https://pris.ly/d/prisma7-client-config
 */
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
  },
})
