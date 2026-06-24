import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { broadcastOrderStatusChange, onlineRunners } from '../lib/websocket.js';

export const jobsRouter = Router();

// GET /api/jobs/available?agentType=rider|runner
jobsRouter.get('/available', async (req, res) => {
  try {
    const { agentType } = req.query;

    if (agentType === 'rider') {
      // Riders accept Orders
      const orders = await prisma.order.findMany({
        where: {
          status: 'PENDING',
          riderId: null
        },
        orderBy: { date: 'desc' },
        include: {
          user: {
            select: { name: true, phone: true }
          }
        }
      });
      return res.json({ jobs: orders });
    } else if (agentType === 'runner') {
      // Runners accept ServiceRequests
      const serviceRequests = await prisma.serviceRequest.findMany({
        where: {
          status: 'PENDING',
          assignedRunnerId: null
        },
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { name: true, phone: true }
          }
        }
      });
      return res.json({ jobs: serviceRequests });
    } else {
      return res.status(400).json({ error: 'Invalid agentType. Must be rider or runner.' });
    }
  } catch (error) {
    console.error('Error fetching available jobs:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/jobs/:jobId/accept
jobsRouter.post('/:jobId/accept', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userId, agentType } = req.body;

    if (!userId || !agentType) {
      return res.status(400).json({ error: 'userId and agentType are required' });
    }

    if (agentType === 'rider') {
      // Accept order
      const order = await prisma.order.update({
        where: { orderNumber: jobId },
        data: {
          riderId: userId,
          status: 'RIDER_ASSIGNED'
        }
      });
      broadcastOrderStatusChange(order.orderNumber, order.status);
      return res.json({ job: order });
    } else if (agentType === 'runner') {
      // Accept service request
      const serviceRequest = await prisma.serviceRequest.update({
        where: { id: jobId },
        data: {
          assignedRunnerId: userId,
          status: 'ASSIGNED'
        }
      });
      broadcastOrderStatusChange(serviceRequest.id, serviceRequest.status);
      return res.json({ job: serviceRequest });
    } else {
      return res.status(400).json({ error: 'Invalid agentType' });
    }
  } catch (error) {
    console.error('Error accepting job:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/jobs/:jobId/status
jobsRouter.post('/:jobId/status', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, agentType } = req.body;

    if (!status || !agentType) {
      return res.status(400).json({ error: 'status and agentType are required' });
    }

    if (agentType === 'rider') {
      const order = await prisma.order.update({
        where: { orderNumber: jobId },
        data: { status }
      });
      broadcastOrderStatusChange(order.orderNumber, order.status);
      return res.json({ job: order });
    } else if (agentType === 'runner') {
      const serviceRequest = await prisma.serviceRequest.update({
        where: { id: jobId },
        data: { status }
      });
      broadcastOrderStatusChange(serviceRequest.id, serviceRequest.status);
      return res.json({ job: serviceRequest });
    } else {
      return res.status(400).json({ error: 'Invalid agentType' });
    }
  } catch (error) {
    console.error('Error updating job status:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/jobs/active/:runnerId?agentType=rider|runner
jobsRouter.get('/active/:runnerId', async (req, res) => {
  try {
    const { runnerId } = req.params;
    const { agentType } = req.query;

    if (agentType === 'rider') {
      const orders = await prisma.order.findMany({
        where: {
          riderId: runnerId,
          status: {
            in: ['RIDER_ASSIGNED', 'PICKING_UP', 'EN_ROUTE']
          }
        },
        orderBy: { date: 'desc' },
        include: {
          user: {
            select: { name: true, phone: true }
          }
        }
      });
      return res.json({ jobs: orders });
    } else if (agentType === 'runner') {
      const serviceRequests = await prisma.serviceRequest.findMany({
        where: {
          assignedRunnerId: runnerId,
          status: {
            in: ['ASSIGNED', 'IN_PROGRESS']
          }
        },
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { name: true, phone: true }
          }
        }
      });
      return res.json({ jobs: serviceRequests });
    } else {
      return res.status(400).json({ error: 'Invalid agentType' });
    }
  } catch (error) {
    console.error('Error fetching active jobs:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/jobs/history/:runnerId?agentType=rider|runner
jobsRouter.get('/history/:runnerId', async (req, res) => {
  try {
    const { runnerId } = req.params;
    const { agentType } = req.query;

    if (agentType === 'rider') {
      const orders = await prisma.order.findMany({
        where: {
          riderId: runnerId,
          status: {
            in: ['DELIVERED', 'CANCELLED']
          }
        },
        orderBy: { date: 'desc' }
      });
      return res.json({ jobs: orders });
    } else if (agentType === 'runner') {
      const serviceRequests = await prisma.serviceRequest.findMany({
        where: {
          assignedRunnerId: runnerId,
          status: {
            in: ['COMPLETED', 'CANCELLED']
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return res.json({ jobs: serviceRequests });
    } else {
      return res.status(400).json({ error: 'Invalid agentType' });
    }
  } catch (error) {
    console.error('Error fetching job history:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/runners/:runnerId/stats?agentType=rider|runner
jobsRouter.get('/stats/:runnerId', async (req, res) => {
  try {
    const { runnerId } = req.params;
    const { agentType } = req.query;

    let completedJobs = [];
    if (agentType === 'rider') {
      completedJobs = await prisma.order.findMany({
        where: {
          riderId: runnerId,
          status: 'DELIVERED'
        }
      });
    } else if (agentType === 'runner') {
      completedJobs = await prisma.serviceRequest.findMany({
        where: {
          assignedRunnerId: runnerId,
          status: 'COMPLETED'
        }
      });
    } else {
      return res.status(400).json({ error: 'Invalid agentType' });
    }

    const completedCount = completedJobs.length;
    
    // Sum prices (service requests default to 250)
    const totalEarnings = completedJobs.reduce((sum, job) => {
      const price = (job as any).price !== undefined ? (job as any).price : 250;
      return sum + price;
    }, 0);

    // Filter today's earnings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayJobs = completedJobs.filter(job => {
      const jobDate = new Date((job as any).date || (job as any).createdAt);
      return jobDate >= today;
    });

    const todayEarnings = todayJobs.reduce((sum, job) => {
      const price = (job as any).price !== undefined ? (job as any).price : 250;
      return sum + price;
    }, 0);

    return res.json({
      completedCount,
      totalEarnings,
      todayEarnings,
      completedJobs: completedJobs.map(job => ({
        id: (job as any).orderNumber || job.id,
        date: (job as any).date || job.createdAt,
        price: (job as any).price !== undefined ? (job as any).price : 250,
        pickup: (job as any).pickup,
        dropoff: (job as any).dropoff,
        status: job.status
      }))
    });
  } catch (error) {
    console.error('Error fetching runner stats:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/jobs/nearby-runners
jobsRouter.get('/nearby-runners', async (req, res) => {
  try {
    return res.json({ runners: Array.from(onlineRunners.values()) });
  } catch (error) {
    console.error('Error fetching nearby runners:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

