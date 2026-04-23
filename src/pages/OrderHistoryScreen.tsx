import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import { OrderCard } from '../components/OrderCard';
import { PackageX } from 'lucide-react';
export const OrderHistoryScreen = () => {
  const { orders } = useAppContext();
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed'>('Active');
  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'Active') {
      return !['Delivered', 'Cancelled'].includes(order.status);
    }
    return ['Delivered', 'Cancelled'].includes(order.status);
  });
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className="flex flex-col h-full bg-gray-50 pb-24">
      
      {/* Header */}
      <div className="bg-white px-6 pt-10 pb-4 shadow-sm z-10">
        <h1 className="text-2xl font-bold text-dark mb-4">My Orders</h1>

        {/* Tabs */}
        <div className="flex bg-gray-50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('Active')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'Active' ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-dark'}`}>
            
            Active
          </button>
          <button
            onClick={() => setActiveTab('Completed')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'Completed' ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-dark'}`}>
            
            Completed
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {filteredOrders.length > 0 ?
        filteredOrders.map((order) =>
        <OrderCard key={order.id} order={order} />
        ) :

        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 pt-20">
            <PackageX
            size={64}
            className="text-gray-400 mb-4"
            strokeWidth={1} />
          
            <h3 className="text-lg font-bold text-dark">
              No {activeTab.toLowerCase()} orders
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              When you place an order, it will appear here.
            </p>
          </div>
        }
      </div>
    </motion.div>);

};