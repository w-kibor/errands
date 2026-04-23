import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const addressesRouter = Router({ mergeParams: true });

const addressSchema = z.object({
  label: z.string().min(2),
  address: z.string().min(5),
  isPrimary: z.boolean().optional()
});

addressesRouter.get('/', async (req, res) => {
  const { userId } = req.params as { userId: string };
  const addresses = await prisma.savedAddress.findMany({
    where: { userId },
    orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }]
  });
  return res.json({ addresses });
});

addressesRouter.post('/', async (req, res) => {
  const { userId } = req.params as { userId: string };
  const parsed = addressSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid address payload', issues: parsed.error.flatten() });
  }

  const created = await prisma.$transaction(async (tx) => {
    if (parsed.data.isPrimary) {
      await tx.savedAddress.updateMany({
        where: { userId },
        data: { isPrimary: false }
      });
    }

    return tx.savedAddress.create({
      data: {
        userId,
        label: parsed.data.label,
        address: parsed.data.address,
        isPrimary: Boolean(parsed.data.isPrimary)
      }
    });
  });

  return res.status(201).json({ address: created });
});

addressesRouter.patch('/:addressId', async (req, res) => {
  const { userId, addressId } = req.params as { userId: string; addressId: string };
  const parsed = addressSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid address payload', issues: parsed.error.flatten() });
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (parsed.data.isPrimary) {
      await tx.savedAddress.updateMany({
        where: { userId, NOT: { id: addressId } },
        data: { isPrimary: false }
      });
    }

    return tx.savedAddress.update({
      where: { id: addressId },
      data: {
        label: parsed.data.label,
        address: parsed.data.address,
        isPrimary: Boolean(parsed.data.isPrimary)
      }
    });
  });

  return res.json({ address: updated });
});

addressesRouter.patch('/:addressId/primary', async (req, res) => {
  const { userId, addressId } = req.params as { userId: string; addressId: string };

  await prisma.$transaction([
    prisma.savedAddress.updateMany({
      where: { userId },
      data: { isPrimary: false }
    }),
    prisma.savedAddress.update({
      where: { id: addressId },
      data: { isPrimary: true }
    })
  ]);

  const addresses = await prisma.savedAddress.findMany({
    where: { userId },
    orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }]
  });

  return res.json({ addresses });
});

addressesRouter.delete('/:addressId', async (req, res) => {
  const { userId, addressId } = req.params as { userId: string; addressId: string };

  await prisma.savedAddress.delete({ where: { id: addressId } });

  const remaining = await prisma.savedAddress.findMany({
    where: { userId },
    orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }]
  });

  if (remaining.length > 0 && !remaining.some((item) => item.isPrimary)) {
    await prisma.savedAddress.update({
      where: { id: remaining[0].id },
      data: { isPrimary: true }
    });
  }

  const addresses = await prisma.savedAddress.findMany({
    where: { userId },
    orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }]
  });

  return res.json({ addresses });
});
