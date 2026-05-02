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

app.use(cors({ origin: true }));
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
