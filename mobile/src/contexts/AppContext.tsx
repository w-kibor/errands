import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { mockRider } from '../data/mockData';
import { serviceDefinitions } from '../data/services';
import {
  apiRequest,
  BackendOrder,
  BackendServiceRequest,
  BackendUser,
  mapBackendOrderStatus,
  mapBackendPackageType,
  mapBackendServiceName,
  mapBackendServiceRequestStatus,
  mapBackendUrgency,
  mapPaymentMethodType
} from '../lib/api';
import {
  DraftOrder,
  Order,
  PaymentMethodType,
  RunnerProfile,
  SavedAddress,
  SavedPaymentMethod,
  ServiceDefinition,
  ServiceType,
  ServiceRequest,
  User
} from '../types';

interface AppContextType {
  user: User | null;
  isHydrating: boolean;
  login: (email: string, name?: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  orders: Order[];
  draftOrder: DraftOrder | null;
  setDraftOrder: (draft: DraftOrder | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  services: ServiceDefinition[];
  serviceRequests: ServiceRequest[];
  addresses: SavedAddress[];
  paymentMethods: SavedPaymentMethod[];
  addAddress: (data: { label: string; address: string; isPrimary?: boolean }) => Promise<void>;
  addPaymentMethod: (data: {
    type: PaymentMethodType;
    label: string;
    details: string;
    isDefault?: boolean;
  }) => Promise<void>;
  becomeRunner: (profile: RunnerProfile) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const USER_STORAGE_KEY = 'swiftdrop_user_id';

const mapBackendUser = (backendUser: BackendUser): User => ({
  id: backendUser.id,
  name: backendUser.name,
  email: backendUser.email || undefined,
  phone: backendUser.phone,
  avatar: backendUser.avatar || undefined,
  isRunner: backendUser.isRunner,
  runnerProfile: backendUser.isRunner
    ? {
        vehicleType: backendUser.runnerVehicleType || '',
        coverageArea: backendUser.runnerCoverageArea || '',
        capabilities: backendUser.runnerCapabilities as ServiceType[],
        verified: backendUser.runnerVerified
      }
    : undefined
});

const mapBackendAddress = (address: {
  id: string;
  label: string;
  address: string;
  isPrimary: boolean;
}): SavedAddress => ({
  id: address.id,
  label: address.label,
  address: address.address,
  isPrimary: address.isPrimary
});

const mapBackendPaymentMethod = (method: {
  id: string;
  type: 'MPESA' | 'CARD' | 'CASH_ON_DELIVERY';
  label: string;
  details: string;
  isDefault: boolean;
}): SavedPaymentMethod => ({
  id: method.id,
  type: mapPaymentMethodType(method.type),
  label: method.label,
  details: method.details,
  isDefault: method.isDefault
});

const mapBackendOrder = (order: BackendOrder): Order => ({
  id: order.orderNumber,
  date: order.date,
  pickup: order.pickup,
  dropoff: order.dropoff,
  packageType: mapBackendPackageType(order.packageType),
  urgency: mapBackendUrgency(order.urgency),
  status: mapBackendOrderStatus(order.status),
  price: order.price,
  note: order.note || undefined,
  rider: {
    ...mockRider,
    ...(order.rider || {}),
    id: order.rider?.id || 'demo-rider',
    name: order.rider?.name || mockRider.name,
    phone: order.rider?.phone || mockRider.phone,
    avatar: order.rider?.avatar || mockRider.avatar
  }
});

const mapBackendServiceRequest = (request: BackendServiceRequest): ServiceRequest => ({
  id: request.id,
  serviceId: request.serviceId,
  serviceName: mapBackendServiceName(request.serviceName),
  customerId: request.customerId,
  createdAt: request.createdAt,
  pickup: request.pickup || undefined,
  dropoff: request.dropoff || undefined,
  businessName: request.businessName || undefined,
  instructions: request.instructions,
  urgency: mapBackendUrgency(request.urgency),
  status: mapBackendServiceRequestStatus(request.status)
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [draftOrder, setDraftOrder] = useState<DraftOrder | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [isHydrating, setIsHydrating] = useState(true);

  const hydrateUser = async (userId: string) => {
    const [userResponse, ordersResponse, serviceRequestsResponse] = await Promise.all([
      apiRequest<{ user: BackendUser }>(`/api/users/${userId}`),
      apiRequest<{ orders: BackendOrder[] }>(`/api/users/${userId}/orders`),
      apiRequest<{ serviceRequests: BackendServiceRequest[] }>(`/api/users/${userId}/service-requests`)
    ]);

    setUser(mapBackendUser(userResponse.user));
    setAddresses((userResponse.user.addresses || []).map(mapBackendAddress));
    setPaymentMethods((userResponse.user.paymentMethods || []).map(mapBackendPaymentMethod));
    setOrders(ordersResponse.orders.map(mapBackendOrder));
    setServiceRequests(serviceRequestsResponse.serviceRequests.map(mapBackendServiceRequest));
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (!storedUserId) {
          const devUser = process.env.EXPO_PUBLIC_DEV_AUTH_USER;
          if (devUser) {
            await AsyncStorage.setItem(USER_STORAGE_KEY, devUser);
            await hydrateUser(devUser);
          }
          return;
        }

        await hydrateUser(storedUserId);
      } catch {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      } finally {
        setIsHydrating(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (email: string, name?: string, phone?: string) => {
    const endpoint = name ? '/api/auth/register' : '/api/auth/login';
    const payload = name ? { email, name, phone } : { email };

    const response = await apiRequest<{ user: BackendUser }>(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    await AsyncStorage.setItem(USER_STORAGE_KEY, response.user.id);
    await hydrateUser(response.user.id);
  };

  const logout = async () => {
    setUser(null);
    setDraftOrder(null);
    setOrders([]);
    setAddresses([]);
    setPaymentMethods([]);
    setServiceRequests([]);
    setActiveTab('home');
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  };

  const addAddress = async (data: { label: string; address: string; isPrimary?: boolean }) => {
    if (!user) return;

    await apiRequest(`/api/users/${user.id}/addresses`, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    await hydrateUser(user.id);
  };

  const addPaymentMethod = async (data: {
    type: PaymentMethodType;
    label: string;
    details: string;
    isDefault?: boolean;
  }) => {
    if (!user) return;

    const type = data.type === 'M-Pesa' ? 'MPESA' : data.type === 'Card' ? 'CARD' : 'CASH_ON_DELIVERY';

    await apiRequest(`/api/users/${user.id}/payment-methods`, {
      method: 'POST',
      body: JSON.stringify({ ...data, type })
    });

    await hydrateUser(user.id);
  };

  const becomeRunner = (profile: RunnerProfile) => {
    setUser((previous) => {
      if (!previous) return previous;
      return {
        ...previous,
        isRunner: true,
        runnerProfile: profile
      };
    });
  };

  const value = useMemo(
    () => ({
      user,
      isHydrating,
      login,
      logout,
      orders,
      draftOrder,
      setDraftOrder,
      activeTab,
      setActiveTab,
      services: serviceDefinitions,
      serviceRequests,
      addresses,
      paymentMethods,
      addAddress,
      addPaymentMethod,
      becomeRunner
    }),
    [
      user,
      isHydrating,
      orders,
      draftOrder,
      activeTab,
      serviceRequests,
      addresses,
      paymentMethods
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
