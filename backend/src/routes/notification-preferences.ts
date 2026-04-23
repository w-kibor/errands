import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const notificationPreferencesRouter = Router({ mergeParams: true });

const preferenceSchema = z.object({
  key: z.string().min(1),
  enabled: z.boolean()
});

notificationPreferencesRouter.get('/', async (req, res) => {
  const { userId } = req.params as { userId: string };
  const notificationPreferences = await prisma.notificationPreference.findMany({
    where: { userId },
    orderBy: { key: 'asc' }
  });

  return res.json({ notificationPreferences });
});

notificationPreferencesRouter.patch('/:key', async (req, res) => {
  const { userId, key } = req.params as { userId: string; key: string };
  const parsed = preferenceSchema.partial({ key: true }).safeParse({ key, ...req.body });
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid notification preference payload', issues: parsed.error.flatten() });
  }

  const notificationPreference = await prisma.notificationPreference.upsert({
    where: {
      userId_key: {
        userId,
        key
      }
    },
    update: {
      enabled: parsed.data.enabled as boolean
    },
    create: {
      userId,
      key,
      enabled: parsed.data.enabled as boolean
    }
  });

  return res.json({ notificationPreference });
});
