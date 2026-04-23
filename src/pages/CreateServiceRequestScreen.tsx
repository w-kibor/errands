import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { UrgencyType } from '../types';

export const CreateServiceRequestScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, services, addServiceRequest } = useAppContext();

  const selectedServiceId = location.state?.serviceId as string | undefined;

  const service = useMemo(
    () => services.find((item) => item.id === selectedServiceId),
    [services, selectedServiceId]
  );

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [urgency, setUrgency] = useState<UrgencyType>('Normal');

  useEffect(() => {
    if (!service) {
      navigate('/services');
    }
  }, [service, navigate]);

  if (!service) return null;

  const isShopVerification = service.name === 'Shop Legitimacy Verification';

  const isValid =
    instructions.trim().length >= 8 &&
    (!service.requiresPickup || pickup.trim().length > 3) &&
    (!service.requiresDropoff || dropoff.trim().length > 3) &&
    (!isShopVerification || businessName.trim().length > 2);

  const handleSubmit = () => {
    if (!user || !isValid) return;

    void (async () => {
      await addServiceRequest({
        id: `SRV-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceId: service.id,
        serviceName: service.name,
        customerId: user.id,
        createdAt: new Date().toISOString(),
        pickup: service.requiresPickup ? { address: pickup } : undefined,
        dropoff: service.requiresDropoff ? { address: dropoff } : undefined,
        businessName: isShopVerification ? businessName : undefined,
        instructions: instructions.trim(),
        urgency,
        status: 'Pending'
      });

      navigate('/home');
    })();
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
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 bg-gray-50 rounded-full"
        >
          <ArrowLeft size={20} className="text-dark" />
        </button>
        <h1 className="text-lg font-bold text-dark ml-4">Request Service</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 pb-28 no-scrollbar">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500 font-medium">Selected Service</p>
          <h2 className="text-base font-bold text-dark mt-1">{service.name}</h2>
          <p className="text-sm text-gray-500 mt-2">{service.description}</p>
        </div>

        {service.requiresPickup && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark">Pickup Address</label>
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter pickup address"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand"
            />
          </div>
        )}

        {service.requiresDropoff && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark">Drop-off Address</label>
            <input
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="Enter drop-off address"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand"
            />
          </div>
        )}

        {isShopVerification && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark">Shop Name</label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter business or shop name"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark">Urgency</label>
          <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded-xl border border-gray-100">
            {(['Normal', 'Express'] as UrgencyType[]).map((value) => (
              <button
                key={value}
                onClick={() => setUrgency(value)}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  urgency === value
                    ? 'bg-brand text-dark'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark">Task Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Describe exactly what you want the runner to do."
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-brand resize-none h-28"
          />
        </div>
      </div>

      <div className="bg-white border-t border-gray-100 p-4 pb-safe absolute bottom-0 left-0 right-0 shadow-up">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
            isValid
              ? 'bg-brand text-dark shadow-md active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          Submit Request
        </button>
      </div>
    </motion.div>
  );
};
