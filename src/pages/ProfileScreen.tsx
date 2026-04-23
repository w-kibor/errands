import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Edit2 } from
'lucide-react';
import { useAppContext } from '../contexts/AppContext';
export const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user, logout } = useAppContext();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const menuItems = [
  {
    icon: MapPin,
    label: 'My Addresses',
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    icon: CreditCard,
    label: 'Payment Methods',
    color: 'text-green-500',
    bg: 'bg-green-50'
  },
  {
    icon: Bell,
    label: 'Notifications',
    color: 'text-purple-500',
    bg: 'bg-purple-50'
  },
  {
    icon: HelpCircle,
    label: 'Help & Support',
    color: 'text-orange-500',
    bg: 'bg-orange-50'
  },
  {
    icon: Info,
    label: 'About SwiftDrop',
    color: 'text-gray-500',
    bg: 'bg-gray-100'
  }];

  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className="flex flex-col h-full bg-gray-50 pb-24 overflow-y-auto no-scrollbar">
      
      {/* Header Profile Info */}
      <div className="bg-white px-6 pt-12 pb-8 shadow-sm rounded-b-3xl mb-6 relative">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <img
              src={user?.avatar || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-brand/20" />
            
            <button className="absolute bottom-0 right-0 bg-brand text-dark p-2 rounded-full shadow-md border-2 border-white">
              <Edit2 size={14} />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-dark">{user?.name}</h1>
          <p className="text-gray-500 font-medium mt-1">{user?.phone}</p>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-6 space-y-3">
        <button
          onClick={() => navigate('/runner-signup')}
          className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div className="text-left">
            <p className="text-xs font-medium text-gray-500">Runner Mode</p>
            <p className="font-bold text-dark">
              {user?.isRunner ? 'Runner profile active' : 'Become a runner'}
            </p>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}>
                
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${item.bg}`}>
                    
                    <Icon size={20} className={item.color} />
                  </div>
                  <span className="font-semibold text-dark">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>);

          })}
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-red-500 font-bold hover:bg-red-50 transition-colors mt-6">
          
          <LogOut size={20} className="mr-2" />
          Log Out
        </button>

        <div className="text-center pt-8 pb-4">
          <p className="text-xs text-gray-400 font-medium">
            SwiftDrop App v1.0.0
          </p>
        </div>
      </div>
    </motion.div>);

};