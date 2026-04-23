import React, { useState, createContext, useContext } from 'react';
import {
  User,
  Order,
  DraftOrder,
  ServiceRequest,
  ServiceDefinition,
  RunnerProfile,
  SavedAddress,
  SavedPaymentMethod,
  PaymentMethodType
} from '../types';
import { mockOrders } from '../data/mockData';
import { serviceDefinitions } from '../data/services';
interface AppContextType {
  user: User | null;
  login: (phone: string, name?: string) => void;
  updateUserProfile: (data: { name: string; phone: string; avatar?: string; }) => void;
  logout: () => void;
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
export const AppProvider = ({ children }: {children: ReactNode;}) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [draftOrder, setDraftOrder] = useState<DraftOrder | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: 'addr-1',
      label: 'Home',
      address: 'Kilimani, Nairobi',
      isPrimary: true
    }
  ]);
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([
    {
      id: 'pm-1',
      type: 'M-Pesa',
      label: 'Personal M-Pesa',
      details: '*** *** 678',
      isDefault: true
    }
  ]);
  const login = (phone: string, name?: string) => {
    setUser({
      id: 'u1',
      name: name || 'Alex Johnson',
      phone,
      isRunner: false,
      avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });
  };
  const updateUserProfile = (data: {
    name: string;
    phone: string;
    avatar?: string;
  }) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        name: data.name,
        phone: data.phone,
        avatar: data.avatar || prev.avatar
      };
    });
  };
  const logout = () => {
    setUser(null);
    setDraftOrder(null);
    setActiveTab('home');
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
  const addAddress = (data: { label: string; address: string; isPrimary?: boolean; }) => {
    setAddresses((prev) => {
      const makePrimary = Boolean(data.isPrimary) || prev.length === 0;
      const nextExisting = makePrimary ? prev.map((item) => ({ ...item, isPrimary: false })) : prev;
      const newAddress: SavedAddress = {
        id: `addr-${Date.now()}`,
        label: data.label,
        address: data.address,
        isPrimary: makePrimary
      };
      return [newAddress, ...nextExisting];
    });
  };
  const updateAddress = (data: {
    id: string;
    label: string;
    address: string;
    isPrimary?: boolean;
  }) => {
    setAddresses((prev) => {
      const next = prev.map((item) => {
        if (item.id !== data.id) {
          return data.isPrimary ? { ...item, isPrimary: false } : item;
        }
        return {
          ...item,
          label: data.label,
          address: data.address,
          isPrimary: Boolean(data.isPrimary)
        };
      });

      if (next.length > 0 && !next.some((item) => item.isPrimary)) {
        return next.map((item, index) => ({ ...item, isPrimary: index === 0 }));
      }
      return next;
    });
  };
  const deleteAddress = (addressId: string) => {
    setAddresses((prev) => {
      const removed = prev.find((item) => item.id === addressId);
      const next = prev.filter((item) => item.id !== addressId);

      if (next.length === 0) return next;
      if (removed?.isPrimary) {
        return next.map((item, index) => ({ ...item, isPrimary: index === 0 }));
      }
      return next;
    });
  };
  const setPrimaryAddress = (addressId: string) => {
    setAddresses((prev) => prev.map((item) => ({ ...item, isPrimary: item.id === addressId })));
  };
  const addPaymentMethod = (data: {
    type: PaymentMethodType;
    label: string;
    details: string;
    isDefault?: boolean;
  }) => {
    setPaymentMethods((prev) => {
      const makeDefault = Boolean(data.isDefault) || prev.length === 0;
      const nextExisting = makeDefault ? prev.map((item) => ({ ...item, isDefault: false })) : prev;
      const newMethod: SavedPaymentMethod = {
        id: `pm-${Date.now()}`,
        type: data.type,
        label: data.label,
        details: data.details,
        isDefault: makeDefault
      };
      return [newMethod, ...nextExisting];
    });
  };
  const setDefaultPaymentMethod = (methodId: string) => {
    setPaymentMethods((prev) => prev.map((item) => ({ ...item, isDefault: item.id === methodId })));
  };
  const deletePaymentMethod = (methodId: string) => {
    setPaymentMethods((prev) => {
      const removed = prev.find((item) => item.id === methodId);
      const next = prev.filter((item) => item.id !== methodId);

      if (next.length === 0) return next;
      if (removed?.isDefault) {
        return next.map((item, index) => ({ ...item, isDefault: index === 0 }));
      }
      return next;
    });
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