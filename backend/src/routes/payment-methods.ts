import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const paymentMethodsRouter = Router({ mergeParams: true });

const paymentMethodSchema = z.object({
  type: z.enum(['MPESA', 'CARD', 'CASH_ON_DELIVERY']),
  label: z.string().min(2),
  details: z.string().min(3),
  isDefault: z.boolean().optional()
});

paymentMethodsRouter.get('/', async (req, res) => {
  const { userId } = req.params as { userId: string };
  const paymentMethods = await prisma.savedPaymentMethod.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
  });
  return res.json({ paymentMethods });
});

paymentMethodsRouter.post('/', async (req, res) => {
  const { userId } = req.params as { userId: string };
  const parsed = paymentMethodSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payment method payload', issues: parsed.error.flatten() });
  }

  const created = await prisma.$transaction(async (tx) => {
    if (parsed.data.isDefault) {
      await tx.savedPaymentMethod.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    return tx.savedPaymentMethod.create({
      data: {
        userId,
        type: parsed.data.type,
        label: parsed.data.label,
        details: parsed.data.details,
        isDefault: Boolean(parsed.data.isDefault)
      }
    });
  });

  return res.status(201).json({ paymentMethod: created });
});

paymentMethodsRouter.patch('/:methodId/default', async (req, res) => {
  const { userId, methodId } = req.params as { userId: string; methodId: string };

  await prisma.$transaction([
    prisma.savedPaymentMethod.updateMany({
      where: { userId },
      data: { isDefault: false }
    }),
    prisma.savedPaymentMethod.update({
      where: { id: methodId },
      data: { isDefault: true }
    })
  ]);

  const paymentMethods = await prisma.savedPaymentMethod.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
  });

  return res.json({ paymentMethods });
});

paymentMethodsRouter.delete('/:methodId', async (req, res) => {
  const { userId, methodId } = req.params as { userId: string; methodId: string };

  await prisma.savedPaymentMethod.delete({ where: { id: methodId } });

  const remaining = await prisma.savedPaymentMethod.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
  });

  if (remaining.length > 0 && !remaining.some((item) => item.isDefault)) {
    await prisma.savedPaymentMethod.update({
      where: { id: remaining[0].id },
      data: { isDefault: true }
    });
  }

  const paymentMethods = await prisma.savedPaymentMethod.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
  });

  return res.json({ paymentMethods });
});
