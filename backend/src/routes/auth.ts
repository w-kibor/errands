import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const authRouter = Router();

const authSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(7),
  avatar: z.string().url().optional().or(z.literal(''))
});

authRouter.post('/register', async (req, res) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid registration payload', issues: parsed.error.flatten() });
  }

  const { phone, name, avatar } = parsed.data;
  const user = await prisma.$transaction(async (tx) => {
    const createdOrUpdatedUser = await tx.user.upsert({
      where: { phone },
      update: {
        ...(name ? { name } : {}),
        ...(avatar ? { avatar } : {})
      },
      create: {
        name: name || 'New User',
        phone,
        avatar: avatar || null,
        runnerCapabilities: []
      }
    });

    const addressCount = await tx.savedAddress.count({ where: { userId: createdOrUpdatedUser.id } });
    if (addressCount === 0) {
      await tx.savedAddress.create({
        data: {
          userId: createdOrUpdatedUser.id,
          label: 'Home',
          address: 'Kilimani, Nairobi',
          isPrimary: true
        }
      });
    }

    const paymentMethodCount = await tx.savedPaymentMethod.count({ where: { userId: createdOrUpdatedUser.id } });
    if (paymentMethodCount === 0) {
      await tx.savedPaymentMethod.create({
        data: {
          userId: createdOrUpdatedUser.id,
          type: 'MPESA',
          label: 'Personal M-Pesa',
          details: '*** *** 678',
          isDefault: true
        }
      });
    }

    const notificationPreferenceCount = await tx.notificationPreference.count({ where: { userId: createdOrUpdatedUser.id } });
    if (notificationPreferenceCount === 0) {
      await tx.notificationPreference.createMany({
        data: [
          { userId: createdOrUpdatedUser.id, key: 'order-updates', enabled: true },
          { userId: createdOrUpdatedUser.id, key: 'promotions', enabled: true },
          { userId: createdOrUpdatedUser.id, key: 'messages', enabled: true }
        ]
      });
    }

    return createdOrUpdatedUser;
  });

  return res.status(201).json({ user });
});

authRouter.post('/login', async (req, res) => {
  const parsed = authSchema.pick({ phone: true }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const user = await prisma.user.findUnique({
    where: { phone: parsed.data.phone }
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({ user });
});
