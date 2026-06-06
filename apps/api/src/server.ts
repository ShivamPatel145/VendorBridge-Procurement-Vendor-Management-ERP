import app from './app';
import { env } from './config/env';
import prisma from './config/database';

const PORT = parseInt(env.PORT, 10);

async function bootstrap() {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`🚀 VendorBridge API running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api/${env.API_VERSION}`);
      console.log(`❤️  Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap();
