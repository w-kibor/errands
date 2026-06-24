import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
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
import { ProfileAvatar } from '../components/ProfileAvatar';

const runnerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export const HomeScreen = () => {
  const navigate = useNavigate();
  const { user, orders } = useAppContext();
  const recentOrders = orders.slice(0, 2);
  const [nearbyRunners, setNearbyRunners] = useState<any[]>([]);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    
    // Fetch initial online runners
    fetch(`${apiBase}/api/jobs/nearby-runners`)
      .then((res) => res.json())
      .then((data) => {
        if (data.runners) {
          setNearbyRunners(data.runners);
        }
      })
      .catch((err) => console.error('Error fetching nearby runners:', err));

    // Connect to WebSocket
    const wsUrl = apiBase.replace(/^http/, 'ws');
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('Customer HomeScreen WS connected');
      socket.send(JSON.stringify({ type: 'subscribe_nearby' }));
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'nearby_runners') {
          setNearbyRunners(message.runners);
        }
      } catch (err) {
        console.error('Error handling nearby WS message:', err);
      }
    };

    socket.onerror = (err) => {
      console.error('Customer HomeScreen WS error:', err);
    };

    return () => {
      socket.close();
    };
  }, []);
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
            <ProfileAvatar
              src={user?.avatar}
              name={user?.name}
              size={48}
              className="border-2 border-brand"
            />
            
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
              Current Location: Nairobi
            </span>
          </div>
          <ChevronRight size={18} className="text-brand-dark" />
        </div>

        {/* Nearby Runners Map Widget */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 overflow-hidden relative">
          <h3 className="font-bold text-dark text-sm mb-3">Nearby SwiftDrop Runners</h3>
          <div className="h-44 rounded-2xl overflow-hidden relative border border-gray-150 z-0">
            <MapContainer
              center={[-1.286389, 36.817223]} // Center in Nairobi
              zoom={13}
              zoomControl={false}
              className="w-full h-full">
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
              />
              {/* Nearby Runner Markers */}
              {nearbyRunners.map((runner) => (
                <Marker
                  key={runner.runnerId}
                  position={[runner.lat, runner.lng]}
                  icon={runnerIcon}
                >
                  <Popup>
                    <div className="text-xs font-semibold p-1">
                      <p className="font-bold">{runner.name}</p>
                      <p className="text-[10px] text-gray-500">{runner.vehicle}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
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
            onClick={() => navigate('/services')}
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
              <h3 className="font-bold text-dark">All Services</h3>
              <p className="text-xs text-gray-500 mt-1">Runners on demand</p>
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