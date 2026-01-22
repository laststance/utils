import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

/**
 * Prisma configuration for CLI operations (migrate, db push, etc.)
 * @see https://pris.ly/d/prisma7-client-config
 */
export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),
  },
})
