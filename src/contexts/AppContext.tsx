import { useEffect, useState, createContext, useContext, type ReactNode } from 'react';
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
  PaymentMethodType,
  BusinessProfile,
  BusinessRole,
  TeamMember,
  Branch,
  CorporateWallet,
  CostCenter
} from '../types';
import { mockRider } from '../data/mockData';
import { serviceDefinitions } from '../data/services';
import {
  apiRequest,
  BackendUser,
  BackendOrder,
  BackendServiceRequest,
  mapPaymentMethodType,
  mapBackendOrderStatus,
  mapBackendPackageType,
  mapBackendServiceName,
  mapBackendServiceRequestStatus,
  mapBackendUrgency,
  toBackendPaymentMethodType,
  toBackendOrderStatus,
  toBackendPackageType,
  toBackendServiceName,
  toBackendUrgency
} from '../lib/api';

interface AppContextType {
  user: User | null;
  isHydrating: boolean;
  login: (email: string, name?: string, phone?: string) => Promise<void>;
  updateUserProfile: (data: { name: string; email?: string; phone: string; avatar?: string; }) => Promise<void>;
  logout: () => Promise<void>;
  orders: Order[];
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  draftOrder: DraftOrder | null;
  setDraftOrder: (draft: DraftOrder | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  services: ServiceDefinition[];
  serviceRequests: ServiceRequest[];
  addresses: SavedAddress[];
  paymentMethods: SavedPaymentMethod[];
  
  // Corporate Business B2B State & Actions
  userBusinesses: BusinessProfile[];
  currentBusiness: BusinessProfile | null;
  currentMemberRole: BusinessRole | null;
  createBusinessProfile: (data: { name: string; email: string; phone: string; taxId?: string; website?: string; }) => Promise<BusinessProfile>;
  selectBusiness: (businessId: string) => void;
  refreshBusiness: (businessId?: string) => Promise<void>;
  topupCorporateWallet: (amount: number, paymentMethod?: string) => Promise<void>;
  inviteTeamMember: (data: { email: string; phone: string; name: string; role?: BusinessRole; branchId?: string; title?: string; }) => Promise<void>;
  createCostCenter: (code: string, name: string, description?: string) => Promise<void>;
  createBranch: (data: { name: string; address: string; city?: string; phone?: string; }) => Promise<void>;

  addServiceRequest: (request: ServiceRequest) => Promise<void>;
  becomeRunner: (profile: RunnerProfile) => Promise<void>;
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
const ACTIVE_BUSINESS_STORAGE_KEY = 'swiftdrop_active_business_id';

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

export const AppProvider = ({ children }: { children: ReactNode; }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [draftOrder, setDraftOrder] = useState<DraftOrder | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([]);

  // Corporate B2B State
  const [userBusinesses, setUserBusinesses] = useState<BusinessProfile[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<BusinessProfile | null>(null);
  const [currentMemberRole, setCurrentMemberRole] = useState<BusinessRole | null>(null);

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

    // Hydrate User Corporate Businesses
    try {
      const bizRes = await apiRequest<{ memberships: any[] }>(`/api/business/user-businesses/${userId}`);
      if (bizRes.memberships && bizRes.memberships.length > 0) {
        const mappedList: BusinessProfile[] = bizRes.memberships.map((m) => ({
          ...m.business,
          createdAt: m.business.createdAt
        }));
        setUserBusinesses(mappedList);

        const storedBizId = localStorage.getItem(ACTIVE_BUSINESS_STORAGE_KEY);
        const match = mappedList.find((b) => b.id === storedBizId) || mappedList[0];
        setCurrentBusiness(match);

        const activeMembership = bizRes.memberships.find((m) => m.business.id === match.id);
        if (activeMembership) {
          setCurrentMemberRole(activeMembership.role);
        }
      }
    } catch (err) {
      console.warn('Failed to hydrate corporate business profiles:', err);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedUserId = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUserId) {
          await hydrateUser(storedUserId);
          return;
        }

        const isLocalhost = typeof window !== 'undefined' && (
          window.location.hostname === 'localhost' || 
          window.location.hostname === '127.0.0.1'
        );

        if (isLocalhost) {
          const devUser = import.meta.env.VITE_DEV_AUTH_USER || 'chem';
          try {
            await hydrateUser(devUser);
            localStorage.setItem(USER_STORAGE_KEY, devUser);
          } catch {
            setUser({
              id: 'demo-local-dev',
              name: 'Local Developer',
              email: 'dev@localhost.com',
              phone: '+254700000000',
              isRunner: false
            });
          }
        }
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      } finally {
        setIsHydrating(false);
      }
    };

    void bootstrap();
  }, []);

  const login = async (email: string, name?: string, phone?: string) => {
    setIsHydrating(true);

    const endpoint = name ? '/api/auth/register' : '/api/auth/login';
    const payload = name
      ? { email, name, phone }
      : { email };

    const response = await apiRequest<{ user: BackendUser }>(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    localStorage.setItem(USER_STORAGE_KEY, response.user.id);
    try {
      await hydrateUser(response.user.id);
    } finally {
      setIsHydrating(false);
    }
  };

  const createBusinessProfile = async (data: { name: string; email: string; phone: string; taxId?: string; website?: string; }) => {
    if (!user) throw new Error('Must be logged in to create a business profile');

    const res = await apiRequest<{ business: BusinessProfile }>(`/api/business`, {
      method: 'POST',
      body: JSON.stringify({ ...data, userId: user.id })
    });

    await refreshBusiness(res.business.id);
    return res.business;
  };

  const selectBusiness = (businessId: string) => {
    const match = userBusinesses.find((b) => b.id === businessId);
    if (match) {
      setCurrentBusiness(match);
      localStorage.setItem(ACTIVE_BUSINESS_STORAGE_KEY, businessId);
    }
  };

  const refreshBusiness = async (businessId?: string) => {
    if (!user) return;
    const targetId = businessId || currentBusiness?.id;
    if (!targetId) return;

    try {
      const res = await apiRequest<{ business: BusinessProfile; currentMember: TeamMember }>(
        `/api/business/${targetId}`,
        {
          headers: {
            'x-user-id': user.id
          }
        }
      );

      setCurrentBusiness(res.business);
      setCurrentMemberRole(res.currentMember.role);
    } catch (err) {
      console.warn('Failed to refresh business profile:', err);
    }
  };

  const topupCorporateWallet = async (amount: number, paymentMethod: string = 'MPESA') => {
    if (!user || !currentBusiness) return;

    await apiRequest(`/api/business/${currentBusiness.id}/wallet/topup`, {
      method: 'POST',
      headers: {
        'x-user-id': user.id
      },
      body: JSON.stringify({ amount, paymentMethod })
    });

    await refreshBusiness(currentBusiness.id);
  };

  const inviteTeamMember = async (data: { email: string; phone: string; name: string; role?: BusinessRole; branchId?: string; title?: string; }) => {
    if (!user || !currentBusiness) return;

    await apiRequest(`/api/business/${currentBusiness.id}/members/invite`, {
      method: 'POST',
      headers: {
        'x-user-id': user.id
      },
      body: JSON.stringify(data)
    });

    await refreshBusiness(currentBusiness.id);
  };

  const createCostCenter = async (code: string, name: string, description?: string) => {
    if (!user || !currentBusiness) return;

    await apiRequest(`/api/business/${currentBusiness.id}/cost-centers`, {
      method: 'POST',
      headers: {
        'x-user-id': user.id
      },
      body: JSON.stringify({ code, name, description })
    });

    await refreshBusiness(currentBusiness.id);
  };

  const createBranch = async (data: { name: string; address: string; city?: string; phone?: string; }) => {
    if (!user || !currentBusiness) return;

    await apiRequest(`/api/business/${currentBusiness.id}/branches`, {
      method: 'POST',
      headers: {
        'x-user-id': user.id
      },
      body: JSON.stringify(data)
    });

    await refreshBusiness(currentBusiness.id);
  };

  const updateUserProfile = async (data: { name: string; phone: string; avatar?: string; }) => {
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
    setUserBusinesses([]);
    setCurrentBusiness(null);
    setCurrentMemberRole(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_BUSINESS_STORAGE_KEY);
    sessionStorage.removeItem('swiftdrop_magic_link_verified');
    setIsHydrating(false);
  };

  const addOrder = async (order: Order) => {
    if (!user) {
      setOrders((prev) => [order, ...prev]);
      return;
    }

    const response = await apiRequest<{ order: BackendOrder }>(`/api/users/${user.id}/orders`, {
      method: 'POST',
      body: JSON.stringify({
        pickup: order.pickup,
        dropoff: order.dropoff,
        packageType: toBackendPackageType(order.packageType),
        urgency: toBackendUrgency(order.urgency),
        price: order.price,
        note: order.note,
        riderId: order.rider?.id && order.rider.id !== 'demo-rider' ? order.rider.id : undefined,
        businessId: currentBusiness?.id
      })
    });

    setOrders((prev) => [mapBackendOrder(response.order), ...prev.filter((item) => item.id !== response.order.orderNumber)]);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!user) {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
      return;
    }

    const response = await apiRequest<{ order: BackendOrder }>(`/api/users/${user.id}/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: toBackendOrderStatus(status) })
    });
    const mappedOrder = mapBackendOrder(response.order);
    setOrders((prev) => prev.map((item) => item.id === mappedOrder.id ? mappedOrder : item));
  };

  const addServiceRequest = async (request: ServiceRequest) => {
    if (!user) {
      setServiceRequests((prev) => [request, ...prev]);
      return;
    }

    const response = await apiRequest<{ serviceRequest: BackendServiceRequest }>(`/api/users/${user.id}/service-requests`, {
      method: 'POST',
      body: JSON.stringify({
        serviceId: request.serviceId,
        serviceName: toBackendServiceName(request.serviceName),
        pickup: request.pickup,
        dropoff: request.dropoff,
        businessName: request.businessName,
        instructions: request.instructions,
        urgency: toBackendUrgency(request.urgency)
      })
    });

    setServiceRequests((prev) => [mapBackendServiceRequest(response.serviceRequest), ...prev.filter((item) => item.id !== response.serviceRequest.id)]);
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

  const updateAddress = async (data: { id: string; label: string; address: string; isPrimary?: boolean; }) => {
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

  const addPaymentMethod = async (data: { type: PaymentMethodType; label: string; details: string; isDefault?: boolean; }) => {
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

  const becomeRunner = async (profile: RunnerProfile) => {
    if (!user) return;

    const response = await apiRequest<{ user: BackendUser }>(`/api/users/${user.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        isRunner: true,
        runnerVehicleType: profile.vehicleType,
        runnerCoverageArea: profile.coverageArea,
        runnerCapabilities: profile.capabilities,
        runnerVerified: profile.verified
      })
    });

    setUser(mapBackendUser(response.user));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isHydrating,
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
        userBusinesses,
        currentBusiness,
        currentMemberRole,
        createBusinessProfile,
        selectBusiness,
        refreshBusiness,
        topupCorporateWallet,
        inviteTeamMember,
        createCostCenter,
        createBranch,
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
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};