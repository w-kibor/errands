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
