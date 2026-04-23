import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { ServiceType } from '../types';

const capabilityOptions: ServiceType[] = [
  'CBD Batch Delivery',
  'Personal Shopping',
  'Parcel Pickup and Drop Off',
  'Shop Legitimacy Verification',
  'Custom Task Requests',
  'Dedicated Business Errands Support'
];

export const RunnerSignupScreen = () => {
  const navigate = useNavigate();
  const { becomeRunner } = useAppContext();

  const [vehicleType, setVehicleType] = useState('');
  const [coverageArea, setCoverageArea] = useState('Lagos Island / Lekki / Yaba');
  const [capabilities, setCapabilities] = useState<ServiceType[]>([]);

  const toggleCapability = (service: ServiceType) => {
    setCapabilities((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service]
    );
  };

  const isValid = vehicleType.trim().length > 2 && capabilities.length > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    becomeRunner({
      vehicleType: vehicleType.trim(),
      coverageArea: coverageArea.trim(),
      capabilities,
      verified: false
    });

    navigate('/profile');
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
        <h1 className="text-lg font-bold text-dark ml-4">Runner Onboarding</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 pb-28 no-scrollbar">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="text-base font-bold text-dark">Become a SwiftDrop Runner</h2>
          <p className="text-sm text-gray-500 mt-2">
            Select the services you can handle. You can update this later.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark">Vehicle Type</label>
          <input
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            placeholder="Bike, motorcycle, car, van"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark">Coverage Area</label>
          <input
            value={coverageArea}
            onChange={(e) => setCoverageArea(e.target.value)}
            placeholder="Where you operate"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark">Services You Can Run</label>
          <div className="space-y-2">
            {capabilityOptions.map((service) => {
              const selected = capabilities.includes(service);
              return (
                <button
                  key={service}
                  onClick={() => toggleCapability(service)}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-3 border text-sm font-medium transition-colors ${
                    selected
                      ? 'bg-brand/10 border-brand text-dark'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-brand/40'
                  }`}
                >
                  {service}
                  {selected && <Check size={16} />}
                </button>
              );
            })}
          </div>
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
          Submit Runner Profile
        </button>
      </div>
    </motion.div>
  );
};
