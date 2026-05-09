import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { usersRouter } from './routes/users.js';
import { addressesRouter } from './routes/addresses.js';
import { paymentMethodsRouter } from './routes/payment-methods.js';
import { ordersRouter } from './routes/orders.js';
import { serviceRequestsRouter } from './routes/service-requests.js';
import { messagesRouter } from './routes/messages.js';
import { notificationPreferencesRouter } from './routes/notification-preferences.js';
import { servicesRouter } from './routes/services.js';
import { adminBypass } from './middleware/adminBypass.js';

const app = express();
const port = Number(process.env.PORT || 4000);

// Configure CORS to allow development and production origins
const allowedOrigins = [
  'http://localhost:3000',    // Local dev (if using port 3000)
  'http://localhost:5173',    // Vite dev server
  'https://errand-shop.vercel.app', // Production frontend
  'https://errands-agb5.onrender.com' // Allow same-origin requests during testing
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(adminBypass);

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'SwiftDrop API' });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/users/:userId/addresses', addressesRouter);
app.use('/api/users/:userId/payment-methods', paymentMethodsRouter);
app.use('/api/users/:userId/orders', ordersRouter);
app.use('/api/users/:userId/service-requests', serviceRequestsRouter);
app.use('/api/users/:userId/messages', messagesRouter);
app.use('/api/users/:userId/notifications', notificationPreferencesRouter);
app.use('/api/services', servicesRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`SwiftDrop API running on http://localhost:${port}`);
});
/* Backend redeployment trigger - Sat May  9 05:44:47 PM EAT 2026 */
