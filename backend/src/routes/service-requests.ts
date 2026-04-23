import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const serviceRequestsRouter = Router({ mergeParams: true });

const locationSchema = z.object({
  address: z.string().min(3),
  lat: z.number().optional(),
  lng: z.number().optional()
});

const serviceRequestSchema = z.object({
  serviceId: z.string().min(2),
  serviceName: z.enum([
    'CBD_BATCH_DELIVERY',
    'PERSONAL_SHOPPING',
    'PARCEL_PICKUP_AND_DROP_OFF',
    'SHOP_LEGITIMACY_VERIFICATION',
    'CUSTOM_TASK_REQUESTS',
    'DEDICATED_BUSINESS_ERRANDS_SUPPORT'
  ]),
  pickup: locationSchema.optional(),
  dropoff: locationSchema.optional(),
  businessName: z.string().optional(),
  instructions: z.string().min(3),
  urgency: z.enum(['NORMAL', 'EXPRESS'])
});

serviceRequestsRouter.get('/', async (req, res) => {
  const { userId } = req.params as { userId: string };
  const serviceRequests = await prisma.serviceRequest.findMany({
    where: { customerId: userId },
    orderBy: { createdAt: 'desc' }
  });
  return res.json({ serviceRequests });
});

serviceRequestsRouter.post('/', async (req, res) => {
  const { userId } = req.params as { userId: string };
  const parsed = serviceRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid service request payload', issues: parsed.error.flatten() });
  }

  const serviceRequest = await prisma.serviceRequest.create({
    data: {
      customerId: userId,
      serviceId: parsed.data.serviceId,
      serviceName: parsed.data.serviceName,
      pickup: parsed.data.pickup,
      dropoff: parsed.data.dropoff,
      businessName: parsed.data.businessName,
      instructions: parsed.data.instructions,
      urgency: parsed.data.urgency
    }
  });

  return res.status(201).json({ serviceRequest });
});

serviceRequestsRouter.patch('/:requestId/status', async (req, res) => {
  const { requestId } = req.params as { requestId: string };
  const parsed = z.object({
    status: z.enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  }).safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid status payload' });
  }

  const serviceRequest = await prisma.serviceRequest.update({
    where: { id: requestId },
    data: { status: parsed.data.status }
  });

  return res.json({ serviceRequest });
});
