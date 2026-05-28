import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const ServicesScreen = () => {
  const navigate = useNavigate();
  const { services } = useAppContext();

  // Ensure "Custom Task Requests" appears first in the list
  const orderedServices = React.useMemo(() => {
    if (!services) return [];
    const customIndex = services.findIndex(
      (s) => s.id === 'custom-task-requests' || s.name === 'Custom Task Requests'
    );
    if (customIndex === -1) return services;
    const custom = services[customIndex];
    return [custom, ...services.slice(0, customIndex), ...services.slice(customIndex + 1)];
  }, [services]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-gray-50"
    >
      <div className="bg-white px-6 pt-10 pb-4 shadow-sm flex items-center z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 bg-gray-50 rounded-full"
        >
          <ArrowLeft size={20} className="text-dark" />
        </button>
        <h1 className="text-lg font-bold text-dark ml-4">All Services</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar pb-24">
        <div className="bg-brand/10 border border-brand/20 rounded-2xl p-4">
          <div className="flex items-center text-brand-dark font-semibold text-sm">
            <ShieldCheck size={16} className="mr-2" />
            Services handled by trained runners.
          </div>
        </div>

        {orderedServices.map((service) => (
          <button
            key={service.id}
            onClick={() =>
              navigate('/create-request', {
                state: { serviceId: service.id }
              })
            }
            className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:border-brand/40 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="pr-3">
                <h2 className="text-base font-bold text-dark">{service.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{service.description}</p>
              </div>
              <ChevronRight size={20} className="text-gray-400 shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
