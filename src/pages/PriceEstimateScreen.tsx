import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
export const PriceEstimateScreen = () => {
  const navigate = useNavigate();
  const { draftOrder, addOrder, setDraftOrder } = useAppContext();
  const [isConfirming, setIsConfirming] = useState(false);
  // Redirect if no draft
  useEffect(() => {
    if (!draftOrder) navigate('/home');
  }, [draftOrder, navigate]);
  if (!draftOrder) return null;
  // Calculate mock price
  const basePrice = 1200;
  const distanceFee = 800; // Mocked
  const expressFee = draftOrder.urgency === 'Express' ? 800 : 0;
  const total = basePrice + distanceFee + expressFee;
  const handleConfirm = () => {
    setIsConfirming(true);
    // Simulate API call to find rider
    setTimeout(() => {
      void (async () => {
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString(),
        pickup: draftOrder.pickup,
        dropoff: draftOrder.dropoff,
        packageType: draftOrder.packageType,
        urgency: draftOrder.urgency,
        status: 'Rider Assigned' as const,
        price: total,
        note: draftOrder.note,
        rider: {
          id: 'r2',
          name: 'David K.',
          phone: '+254 722 111 222',
          rating: 4.9,
          vehicle: 'Toyota Corolla',
          avatar:
          'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          lat: -1.2921,
          lng: 36.8219
        }
      };
      await addOrder(newOrder);
      setDraftOrder(null);
      navigate('/tracking', {
        state: {
          orderId: newOrder.id
        }
      });
      })();
    }, 2000);
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 20
      }}
      animate={{
        opacity: 1,
        x: 0
      }}
      exit={{
        opacity: 0,
        x: -20
      }}
      className="flex flex-col h-full bg-gray-50">
      
      {/* Header */}
      <div className="bg-white px-6 pt-10 pb-4 shadow-sm flex items-center z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 bg-gray-50 rounded-full">
          
          <ArrowLeft size={20} className="text-dark" />
        </button>
        <h1 className="text-lg font-bold text-dark ml-4">Order Summary</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32 no-scrollbar">
        {/* Route Map Placeholder (Visual only) */}
        <div className="bg-gray-200 h-40 rounded-2xl overflow-hidden relative border border-gray-300">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-white border-4 border-brand rounded-full -mt-1.5 -ml-1.5 z-10"></div>
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-brand rounded-full -mt-1.5 -ml-1.5 z-10"></div>
          <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-brand border-t-2 border-dashed border-brand -mt-0.5 z-0"></div>
          <div className="absolute bottom-3 right-3 bg-white/90 px-3 py-1 rounded-lg text-xs font-bold text-dark shadow-sm">
            Est. 4.2 km
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-dark">Delivery Details</h2>
            <button
              onClick={() => navigate(-1)}
              className="text-brand-dark text-xs font-bold">
              
              Edit
            </button>
          </div>

          <div className="relative pl-3 ml-2 border-l-2 border-dashed border-gray-200 space-y-4 mb-5">
            <div className="relative">
              <div className="absolute -left-[19px] top-1 w-3 h-3 bg-white border-2 border-brand rounded-full"></div>
              <p className="text-xs text-gray-500 font-medium">Pickup</p>
              <p className="text-sm font-semibold text-dark">
                {draftOrder.pickup.address}
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-[19px] top-1 w-3 h-3 bg-brand rounded-full"></div>
              <p className="text-xs text-gray-500 font-medium">Drop-off</p>
              <p className="text-sm font-semibold text-dark">
                {draftOrder.dropoff.address}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
              {draftOrder.packageType}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${draftOrder.urgency === 'Express' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
              
              {draftOrder.urgency} Delivery
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-3">
              <CreditCard size={20} className="text-dark" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                Payment Method
              </p>
              <p className="text-sm font-bold text-dark">Cash on Delivery</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
          <h2 className="font-bold text-dark mb-2">Payment Summary</h2>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Base Fare</span>
            <span className="font-medium text-dark">
              KSh {basePrice.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Distance Fee</span>
            <span className="font-medium text-dark">
              KSh {distanceFee.toLocaleString()}
            </span>
          </div>
          {expressFee > 0 &&
          <div className="flex justify-between text-sm">
              <span className="text-gray-500">Express Surcharge</span>
              <span className="font-medium text-dark">
                KSh {expressFee.toLocaleString()}
              </span>
            </div>
          }
          <div className="pt-3 mt-1 border-t border-gray-100 flex justify-between items-center">
            <span className="font-bold text-dark">Total</span>
            <span className="text-xl font-bold text-brand-dark">
              KSh {total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-white border-t border-gray-100 p-4 pb-safe absolute bottom-0 left-0 right-0 shadow-up z-20">
        <button
          onClick={handleConfirm}
          disabled={isConfirming}
          className="w-full py-4 rounded-full font-bold text-lg bg-brand text-dark shadow-md active:scale-[0.98] transition-all flex justify-center items-center">
          
          {isConfirming ?
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: 'linear'
            }}
            className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full" /> :


          `Confirm & Find Rider`
          }
        </button>
      </div>
    </motion.div>);

};