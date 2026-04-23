import React, { useState, createContext, useContext } from 'react';
import { User, Order, DraftOrder } from '../types';
import { mockOrders } from '../data/mockData';
interface AppContextType {
  user: User | null;
  login: (phone: string) => void;
  logout: () => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  draftOrder: DraftOrder | null;
  setDraftOrder: (draft: DraftOrder | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
const AppContext = createContext<AppContextType | undefined>(undefined);
export const AppProvider = ({ children }: {children: ReactNode;}) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [draftOrder, setDraftOrder] = useState<DraftOrder | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const login = (phone: string) => {
    setUser({
      id: 'u1',
      name: 'Alex Johnson',
      phone,
      avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
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
  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        orders,
        addOrder,
        updateOrderStatus,
        draftOrder,
        setDraftOrder,
        activeTab,
        setActiveTab
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