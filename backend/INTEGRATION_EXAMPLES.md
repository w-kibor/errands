# Email Integration Examples

This file shows how to integrate Postmark email sending into your SwiftDrop routes.

## Basic Usage

### 1. Send Order Confirmation

In `routes/orders.ts`, when an order is created:

```typescript
import { sendOrderConfirmation } from '../lib/email.js';

router.post('/create', async (req, res) => {
  // ... create order logic ...
  
  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      status: 'pending',
      items: req.body.items
    }
  });

  // Get user email
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user?.email) {
    // Send confirmation email
    const emailResult = await sendOrderConfirmation(user.email, {
      orderId: order.id,
      customerName: user.name || 'Valued Customer',
      totalAmount: order.totalAmount,
      status: order.status,
      estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleString(),
      items: req.body.items?.map((i: any) => i.name).join(', '),
      trackingUrl: `${process.env.APP_BASE_URL || 'https://swiftdrop.co.ke'}/track/${order.id}`
    });

    if (!emailResult.success) {
      console.warn('Failed to send order confirmation email:', emailResult.error);
      // Continue anyway - order created successfully
    }
  }

  return res.status(201).json({ order });
});
```

### 2. Send Status Update Email

In `routes/orders.ts`, when order status changes:

```typescript
import { sendOrderStatusUpdate } from '../lib/email.js';

router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status }
  });

  // Fetch user and runner info
  const user = await prisma.user.findUnique({ where: { id: order.userId } });
  const runner = order.runnerId 
    ? await prisma.user.findUnique({ where: { id: order.runnerId } })
    : null;

  if (user?.email) {
    await sendOrderStatusUpdate(user.email, {
      orderId: order.id,
      customerName: user.name || 'Valued Customer',
      status: status,
      statusDescription: getStatusDescription(status),
      runnerName: runner?.name,
      runnerPhone: runner?.phone,
      trackingUrl: `${process.env.APP_BASE_URL || 'https://swiftdrop.co.ke'}/track/${order.id}`
    });
  }

  return res.json({ order });
});

function getStatusDescription(status: string): string {
  const descriptions: Record<string, string> = {
    pending: 'We are finding a runner for your order',
    assigned: 'A runner has been assigned to your order',
    'in-transit': 'Your order is on the way to you',
    delivered: 'Your order has been delivered successfully',
    cancelled: 'Your order has been cancelled',
    failed: 'There was an issue with your delivery'
  };
  return descriptions[status] || 'Your order status has been updated';
}
```

### 3. Send Service Request Confirmation

In `routes/service-requests.ts`:

```typescript
import { sendServiceRequestCreated } from '../lib/email.js';

router.post('/create', async (req, res) => {
  const { serviceType, description, estimatedCost, dueDate } = req.body;
  
  const request = await prisma.serviceRequest.create({
    data: {
      userId,
      serviceType,
      description,
      estimatedCost,
      dueDate: new Date(dueDate)
    }
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user?.email) {
    await sendServiceRequestCreated(user.email, {
      requestId: request.id,
      customerName: user.name || 'Valued Customer',
      serviceType: serviceType,
      description: description,
      estimatedCost: estimatedCost,
      dueDate: new Date(dueDate).toLocaleDateString('en-KE'),
      dashboardUrl: `${process.env.APP_BASE_URL || 'https://swiftdrop.co.ke'}/requests/${request.id}`
    });
  }

  return res.status(201).json({ request });
});
```

### 4. Send Payment Receipt

In `routes/payment-methods.ts`:

```typescript
import { sendPaymentReceipt } from '../lib/email.js';

router.post('/process-payment', async (req, res) => {
  const { orderId, amount, paymentMethod } = req.body;

  // Process payment through M-Pesa, Stripe, etc.
  const transaction = {
    id: `TXN-${Date.now()}`,
    orderId,
    amount,
    paymentMethod,
    date: new Date()
  };

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (user?.email) {
    await sendPaymentReceipt(user.email, {
      transactionId: transaction.id,
      customerName: user.name || 'Valued Customer',
      amount: amount,
      paymentMethod: paymentMethod,
      date: transaction.date.toLocaleString('en-KE'),
      orderId: orderId
    });
  }

  return res.json({ success: true, transaction });
});
```

### 5. Send Welcome Email on Signup

In `routes/auth.ts`:

```typescript
import { sendWelcomeEmail } from '../lib/email.js';

router.post('/register', async (req, res) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid registration payload' });
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone
    }
  });

  // Send welcome email
  if (user.email) {
    await sendWelcomeEmail(user.email, {
      firstName: user.name?.split(' ')[0] || 'Friend',
      appUrl: process.env.APP_BASE_URL || 'https://swiftdrop.co.ke'
    });
  }

  return res.status(201).json({ user });
});
```

### 6. Notify Runners of New Jobs

In `routes/service-requests.ts` or a separate runner notification route:

```typescript
import { sendRunnerNotification } from '../lib/email.js';

// When a new delivery/service job is posted
async function notifyRunnersOfJob(serviceRequest: any) {
  // Find runners in the area
  const runnersInArea = await prisma.user.findMany({
    where: {
      runnerCapabilities: {
        some: { /* match runner capabilities */ }
      }
    }
  });

  // Send to each runner
  for (const runner of runnersInArea) {
    if (runner.email && runner.notificationPreferences?.some(p => p.key === 'job-alerts' && p.enabled)) {
      await sendRunnerNotification(runner.email, {
        runnerName: runner.name || 'Runner',
        jobTitle: serviceRequest.serviceType,
        jobDescription: serviceRequest.description,
        location: serviceRequest.location,
        estimatedPay: serviceRequest.estimatedCost,
        jobUrl: `${process.env.APP_BASE_URL || 'https://swiftdrop.co.ke'}/jobs/${serviceRequest.id}`
      });
    }
  }
}
```

## Error Handling

Always handle email sending errors gracefully:

```typescript
router.post('/create', async (req, res) => {
  try {
    // Create resource
    const resource = await prisma.resource.create({ /* ... */ });

    // Send email (don't block if it fails)
    const emailResult = await sendOrderConfirmation(email, data);
    
    if (!emailResult.success) {
      // Log the error but don't fail the request
      console.warn('Email delivery issue:', emailResult.error);
      // You might want to queue this for retry later
    }

    return res.status(201).json({ 
      resource,
      emailSent: emailResult.success 
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});
```

## Async Email Sending (Background Jobs)

For high-traffic scenarios, queue emails asynchronously:

```typescript
// Use a queue library like Bull or node-queue
import Queue from 'bull';

const emailQueue = new Queue('emails', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379)
  }
});

// Add job to queue
router.post('/create', async (req, res) => {
  const order = await prisma.order.create({ /* ... */ });
  
  // Queue email instead of sending immediately
  await emailQueue.add('order-confirmation', {
    userId: order.userId,
    orderId: order.id
  });

  return res.status(201).json({ order });
});

// Process queue jobs
emailQueue.process('order-confirmation', async (job) => {
  const user = await prisma.user.findUnique({ where: { id: job.data.userId } });
  const order = await prisma.order.findUnique({ where: { id: job.data.orderId } });

  if (user?.email) {
    return await sendOrderConfirmation(user.email, {
      orderId: order.id,
      customerName: user.name,
      totalAmount: order.totalAmount,
      status: order.status,
      estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleString(),
    });
  }
});
```

## Testing

Create a test file to verify email sending:

```typescript
// src/tests/email.test.ts
import { sendOrderConfirmation } from '../lib/email';

async function testEmailSending() {
  const result = await sendOrderConfirmation('test@example.com', {
    orderId: 'ORD-12345',
    customerName: 'John Doe',
    totalAmount: 2500,
    status: 'pending',
    estimatedDelivery: 'May 6, 2026 2:00 PM'
  });

  console.log('Email send result:', result);
  
  if (result.success) {
    console.log('✅ Email sent successfully. Message ID:', result.messageId);
  } else {
    console.error('❌ Failed to send email:', result.error);
  }
}

// Run: npx tsx src/tests/email.test.ts
testEmailSending().catch(console.error);
```

## Notification Preferences

Respect user notification preferences when sending emails:

```typescript
async function sendEmailIfAllowed(userId: string, email: string, type: string, sendFn: () => Promise<any>) {
  const prefs = await prisma.notificationPreference.findFirst({
    where: {
      userId,
      key: type
    }
  });

  if (prefs?.enabled !== false) { // Default to true if not set
    return await sendFn();
  }

  return { success: true, skipped: true };
}

// Usage
await sendEmailIfAllowed(
  userId,
  user.email,
  'order-updates',
  () => sendOrderConfirmation(user.email, data)
);
```

## Next Steps

1. Set up Postmark templates following [POSTMARK_SETUP.md](./POSTMARK_SETUP.md)
2. Add these integrations to your routes
3. Test with your Postmark account
4. Monitor deliverability in the Postmark dashboard
5. Set up bounce/complaint handling
