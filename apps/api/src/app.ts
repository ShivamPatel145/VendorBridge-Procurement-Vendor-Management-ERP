import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

// Route imports
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/users/users.routes';
import { vendorRoutes } from './modules/vendors/vendors.routes';
import { rfqRoutes } from './modules/rfqs/rfqs.routes';
import { quotationRoutes } from './modules/quotations/quotations.routes';
import { approvalRoutes } from './modules/approvals/approvals.routes';
import { purchaseOrderRoutes } from './modules/purchase-orders/po.routes';
import { invoiceRoutes } from './modules/invoices/invoices.routes';
import { notificationRoutes } from './modules/notifications/notifications.routes';
import { reportRoutes } from './modules/reports/reports.routes';

const app = express();

// ─── Security ────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// ─── Rate Limiting ───────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(env.RATE_LIMIT_MAX),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, code: 'TOO_MANY_REQUESTS', message: 'Too many requests' },
});
app.use(limiter);

// ─── Body Parser ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// ─── Logging ─────────────────────────────────────────────────
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Health Check ────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: env.API_VERSION, timestamp: new Date().toISOString() });
});

// ─── API Routes ──────────────────────────────────────────────
const API_PREFIX = `/api/${env.API_VERSION}`;

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/vendors`, vendorRoutes);
app.use(`${API_PREFIX}/rfqs`, rfqRoutes);
app.use(`${API_PREFIX}/quotations`, quotationRoutes);
app.use(`${API_PREFIX}/approvals`, approvalRoutes);
app.use(`${API_PREFIX}/purchase-orders`, purchaseOrderRoutes);
app.use(`${API_PREFIX}/invoices`, invoiceRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/reports`, reportRoutes);

// ─── Error Handling ──────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
