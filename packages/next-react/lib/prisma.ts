import { PrismaLibSql } from '@prisma/adapter-libsql'

import { PrismaClient } from '@/generated/prisma'

/**
 * Creates the libsql adapter for SQLite
 * @returns PrismaLibSql adapter instance
 */
const createAdapter = () => {
  return new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:./dev.db',
  })
}

/**
 * Global Prisma client singleton to prevent multiple instances in development
 * @see https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Prisma client instance with libsql adapter
 * Uses singleton pattern to avoid connection issues in Next.js dev mode
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: createAdapter(),
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
