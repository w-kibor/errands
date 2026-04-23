import React from 'react';
import { Package, MapPin, ChevronRight, Clock } from 'lucide-react';
import { Order } from '../types';
import { motion } from 'framer-motion';
interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}
export const OrderCard = ({ order, onClick }: OrderCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-brand/20 text-brand-dark';
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return (
    <motion.div
      whileTap={{
        scale: 0.98
      }}
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer">
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <div className="bg-gray-50 p-2 rounded-full">
            <Package size={18} className="text-dark" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-dark">{order.id}</h4>
            <p className="text-xs text-gray-500 flex items-center mt-0.5">
              <Clock size={10} className="mr-1" /> {formatDate(order.date)}
            </p>
          </div>
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${getStatusColor(order.status)}`}>
          
          {order.status}
        </span>
      </div>

      <div className="relative pl-3 ml-2 border-l-2 border-dashed border-gray-200 space-y-3 my-3">
        <div className="relative">
          <div className="absolute -left-[19px] top-1 w-3 h-3 bg-white border-2 border-brand rounded-full"></div>
          <p className="text-xs text-gray-500 font-medium">Pickup</p>
          <p className="text-sm text-dark truncate">{order.pickup.address}</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[19px] top-1 w-3 h-3 bg-brand rounded-full"></div>
          <p className="text-xs text-gray-500 font-medium">Drop-off</p>
          <p className="text-sm text-dark truncate">{order.dropoff.address}</p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-50 mt-2">
        <div className="flex space-x-3">
          <span className="text-xs font-medium bg-gray-50 px-2 py-1 rounded text-gray-600">
            {order.packageType}
          </span>
          {order.urgency === 'Express' &&
          <span className="text-xs font-medium bg-red-50 text-red-600 px-2 py-1 rounded">
              Express
            </span>
          }
        </div>
        <div className="flex items-center text-brand-dark font-bold">
          ₦{order.price.toLocaleString()}
          <ChevronRight size={16} className="ml-1 text-gray-400" />
        </div>
      </div>
    </motion.div>);

};