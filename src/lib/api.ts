const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
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

export type BackendAddress = {
  id: string;
  label: string;
  address: string;
  isPrimary: boolean;
};

export type BackendPaymentMethod = {
  id: string;
  type: 'MPESA' | 'CARD' | 'CASH_ON_DELIVERY';
  label: string;
  details: string;
  isDefault: boolean;
};

export type BackendUser = {
  id: string;
  name: string;
  phone: string;
  avatar: string | null;
  isRunner: boolean;
  runnerVehicleType: string | null;
  runnerCoverageArea: string | null;
  runnerCapabilities: string[];
  runnerVerified: boolean;
  addresses?: BackendAddress[];
  paymentMethods?: BackendPaymentMethod[];
};

export type BackendOrderStatus = 'PENDING' | 'RIDER_ASSIGNED' | 'PICKING_UP' | 'EN_ROUTE' | 'DELIVERED' | 'CANCELLED';
export type BackendPackageType = 'DOCUMENT' | 'SMALL_BOX' | 'MEDIUM_BOX' | 'LARGE_BOX' | 'FRAGILE';
export type BackendUrgencyType = 'NORMAL' | 'EXPRESS';

export type BackendOrder = {
  id: string;
  orderNumber: string;
  date: string;
  pickup: { address: string; lat?: number; lng?: number };
  dropoff: { address: string; lat?: number; lng?: number };
  packageType: BackendPackageType;
  urgency: BackendUrgencyType;
  status: BackendOrderStatus;
  price: number;
  note?: string | null;
  rider?: {
    id: string;
    name: string;
    phone: string;
    avatar?: string | null;
    rating?: number;
    vehicle?: string;
    lat?: number;
    lng?: number;
  } | null;
};

export type BackendServiceRequestStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type BackendServiceName =
  | 'CBD_BATCH_DELIVERY'
  | 'PERSONAL_SHOPPING'
  | 'PARCEL_PICKUP_AND_DROP_OFF'
  | 'SHOP_LEGITIMACY_VERIFICATION'
  | 'CUSTOM_TASK_REQUESTS'
  | 'DEDICATED_BUSINESS_ERRANDS_SUPPORT';

export type BackendServiceRequest = {
  id: string;
  serviceId: string;
  serviceName: BackendServiceName;
  customerId: string;
  createdAt: string;
  pickup?: { address: string; lat?: number; lng?: number } | null;
  dropoff?: { address: string; lat?: number; lng?: number } | null;
  businessName?: string | null;
  instructions: string;
  urgency: BackendUrgencyType;
  status: BackendServiceRequestStatus;
};

export type BackendMessage = {
  id: string;
  orderId: string;
  userId: string;
  senderId: string;
  text: string;
  isRider: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BackendNotificationPreference = {
  id: string;
  userId: string;
  key: string;
  enabled: boolean;
};

export function mapPaymentMethodType(type: BackendPaymentMethod['type']) {
  switch (type) {
    case 'MPESA':
      return 'M-Pesa';
    case 'CARD':
      return 'Card';
    case 'CASH_ON_DELIVERY':
      return 'Cash on Delivery';
  }
}

export function toBackendPaymentMethodType(type: 'M-Pesa' | 'Card' | 'Cash on Delivery') {
  switch (type) {
    case 'M-Pesa':
      return 'MPESA';
    case 'Card':
      return 'CARD';
    case 'Cash on Delivery':
      return 'CASH_ON_DELIVERY';
  }
}

export function mapBackendOrderStatus(status: BackendOrderStatus) {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'RIDER_ASSIGNED':
      return 'Rider Assigned';
    case 'PICKING_UP':
      return 'Picking Up';
    case 'EN_ROUTE':
      return 'En Route';
    case 'DELIVERED':
      return 'Delivered';
    case 'CANCELLED':
      return 'Cancelled';
  }
}

export function toBackendOrderStatus(status: 'Pending' | 'Rider Assigned' | 'Picking Up' | 'En Route' | 'Delivered' | 'Cancelled') {
  switch (status) {
    case 'Pending':
      return 'PENDING';
    case 'Rider Assigned':
      return 'RIDER_ASSIGNED';
    case 'Picking Up':
      return 'PICKING_UP';
    case 'En Route':
      return 'EN_ROUTE';
    case 'Delivered':
      return 'DELIVERED';
    case 'Cancelled':
      return 'CANCELLED';
  }
}

export function mapBackendPackageType(type: BackendPackageType) {
  switch (type) {
    case 'DOCUMENT':
      return 'Document';
    case 'SMALL_BOX':
      return 'Small Box';
    case 'MEDIUM_BOX':
      return 'Medium Box';
    case 'LARGE_BOX':
      return 'Large Box';
    case 'FRAGILE':
      return 'Fragile';
  }
}

export function toBackendPackageType(type: 'Document' | 'Small Box' | 'Medium Box' | 'Large Box' | 'Fragile') {
  switch (type) {
    case 'Document':
      return 'DOCUMENT';
    case 'Small Box':
      return 'SMALL_BOX';
    case 'Medium Box':
      return 'MEDIUM_BOX';
    case 'Large Box':
      return 'LARGE_BOX';
    case 'Fragile':
      return 'FRAGILE';
  }
}

export function mapBackendUrgency(type: BackendUrgencyType) {
  return type === 'EXPRESS' ? 'Express' : 'Normal';
}

export function toBackendUrgency(type: 'Normal' | 'Express') {
  return type === 'Express' ? 'EXPRESS' : 'NORMAL';
}

export function mapBackendServiceRequestStatus(status: BackendServiceRequestStatus) {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'ASSIGNED':
      return 'Assigned';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'COMPLETED':
      return 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
  }
}

export function mapBackendServiceName(name: BackendServiceName) {
  switch (name) {
    case 'CBD_BATCH_DELIVERY':
      return 'CBD Batch Delivery';
    case 'PERSONAL_SHOPPING':
      return 'Personal Shopping';
    case 'PARCEL_PICKUP_AND_DROP_OFF':
      return 'Parcel Pickup and Drop Off';
    case 'SHOP_LEGITIMACY_VERIFICATION':
      return 'Shop Legitimacy Verification';
    case 'CUSTOM_TASK_REQUESTS':
      return 'Custom Task Requests';
    case 'DEDICATED_BUSINESS_ERRANDS_SUPPORT':
      return 'Dedicated Business Errands Support';
  }
}

export function toBackendServiceName(name: 'CBD Batch Delivery' | 'Personal Shopping' | 'Parcel Pickup and Drop Off' | 'Shop Legitimacy Verification' | 'Custom Task Requests' | 'Dedicated Business Errands Support') {
  switch (name) {
    case 'CBD Batch Delivery':
      return 'CBD_BATCH_DELIVERY';
    case 'Personal Shopping':
      return 'PERSONAL_SHOPPING';
    case 'Parcel Pickup and Drop Off':
      return 'PARCEL_PICKUP_AND_DROP_OFF';
    case 'Shop Legitimacy Verification':
      return 'SHOP_LEGITIMACY_VERIFICATION';
    case 'Custom Task Requests':
      return 'CUSTOM_TASK_REQUESTS';
    case 'Dedicated Business Errands Support':
      return 'DEDICATED_BUSINESS_ERRANDS_SUPPORT';
  }
}

export const notificationPreferenceSeeds = [
  {
    key: 'order-updates',
    title: 'Order Updates',
    description: 'Status changes, rider assignment, and delivery progress.',
    enabled: true
  },
  {
    key: 'promotions',
    title: 'Promotions',
    description: 'Discounts, campaigns, and limited-time offers.',
    enabled: true
  },
  {
    key: 'messages',
    title: 'Messages',
    description: 'Chat and support message alerts.',
    enabled: true
  }
] as const;
