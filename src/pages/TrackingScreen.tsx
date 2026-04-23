import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Star,
  ShieldCheck } from
'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useAppContext } from '../contexts/AppContext';
import { StatusStepper } from '../components/StatusStepper';
// Fix Leaflet icon issue in React
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
export const TrackingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, updateOrderStatus } = useAppContext();
  const orderId = location.state?.orderId;
  const order = orders.find((o) => o.id === orderId) || orders[0]; // Fallback to first order if none provided
  // Simulate status updates
  useEffect(() => {
    if (!order || order.status === 'Delivered' || order.status === 'Cancelled')
    return;
    const statuses: any[] = [
    'Rider Assigned',
    'Picking Up',
    'En Route',
    'Delivered'];

    const currentIndex = statuses.indexOf(order.status);
    if (currentIndex < statuses.length - 1) {
      const timer = setTimeout(() => {
        void (async () => {
          await updateOrderStatus(order.id, statuses[currentIndex + 1]);
          // If it just hit delivered, go to rating screen after a delay
          if (statuses[currentIndex + 1] === 'Delivered') {
            setTimeout(() => {
              navigate('/rating', {
                state: {
                  orderId: order.id
                }
              });
            }, 2000);
          }
        })();
      }, 5000); // Change status every 5 seconds for demo
      return () => clearTimeout(timer);
    }
  }, [order, updateOrderStatus, navigate]);
  if (!order || !order.rider) return null;
  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Map Area */}
      <div className="flex-1 relative z-0">
        <MapContainer
          center={[order.rider.lat, order.rider.lng]}
          zoom={14}
          zoomControl={false}
          className="w-full h-full">
          
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors' />
          
          <Marker
            position={[order.rider.lat, order.rider.lng]}
            icon={customIcon} />
          
        </MapContainer>

        {/* Top Bar Overlay */}
        <div className="absolute top-10 left-6 right-6 z-[400] flex justify-between items-center">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
            
            <ArrowLeft size={20} className="text-dark" />
          </button>
          <div className="bg-white px-4 py-2 rounded-full shadow-md font-bold text-sm text-dark">
            {order.id}
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <motion.div
        initial={{
          y: 100,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        className="bg-white rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[500] relative pt-2 pb-6 px-6">
        
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5"></div>

        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-dark">
              {order.status === 'Delivered' ? 'Arrived' : '15 min'}
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              Estimated arrival
            </p>
          </div>
          <div className="bg-brand/10 text-brand-dark px-3 py-1.5 rounded-lg font-bold text-sm flex items-center">
            <ShieldCheck size={16} className="mr-1" /> PIN: 4829
          </div>
        </div>

        <StatusStepper status={order.status} />

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={order.rider.avatar}
                  alt={order.rider.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-brand" />
                
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                  <div className="bg-brand text-dark text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center">
                    <Star size={10} className="mr-0.5 fill-dark" />{' '}
                    {order.rider.rating}
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-dark text-lg">
                  {order.rider.name}
                </h3>
                <p className="text-sm text-gray-500">{order.rider.vehicle}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/chat')}
                className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-dark hover:bg-gray-100 transition-colors">
                
                <MessageCircle size={22} />
              </button>
              <button className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors">
                <Phone size={22} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>);

};