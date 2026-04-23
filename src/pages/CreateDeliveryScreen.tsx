import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Package,
  Zap,
  Clock,
  Info } from
'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { PackageType, UrgencyType } from '../types';
export const CreateDeliveryScreen = () => {
  const navigate = useNavigate();
  const { setDraftOrder } = useAppContext();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [packageType, setPackageType] = useState<PackageType>('Small Box');
  const [urgency, setUrgency] = useState<UrgencyType>('Normal');
  const [note, setNote] = useState('');
  const packageTypes: {
    type: PackageType;
    icon: any;
    desc: string;
  }[] = [
  {
    type: 'Document',
    icon: FileTextIcon,
    desc: 'Up to 1kg'
  },
  {
    type: 'Small Box',
    icon: Package,
    desc: 'Up to 5kg'
  },
  {
    type: 'Medium Box',
    icon: Package,
    desc: 'Up to 15kg'
  },
  {
    type: 'Large Box',
    icon: Package,
    desc: 'Up to 30kg'
  }];

  const handleContinue = () => {
    if (!pickup || !dropoff) return;
    setDraftOrder({
      pickup: {
        address: pickup,
        lat: 6.5244,
        lng: 3.3792
      },
      dropoff: {
        address: dropoff,
        lat: 6.4698,
        lng: 3.5852
      },
      packageType,
      urgency,
      note
    });
    navigate('/estimate');
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
        <h1 className="text-lg font-bold text-dark ml-4">Send Package</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24 no-scrollbar">
        {/* Locations */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-dark text-sm mb-2">Locations</h2>

          <div className="relative">
            <div className="absolute left-4 top-3.5 w-3 h-3 bg-white border-2 border-brand rounded-full z-10"></div>
            <div className="absolute left-[21px] top-8 bottom-[-16px] w-[2px] bg-gray-200 z-0"></div>
            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 pl-10 pr-3 py-1 focus-within:border-brand focus-within:bg-white transition-colors">
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Pickup address"
                className="w-full py-2.5 bg-transparent outline-none text-sm font-medium text-dark" />
              
              <button className="p-1.5 text-brand-dark bg-brand/10 rounded-lg">
                <Navigation size={16} />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-3.5 w-3 h-3 bg-brand rounded-full z-10"></div>
            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 pl-10 pr-3 py-1 focus-within:border-brand focus-within:bg-white transition-colors">
              <input
                type="text"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                placeholder="Drop-off address"
                className="w-full py-2.5 bg-transparent outline-none text-sm font-medium text-dark" />
              
            </div>
          </div>
        </div>

        {/* Package Type */}
        <div className="space-y-3">
          <h2 className="font-bold text-dark text-sm px-1">Package Type</h2>
          <div className="grid grid-cols-2 gap-3">
            {packageTypes.map((pt) => {
              const Icon = pt.icon;
              const isSelected = packageType === pt.type;
              return (
                <button
                  key={pt.type}
                  onClick={() => setPackageType(pt.type)}
                  className={`p-3 rounded-xl border text-left transition-all ${isSelected ? 'border-brand bg-brand/5 shadow-sm' : 'border-gray-200 bg-white hover:border-brand/50'}`}>
                  
                  <Icon
                    size={20}
                    className={isSelected ? 'text-brand-dark' : 'text-gray-400'} />
                  
                  <h3
                    className={`font-semibold text-sm mt-2 ${isSelected ? 'text-brand-dark' : 'text-dark'}`}>
                    
                    {pt.type}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">{pt.desc}</p>
                </button>);

            })}
          </div>
        </div>

        {/* Urgency */}
        <div className="space-y-3">
          <h2 className="font-bold text-dark text-sm px-1">Delivery Speed</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <button
              onClick={() => setUrgency('Normal')}
              className={`w-full flex items-center justify-between p-4 border-b border-gray-50 ${urgency === 'Normal' ? 'bg-brand/5' : ''}`}>
              
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-full mr-3 ${urgency === 'Normal' ? 'bg-brand/20 text-brand-dark' : 'bg-gray-100 text-gray-500'}`}>
                  
                  <Clock size={20} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-sm text-dark">
                    Normal Delivery
                  </h3>
                  <p className="text-xs text-gray-500">60 - 90 mins</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${urgency === 'Normal' ? 'border-brand' : 'border-gray-300'}`}>
                
                {urgency === 'Normal' &&
                <div className="w-2.5 h-2.5 bg-brand rounded-full" />
                }
              </div>
            </button>

            <button
              onClick={() => setUrgency('Express')}
              className={`w-full flex items-center justify-between p-4 ${urgency === 'Express' ? 'bg-brand/5' : ''}`}>
              
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-full mr-3 ${urgency === 'Express' ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'}`}>
                  
                  <Zap size={20} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-sm text-dark">
                    Express Delivery
                  </h3>
                  <p className="text-xs text-gray-500">
                    25 - 40 mins{' '}
                    <span className="text-red-500 font-medium ml-1">+₦800</span>
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${urgency === 'Express' ? 'border-brand' : 'border-gray-300'}`}>
                
                {urgency === 'Express' &&
                <div className="w-2.5 h-2.5 bg-brand rounded-full" />
                }
              </div>
            </button>
          </div>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <h2 className="font-bold text-dark text-sm px-1">
            Note for Rider (Optional)
          </h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="E.g. Call me when you arrive at the gate"
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-brand resize-none h-24" />
          
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-white border-t border-gray-100 p-4 pb-safe absolute bottom-0 left-0 right-0 shadow-up">
        <button
          onClick={handleContinue}
          disabled={!pickup || !dropoff}
          className={`w-full py-4 rounded-full font-bold text-lg transition-all ${pickup && dropoff ? 'bg-brand text-dark shadow-md active:scale-[0.98]' : 'bg-gray-100 text-gray-400'}`}>
          
          Get Price Estimate
        </button>
      </div>
    </motion.div>);

};
// Helper icon
function FileTextIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>);

}