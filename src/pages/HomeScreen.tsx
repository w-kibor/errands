import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell,
  Search,
  Package,
  ShoppingBag,
  MapPin,
  ChevronRight } from
'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { OrderCard } from '../components/OrderCard';
export const HomeScreen = () => {
  const navigate = useNavigate();
  const { user, orders } = useAppContext();
  const recentOrders = orders.slice(0, 2);
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className="flex flex-col h-full bg-gray-50 pb-24 overflow-y-auto no-scrollbar">
      
      {/* Header */}
      <div className="bg-white px-6 pt-10 pb-4 rounded-b-3xl shadow-sm z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-brand object-cover" />
            
            <div>
              <p className="text-xs text-gray-500 font-medium">Good morning,</p>
              <h2 className="text-lg font-bold text-dark">
                {user?.name?.split(' ')[0] || 'User'}!
              </h2>
            </div>
          </div>
          <button className="relative p-2 bg-gray-50 rounded-full">
            <Bell size={20} className="text-dark" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
          <Search size={20} className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="What do you need today?"
            className="bg-transparent flex-1 outline-none text-dark placeholder-gray-400 font-medium" />
          
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6">
        {/* Current Location */}
        <div className="flex items-center justify-between bg-brand/10 p-3 rounded-xl border border-brand/20">
          <div className="flex items-center text-brand-dark">
            <MapPin size={18} className="mr-2" />
            <span className="font-semibold text-sm">
              Current Location: Lagos
            </span>
          </div>
          <ChevronRight size={18} className="text-brand-dark" />
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileTap={{
              scale: 0.95
            }}
            onClick={() => navigate('/create-delivery')}
            className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-3">
            
            <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center">
              <Package size={32} className="text-brand-dark" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-bold text-dark">Send Package</h3>
              <p className="text-xs text-gray-500 mt-1">Documents, boxes</p>
            </div>
          </motion.button>

          <motion.button
            whileTap={{
              scale: 0.95
            }}
            onClick={() => navigate('/shop-errands')}
            className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 bg-brand text-dark text-[10px] font-bold px-2 py-1 rounded-bl-lg">
              NEW
            </div>
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <ShoppingBag
                size={32}
                className="text-blue-500"
                strokeWidth={2} />
              
            </div>
            <div>
              <h3 className="font-bold text-dark">Shop Errands</h3>
              <p className="text-xs text-gray-500 mt-1">Groceries, food</p>
            </div>
          </motion.button>
        </div>

        {/* Promo Banner */}
        <div className="bg-dark rounded-3xl p-5 text-white relative overflow-hidden shadow-md">
          <div className="relative z-10 w-2/3">
            <span className="bg-brand text-dark text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              Promo
            </span>
            <h3 className="text-lg font-bold mt-2 mb-1">Get 20% off!</h3>
            <p className="text-xs text-gray-300 mb-3">
              On your first 3 express deliveries this week.
            </p>
            <button className="text-xs font-bold bg-white text-dark px-4 py-2 rounded-full">
              Claim Now
            </button>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-50">
            <Package size={120} className="text-brand" />
          </div>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 &&
        <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-dark text-lg">Recent Orders</h3>
              <button
              onClick={() => navigate('/orders')}
              className="text-brand-dark text-sm font-semibold">
              
                See All
              </button>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) =>
            <OrderCard
              key={order.id}
              order={order}
              onClick={() =>
              order.status === 'Delivered' ?
              navigate('/orders') :
              navigate('/tracking')
              } />

            )}
            </div>
          </div>
        }
      </div>
    </motion.div>);

};