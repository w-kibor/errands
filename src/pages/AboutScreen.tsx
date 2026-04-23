import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, ShieldCheck, Clock3, MapPinned } from 'lucide-react';

export const AboutScreen = () => {
  const navigate = useNavigate();

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
        <h1 className="text-lg font-bold text-dark ml-4">About SwiftDrop</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 pb-24 no-scrollbar">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-brand/20 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <Package size={30} className="text-brand-dark" />
          </div>
          <h2 className="text-xl font-bold text-dark">SwiftDrop</h2>
          <p className="text-sm text-gray-500 mt-2">Anything, anywhere, fast.</p>
          <p className="text-xs text-gray-400 mt-1">Version 1.0.0</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            SwiftDrop is a Nairobi-first errands and delivery platform connecting customers with trusted runners for
            deliveries, shopping, verification tasks, and business support.
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mr-3 shrink-0">
              <Clock3 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-dark">Fast Fulfillment</h3>
              <p className="text-xs text-gray-500 mt-1">Quick matching and real-time tracking for city-wide errands.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-dark">Trusted Operations</h3>
              <p className="text-xs text-gray-500 mt-1">Verified runners, clear communication, and delivery confirmations.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mr-3 shrink-0">
              <MapPinned size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-dark">Built for Nairobi</h3>
              <p className="text-xs text-gray-500 mt-1">Designed around local neighborhoods, movement patterns, and needs.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
