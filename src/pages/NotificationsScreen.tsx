import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Package, Tag, MessageCircle } from 'lucide-react';

type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
};

export const NotificationsScreen = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'order-updates',
      title: 'Order Updates',
      description: 'Status changes, rider assignment, and delivery progress.',
      icon: Package,
      enabled: true
    },
    {
      id: 'promotions',
      title: 'Promotions',
      description: 'Discounts, campaigns, and limited-time offers.',
      icon: Tag,
      enabled: true
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Chat and support message alerts.',
      icon: MessageCircle,
      enabled: true
    }
  ]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              enabled: !item.enabled
            }
          : item
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-gray-50"
    >
      <div className="bg-white px-6 pt-10 pb-4 shadow-sm flex items-center z-10">
        <button
          onClick={() => navigate('/profile')}
          className="p-2 -ml-2 bg-gray-50 rounded-full"
        >
          <ArrowLeft size={20} className="text-dark" />
        </button>
        <h1 className="text-lg font-bold text-dark ml-4">Notifications</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24 no-scrollbar">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center text-dark font-semibold text-sm">
            <Bell size={16} className="mr-2 text-purple-500" />
            Choose what you want to be notified about.
          </div>
        </div>

        {settings.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-dark" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-dark">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting(item.id)}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    item.enabled ? 'bg-brand' : 'bg-gray-300'
                  }`}
                  aria-label={`Toggle ${item.title}`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      item.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
