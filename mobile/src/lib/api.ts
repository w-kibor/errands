import Constants from 'expo-constants';

const configApiBaseUrl =
  typeof Constants.expoConfig?.extra?.apiBaseUrl === 'string'
    ? Constants.expoConfig.extra.apiBaseUrl
    : undefined;

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || configApiBaseUrl || 'http://10.0.2.2:4000';

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
  email: string | null;
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

export type BackendOrderStatus =
  | 'PENDING'
  | 'RIDER_ASSIGNED'
  | 'PICKING_UP'
  | 'EN_ROUTE'
  | 'DELIVERED'
  | 'CANCELLED';
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

export function mapBackendUrgency(type: BackendUrgencyType) {
  return type === 'EXPRESS' ? 'Express' : 'Normal';
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
