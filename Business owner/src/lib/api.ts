const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error || 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

export type OverviewStats = {
  totalRevenue: number;
  thisWeekRevenue: number;
  thisMonthRevenue: number;
  ordersToday: number;
  completedToday: number;
  cancelledToday: number;
  activeDeliveries: number;
  pendingDispatches: number;
  activeFleetCount: number;
  ridersCount: number;
  runnersCount: number;
  recentActivity: Array<{
    id: string;
    text: string;
    time: string;
    type: 'success' | 'info' | 'warning' | 'error';
  }>;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  date: string;
  pickup: { address: string; lat?: number; lng?: number };
  dropoff: { address: string; lat?: number; lng?: number };
  packageType: string;
  urgency: string;
  status: string;
  price: number;
  note?: string;
  user: { id: string; name: string; phone: string; email?: string };
  rider?: { id: string; name: string; phone: string; runnerVehicleType?: string } | null;
};

export type AdminServiceRequest = {
  id: string;
  serviceId: string;
  serviceName: string;
  createdAt: string;
  pickup?: { address: string } | null;
  dropoff?: { address: string } | null;
  businessName?: string | null;
  instructions: string;
  urgency: string;
  status: string;
  customer: { id: string; name: string; phone: string; email?: string };
  assignedRunner?: { id: string; name: string; phone: string } | null;
};

export type FleetMember = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  vehicleType: string;
  coverageArea: string;
  capabilities: string[];
  verified: boolean;
  isOnline: boolean;
  status: string;
  completedJobs: number;
  totalEarnings: number;
  rating: number;
};

export type CustomerMember = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
};

export type FinanceStats = {
  grossRevenue: number;
  riderPayouts: number;
  platformCommission: number;
  totalDeliveredOrders: number;
};

export async function fetchOverviewStats(): Promise<OverviewStats> {
  return apiRequest<OverviewStats>('/api/admin/overview');
}

export async function fetchAdminOrders(search = '', status = 'ALL'): Promise<{ orders: AdminOrder[] }> {
  const query = new URLSearchParams();
  if (search) query.append('search', search);
  if (status && status !== 'ALL') query.append('status', status);
  return apiRequest<{ orders: AdminOrder[] }>(`/api/admin/orders?${query.toString()}`);
}

export async function updateOrderStatus(orderId: string, status: string): Promise<{ order: AdminOrder }> {
  return apiRequest<{ order: AdminOrder }>(`/api/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function assignRiderToOrder(orderId: string, riderId: string): Promise<{ order: AdminOrder }> {
  return apiRequest<{ order: AdminOrder }>(`/api/admin/orders/${orderId}/assign`, {
    method: 'POST',
    body: JSON.stringify({ riderId })
  });
}

export async function fetchAdminServiceRequests(): Promise<{ serviceRequests: AdminServiceRequest[] }> {
  return apiRequest<{ serviceRequests: AdminServiceRequest[] }>('/api/admin/service-requests');
}

export async function updateServiceRequestStatus(id: string, status: string): Promise<{ serviceRequest: AdminServiceRequest }> {
  return apiRequest<{ serviceRequest: AdminServiceRequest }>(`/api/admin/service-requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function assignRunnerToServiceRequest(id: string, runnerId: string): Promise<{ serviceRequest: AdminServiceRequest }> {
  return apiRequest<{ serviceRequest: AdminServiceRequest }>(`/api/admin/service-requests/${id}/assign`, {
    method: 'POST',
    body: JSON.stringify({ runnerId })
  });
}

export async function fetchAdminFleet(): Promise<{ fleet: FleetMember[] }> {
  return apiRequest<{ fleet: FleetMember[] }>('/api/admin/fleet');
}

export async function toggleRunnerVerification(runnerId: string, verified: boolean): Promise<{ user: any }> {
  return apiRequest<{ user: any }>(`/api/admin/fleet/${runnerId}/verify`, {
    method: 'PATCH',
    body: JSON.stringify({ verified })
  });
}

export async function fetchAdminCustomers(): Promise<{ customers: CustomerMember[] }> {
  return apiRequest<{ customers: CustomerMember[] }>('/api/admin/customers');
}

export async function fetchAdminFinance(): Promise<FinanceStats> {
  return apiRequest<FinanceStats>('/api/admin/finance');
}

export async function fetchAdminDispatch(): Promise<{ activeOrders: AdminOrder[]; onlineRiders: any[] }> {
  return apiRequest<{ activeOrders: AdminOrder[]; onlineRiders: any[] }>('/api/admin/dispatch');
}
