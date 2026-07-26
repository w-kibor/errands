import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { broadcastOrderStatusChange, onlineRunners } from '../lib/websocket.js';

export const adminRouter = Router();

// GET /api/admin/overview - Dashboard stats
adminRouter.get('/overview', async (_req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);

    const [
      allOrders,
      ordersTodayCount,
      completedTodayCount,
      cancelledTodayCount,
      activeDeliveriesCount,
      pendingDispatchesCount,
      allRunners,
      recentOrders,
      serviceRequests
    ] = await Promise.all([
      prisma.order.findMany({
        select: { price: true, status: true, date: true }
      }),
      prisma.order.count({
        where: { date: { gte: today } }
      }),
      prisma.order.count({
        where: { date: { gte: today }, status: 'DELIVERED' }
      }),
      prisma.order.count({
        where: { date: { gte: today }, status: 'CANCELLED' }
      }),
      prisma.order.count({
        where: { status: { in: ['RIDER_ASSIGNED', 'PICKING_UP', 'EN_ROUTE'] } }
      }),
      prisma.order.count({
        where: { status: 'PENDING' }
      }),
      prisma.user.findMany({
        where: { isRunner: true },
        select: { id: true, runnerVehicleType: true, runnerVerified: true }
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { date: 'desc' },
        include: {
          user: { select: { name: true } }
        }
      }),
      prisma.serviceRequest.findMany({
        select: { status: true, createdAt: true }
      })
    ]);

    // Calculate Revenues
    const totalRevenue = allOrders
      .filter((o) => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + o.price, 0);

    const thisWeekRevenue = allOrders
      .filter((o) => o.status === 'DELIVERED' && new Date(o.date) >= weekAgo)
      .reduce((sum, o) => sum + o.price, 0);

    const thisMonthRevenue = allOrders
      .filter((o) => o.status === 'DELIVERED' && new Date(o.date) >= monthAgo)
      .reduce((sum, o) => sum + o.price, 0);

    const activeFleetCount = allRunners.length;
    const ridersCount = allRunners.filter(r => r.runnerVehicleType?.toLowerCase().includes('bike') || r.runnerVehicleType?.toLowerCase().includes('motorcycle')).length;
    const runnersCount = activeFleetCount - ridersCount;

    // Recent activity list
    const recentActivity = recentOrders.map((o) => ({
      id: o.id,
      text: `Order #${o.orderNumber} is ${o.status.toLowerCase().replace('_', ' ')} (${o.user?.name || 'Customer'})`,
      time: new Date(o.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: o.status === 'DELIVERED' ? 'success' : o.status === 'CANCELLED' ? 'error' : 'info'
    }));

    return res.json({
      totalRevenue,
      thisWeekRevenue,
      thisMonthRevenue,
      ordersToday: ordersTodayCount,
      completedToday: completedTodayCount,
      cancelledToday: cancelledTodayCount,
      activeDeliveries: activeDeliveriesCount,
      pendingDispatches: pendingDispatchesCount,
      activeFleetCount,
      ridersCount,
      runnersCount,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching admin overview:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/orders - Get all orders
adminRouter.get('/orders', async (req, res) => {
  try {
    const { search, status } = req.query;

    const whereClause: any = {};
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }
    if (search) {
      const q = String(search).toLowerCase();
      whereClause.OR = [
        { orderNumber: { contains: q, mode: 'insensitive' } },
        { user: { name: { contains: q, mode: 'insensitive' } } },
        { user: { phone: { contains: q, mode: 'insensitive' } } }
      ];
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      include: {
        user: { select: { id: true, name: true, phone: true, email: true } },
        rider: { select: { id: true, name: true, phone: true, runnerVehicleType: true } }
      }
    });

    return res.json({ orders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH /api/admin/orders/:orderId/status
adminRouter.patch('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { orderNumber: orderId },
      data: { status }
    });

    broadcastOrderStatusChange(order.orderNumber, order.status);
    return res.json({ order });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/admin/orders/:orderId/assign - Assign rider to order
adminRouter.post('/orders/:orderId/assign', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { riderId } = req.body;

    const order = await prisma.order.update({
      where: { orderNumber: orderId },
      data: {
        riderId,
        status: 'RIDER_ASSIGNED'
      },
      include: {
        rider: { select: { id: true, name: true, phone: true } }
      }
    });

    broadcastOrderStatusChange(order.orderNumber, order.status);
    return res.json({ order });
  } catch (error) {
    console.error('Error assigning rider:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/service-requests - Get custom errand requests
adminRouter.get('/service-requests', async (req, res) => {
  try {
    const serviceRequests = await prisma.serviceRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { id: true, name: true, phone: true, email: true } },
        assignedRunner: { select: { id: true, name: true, phone: true } }
      }
    });

    return res.json({ serviceRequests });
  } catch (error) {
    console.error('Error fetching admin service requests:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH /api/admin/service-requests/:id/status
adminRouter.patch('/service-requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const serviceRequest = await prisma.serviceRequest.update({
      where: { id },
      data: { status }
    });

    broadcastOrderStatusChange(serviceRequest.id, serviceRequest.status);
    return res.json({ serviceRequest });
  } catch (error) {
    console.error('Error updating service request status:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/admin/service-requests/:id/assign
adminRouter.post('/service-requests/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { runnerId } = req.body;

    const serviceRequest = await prisma.serviceRequest.update({
      where: { id },
      data: {
        assignedRunnerId: runnerId,
        status: 'ASSIGNED'
      },
      include: {
        assignedRunner: { select: { id: true, name: true, phone: true } }
      }
    });

    broadcastOrderStatusChange(serviceRequest.id, serviceRequest.status);
    return res.json({ serviceRequest });
  } catch (error) {
    console.error('Error assigning runner to service request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/fleet - List all runners/riders
adminRouter.get('/fleet', async (_req, res) => {
  try {
    const runners = await prisma.user.findMany({
      where: { isRunner: true },
      include: {
        riderOrders: {
          select: { id: true, price: true, status: true }
        },
        assignedServiceRequests: {
          select: { id: true, status: true }
        }
      }
    });

    const fleet = runners.map(r => {
      const completedOrders = r.riderOrders.filter(o => o.status === 'DELIVERED').length;
      const completedRequests = r.assignedServiceRequests.filter(s => s.status === 'COMPLETED').length;
      const totalCompleted = completedOrders + completedRequests;
      const totalEarnings = r.riderOrders
        .filter(o => o.status === 'DELIVERED')
        .reduce((acc, o) => acc + o.price, 0);

      const isOnline = onlineRunners.has(r.id);
      const activeDelivery = r.riderOrders.find(o => ['RIDER_ASSIGNED', 'PICKING_UP', 'EN_ROUTE'].includes(o.status));

      return {
        id: r.id,
        name: r.name,
        phone: r.phone,
        email: r.email,
        avatar: r.avatar,
        vehicleType: r.runnerVehicleType || 'Bicycle',
        coverageArea: r.runnerCoverageArea || 'Nairobi CBD',
        capabilities: r.runnerCapabilities,
        verified: r.runnerVerified,
        isOnline,
        status: activeDelivery ? 'In Transit' : isOnline ? 'Available' : 'Offline',
        completedJobs: totalCompleted,
        totalEarnings,
        rating: 4.8
      };
    });

    return res.json({ fleet });
  } catch (error) {
    console.error('Error fetching fleet:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH /api/admin/fleet/:runnerId/verify - Toggle verification
adminRouter.patch('/fleet/:runnerId/verify', async (req, res) => {
  try {
    const { runnerId } = req.params;
    const { verified } = req.body;

    const user = await prisma.user.update({
      where: { id: runnerId },
      data: { runnerVerified: Boolean(verified) }
    });

    return res.json({ user });
  } catch (error) {
    console.error('Error updating runner verification:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/customers - List all customer users
adminRouter.get('/customers', async (_req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { isRunner: false },
      include: {
        orders: { select: { id: true, price: true, status: true } },
        serviceRequests: { select: { id: true, status: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const list = customers.map(c => {
      const totalOrders = c.orders.length + c.serviceRequests.length;
      const totalSpent = c.orders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + o.price, 0);

      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        avatar: c.avatar,
        createdAt: c.createdAt,
        totalOrders,
        totalSpent,
        status: 'Active'
      };
    });

    return res.json({ customers: list });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/finance - Financial summary
adminRouter.get('/finance', async (_req, res) => {
  try {
    const deliveredOrders = await prisma.order.findMany({
      where: { status: 'DELIVERED' },
      select: { price: true, date: true }
    });

    const grossRevenue = deliveredOrders.reduce((sum, o) => sum + o.price, 0);
    const riderPayouts = Math.round(grossRevenue * 0.8); // 80% to rider
    const platformCommission = grossRevenue - riderPayouts; // 20% to platform

    return res.json({
      grossRevenue,
      riderPayouts,
      platformCommission,
      totalDeliveredOrders: deliveredOrders.length
    });
  } catch (error) {
    console.error('Error fetching finance stats:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/dispatch - Smart dispatch live coordinates & active orders
adminRouter.get('/dispatch', async (_req, res) => {
  try {
    const activeOrders = await prisma.order.findMany({
      where: { status: { in: ['PENDING', 'RIDER_ASSIGNED', 'PICKING_UP', 'EN_ROUTE'] } },
      include: {
        user: { select: { name: true, phone: true } },
        rider: { select: { id: true, name: true, phone: true } }
      }
    });

    const onlineRiderList = Array.from(onlineRunners.values());

    return res.json({
      activeOrders,
      onlineRiders: onlineRiderList
    });
  } catch (error) {
    console.error('Error fetching dispatch data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
