import React from 'react';
import { Home, FileText, MessageCircle, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveTab } = useAppContext();
  const navItems = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    path: '/home'
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: FileText,
    path: '/orders'
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: MessageCircle,
    path: '/chat'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/profile'
  }];

  const handleNav = (id: string, path: string) => {
    setActiveTab(id);
    navigate(path);
  };
  // Don't show on certain screens
  const hiddenPaths = [
  '/',
  '/login',
  '/otp',
  '/create-delivery',
  '/estimate',
  '/tracking',
  '/rating',
  '/shop-errands',
  '/services',
  '/create-request',
  '/runner-signup',
  '/edit-profile',
  '/addresses',
  '/payment-methods'];

  if (hiddenPaths.includes(location.pathname)) return null;
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 pb-safe shadow-up z-40">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id, item.path)}
              className={`flex flex-col items-center space-y-1 w-16 transition-colors ${isActive ? 'text-brand-dark' : 'text-gray-400 hover:text-gray-600'}`}>
              
              <div
                className={`p-1.5 rounded-full ${isActive ? 'bg-brand/10' : ''}`}>
                
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={`text-[10px] font-medium ${isActive ? 'text-brand-dark' : 'text-gray-500'}`}>
                
                {item.label}
              </span>
            </button>);

        })}
      </div>
    </div>);

};