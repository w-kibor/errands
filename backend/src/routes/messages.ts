import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const messagesRouter = Router({ mergeParams: true });

const messageSchema = z.object({
  orderId: z.string().min(2),
  text: z.string().min(1),
  isRider: z.boolean().optional(),
  senderId: z.string().min(1).optional()
});

messagesRouter.get('/', async (req, res) => {
  const { userId } = req.params as { userId: string };
  const orderId = String(req.query.orderId || '');

  if (!orderId) {
    return res.status(400).json({ error: 'orderId is required' });
  }

  const messages = await prisma.message.findMany({
    where: { userId, orderId },
    orderBy: { createdAt: 'asc' }
  });

  return res.json({ messages });
});

messagesRouter.post('/', async (req, res) => {
  const { userId } = req.params as { userId: string };
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid message payload', issues: parsed.error.flatten() });
  }

  const message = await prisma.message.create({
    data: {
      userId,
      orderId: parsed.data.orderId,
      senderId: parsed.data.senderId || userId,
      text: parsed.data.text,
      isRider: Boolean(parsed.data.isRider)
    }
  });

  return res.status(201).json({ message });
});
