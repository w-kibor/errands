import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const usersRouter = Router();

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(7).optional(),
  avatar: z.string().optional().or(z.literal('')),
  isRunner: z.boolean().optional(),
  runnerVehicleType: z.string().optional(),
  runnerCoverageArea: z.string().optional(),
  runnerCapabilities: z.array(z.string()).optional(),
  runnerVerified: z.boolean().optional()
});

usersRouter.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: { orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }] },
      paymentMethods: { orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }] }
    }
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({ user });
});

usersRouter.patch('/:userId', async (req, res) => {
  const { userId } = req.params;
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid profile payload', issues: parsed.error.flatten() });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(parsed.data.name ? { name: parsed.data.name } : {}),
      ...(parsed.data.email !== undefined ? { email: parsed.data.email || null } : {}),
      ...(parsed.data.phone ? { phone: parsed.data.phone } : {}),
      ...(parsed.data.avatar !== undefined ? { avatar: parsed.data.avatar || null } : {}),
      ...(parsed.data.isRunner !== undefined ? { isRunner: parsed.data.isRunner } : {}),
      ...(parsed.data.runnerVehicleType !== undefined ? { runnerVehicleType: parsed.data.runnerVehicleType || null } : {}),
      ...(parsed.data.runnerCoverageArea !== undefined ? { runnerCoverageArea: parsed.data.runnerCoverageArea || null } : {}),
      ...(parsed.data.runnerCapabilities ? { runnerCapabilities: parsed.data.runnerCapabilities } : {}),
      ...(parsed.data.runnerVerified !== undefined ? { runnerVerified: parsed.data.runnerVerified } : {})
    }
  });

  return res.json({ user });
});
