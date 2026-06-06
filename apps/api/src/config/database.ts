import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Neon free tier suspends after inactivity — this retries once on connection drop
const originalQuery = prisma.$queryRawUnsafe.bind(prisma);

async function withReconnect<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    // E57P01 = Neon/Postgres "terminating connection due to administrator command"
    const isNeonSuspend =
      err?.message?.includes('terminating connection') ||
      err?.code === 'E57P01' ||
      err?.cause?.code === 'E57P01';

    if (isNeonSuspend) {
      console.warn('⚠️  Neon DB connection was suspended. Reconnecting...');
      await prisma.$disconnect();
      await new Promise((r) => setTimeout(r, 2000)); // wait 2s for Neon to resume
      await prisma.$connect();
      return await fn(); // retry once
    }
    throw err;
  }
}

export { withReconnect };
export default prisma;
