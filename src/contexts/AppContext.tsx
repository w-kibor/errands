import React, { useEffect, useState, createContext, useContext } from 'react';
import {
  User,
  Order,
  DraftOrder,
  ServiceRequest,
  ServiceDefinition,
  ServiceType,
  RunnerProfile,
  SavedAddress,
  SavedPaymentMethod,
  PaymentMethodType
} from '../types';
import { mockOrders } from '../data/mockData';
import { serviceDefinitions } from '../data/services';
import {
  apiRequest,
  BackendUser,
  mapPaymentMethodType,
  toBackendPaymentMethodType
} from '../lib/api';
interface AppContextType {
  user: User | null;
  login: (phone: string, name?: string) => Promise<void>;
  updateUserProfile: (data: { name: string; phone: string; avatar?: string; }) => Promise<void>;
  logout: () => Promise<void>;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  draftOrder: DraftOrder | null;
  setDraftOrder: (draft: DraftOrder | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  services: ServiceDefinition[];
  serviceRequests: ServiceRequest[];
  addresses: SavedAddress[];
  paymentMethods: SavedPaymentMethod[];
  addServiceRequest: (request: ServiceRequest) => void;
  becomeRunner: (profile: RunnerProfile) => void;
  addAddress: (data: { label: string; address: string; isPrimary?: boolean; }) => void;
  updateAddress: (data: { id: string; label: string; address: string; isPrimary?: boolean; }) => void;
  deleteAddress: (addressId: string) => void;
  setPrimaryAddress: (addressId: string) => void;
  addPaymentMethod: (data: { type: PaymentMethodType; label: string; details: string; isDefault?: boolean; }) => void;
  setDefaultPaymentMethod: (methodId: string) => void;
  deletePaymentMethod: (methodId: string) => void;
}
const AppContext = createContext<AppContextType | undefined>(undefined);
const USER_STORAGE_KEY = 'swiftdrop_user_id';

const mapBackendUser = (backendUser: BackendUser): User => ({
  id: backendUser.id,
  name: backendUser.name,
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

const mapBackendAddress = (address: { id: string; label: string; address: string; isPrimary: boolean; }): SavedAddress => ({
  id: address.id,
  label: address.label,
  address: address.address,
  isPrimary: address.isPrimary
});

const mapBackendPaymentMethod = (method: { id: string; type: 'MPESA' | 'CARD' | 'CASH_ON_DELIVERY'; label: string; details: string; isDefault: boolean; }): SavedPaymentMethod => ({
  id: method.id,
  type: mapPaymentMethodType(method.type),
  label: method.label,
  details: method.details,
  isDefault: method.isDefault
});

export const AppProvider = ({ children }: {children: ReactNode;}) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [draftOrder, setDraftOrder] = useState<DraftOrder | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([]);

  const hydrateUser = async (userId: string) => {
    const response = await apiRequest<{ user: BackendUser }>(`/api/users/${userId}`);
    setUser(mapBackendUser(response.user));
    setAddresses((response.user.addresses || []).map(mapBackendAddress));
    setPaymentMethods((response.user.paymentMethods || []).map(mapBackendPaymentMethod));
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem(USER_STORAGE_KEY);
    if (!storedUserId) return;

    hydrateUser(storedUserId).catch(() => {
      localStorage.removeItem(USER_STORAGE_KEY);
    });
  }, []);

  const login = async (phone: string, name?: string) => {
    const endpoint = name ? '/api/auth/register' : '/api/auth/login';
    const payload = name ? { phone, name } : { phone };
    const response = await apiRequest<{ user: BackendUser }>(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    localStorage.setItem(USER_STORAGE_KEY, response.user.id);
    await hydrateUser(response.user.id);
  };
  const updateUserProfile = async (data: {
    name: string;
    phone: string;
    avatar?: string;
  }) => {
    if (!user) return;

    const response = await apiRequest<{ user: BackendUser }>(`/api/users/${user.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });

    setUser(mapBackendUser(response.user));
  };
  const logout = async () => {
    setUser(null);
    setDraftOrder(null);
    setActiveTab('home');
    setAddresses([]);
    setPaymentMethods([]);
    localStorage.removeItem(USER_STORAGE_KEY);
  };
  const addOrder = (order: Order) => {
    setOrders([order, ...orders]);
  };
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(
      orders.map((o) =>
      o.id === orderId ?
      {
        ...o,
        status
      } :
      o
      )
    );
  };
  const addServiceRequest = (request: ServiceRequest) => {
    setServiceRequests((prev) => [request, ...prev]);
  };
  const addAddress = async (data: { label: string; address: string; isPrimary?: boolean; }) => {
    if (!user) return;

    const response = await apiRequest<{ address: { id: string; label: string; address: string; isPrimary: boolean; } }>(
      `/api/users/${user.id}/addresses`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    );

    setAddresses((prev) => {
      const next = response.address.isPrimary
        ? prev.map((item) => ({ ...item, isPrimary: false }))
        : prev;
      return [mapBackendAddress(response.address), ...next.filter((item) => item.id !== response.address.id)];
    });
    await hydrateUser(user.id);
  };
  const updateAddress = async (data: {
    id: string;
    label: string;
    address: string;
    isPrimary?: boolean;
  }) => {
    if (!user) return;

    await apiRequest(`/api/users/${user.id}/addresses/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    await hydrateUser(user.id);
  };
  const deleteAddress = async (addressId: string) => {
    if (!user) return;

    await apiRequest(`/api/users/${user.id}/addresses/${addressId}`, {
      method: 'DELETE'
    });
    await hydrateUser(user.id);
  };
  const setPrimaryAddress = async (addressId: string) => {
    if (!user) return;

    await apiRequest(`/api/users/${user.id}/addresses/${addressId}/primary`, {
      method: 'PATCH'
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

    const response = await apiRequest<{ paymentMethod: { id: string; type: 'MPESA' | 'CARD' | 'CASH_ON_DELIVERY'; label: string; details: string; isDefault: boolean; } }>(
      `/api/users/${user.id}/payment-methods`,
      {
        method: 'POST',
        body: JSON.stringify({
          type: toBackendPaymentMethodType(data.type),
          label: data.label,
          details: data.details,
          isDefault: data.isDefault
        })
      }
    );

    setPaymentMethods((prev) => {
      const mapped = mapBackendPaymentMethod(response.paymentMethod);
      if (mapped.isDefault) {
        return [mapped, ...prev.map((item) => ({ ...item, isDefault: false }))];
      }
      return [mapped, ...prev.filter((item) => item.id !== mapped.id)];
    });
    await hydrateUser(user.id);
  };
  const setDefaultPaymentMethod = async (methodId: string) => {
    if (!user) return;

    await apiRequest(`/api/users/${user.id}/payment-methods/${methodId}/default`, {
      method: 'PATCH'
    });
    await hydrateUser(user.id);
  };
  const deletePaymentMethod = async (methodId: string) => {
    if (!user) return;

    await apiRequest(`/api/users/${user.id}/payment-methods/${methodId}`, {
      method: 'DELETE'
    });
    await hydrateUser(user.id);
  };
  const becomeRunner = (profile: RunnerProfile) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isRunner: true,
        runnerProfile: profile
      };
    });
  };
  return (
    <AppContext.Provider
      value={{
        user,
        login,
        updateUserProfile,
        logout,
        orders,
        addOrder,
        updateOrderStatus,
        draftOrder,
        setDraftOrder,
        activeTab,
        setActiveTab,
        services: serviceDefinitions,
        serviceRequests,
        addresses,
        paymentMethods,
        addServiceRequest,
        becomeRunner,
        addAddress,
        updateAddress,
        deleteAddress,
        setPrimaryAddress,
        addPaymentMethod,
        setDefaultPaymentMethod,
        deletePaymentMethod
      }}>
      
      {children}
    </AppContext.Provider>);

};
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};