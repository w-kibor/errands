import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const ordersRouter = Router({ mergeParams: true });

const locationSchema = z.object({
  address: z.string().min(3),
  lat: z.number().optional(),
  lng: z.number().optional()
});

const orderSchema = z.object({
  pickup: locationSchema,
  dropoff: locationSchema,
  packageType: z.enum(['DOCUMENT', 'SMALL_BOX', 'MEDIUM_BOX', 'LARGE_BOX', 'FRAGILE']),
  urgency: z.enum(['NORMAL', 'EXPRESS']),
  price: z.number().int().nonnegative(),
  note: z.string().optional(),
  riderId: z.string().optional()
});

ordersRouter.get('/', async (req, res) => {
  const { userId } = req.params as { userId: string };
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    include: {
      rider: {
        select: {
          id: true,
          name: true,
          phone: true,
            avatar: true
        }
      }
    }
  });
  return res.json({ orders });
});

ordersRouter.post('/', async (req, res) => {
  const { userId } = req.params as { userId: string };
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid order payload', issues: parsed.error.flatten() });
  }

  const order = await prisma.order.create({
    data: {
      userId,
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      pickup: parsed.data.pickup,
      dropoff: parsed.data.dropoff,
      packageType: parsed.data.packageType,
      urgency: parsed.data.urgency,
      price: parsed.data.price,
      note: parsed.data.note,
      riderId: parsed.data.riderId
    },
    include: {
      rider: {
        select: {
          id: true,
          name: true,
          phone: true,
            avatar: true
        }
      }
    }
  });

  return res.status(201).json({ order });
});

ordersRouter.patch('/:orderId/status', async (req, res) => {
  const { orderId } = req.params as { orderId: string };
  const parsed = z.object({
    status: z.enum(['PENDING', 'RIDER_ASSIGNED', 'PICKING_UP', 'EN_ROUTE', 'DELIVERED', 'CANCELLED'])
  }).safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid status payload' });
  }

  const order = await prisma.order.update({
    where: { orderNumber: orderId },
    data: { status: parsed.data.status }
  });

  return res.json({ order });
});
