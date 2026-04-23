import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
export const LoginScreen = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length > 5) {
      navigate('/otp', {
        state: {
          phone
        }
      });
    }
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
      className="flex flex-col h-full bg-white px-6 pt-12 pb-8">
      
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-dark mb-2">Welcome back</h1>
        <p className="text-gray-500 mb-8">
          Enter your phone number to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark">
              Phone Number
            </label>
            <div className="flex border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-brand transition-colors">
              <button
                type="button"
                className="flex items-center px-4 bg-gray-50 border-r border-gray-100 text-dark font-medium">
                
                <span>🇳🇬</span>
                <span className="mx-2">+234</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="800 000 0000"
                className="flex-1 px-4 py-4 outline-none text-dark font-medium text-lg w-full"
                autoFocus />
              
            </div>
          </div>

          <button
            type="submit"
            disabled={phone.length < 6}
            className={`w-full py-4 rounded-full font-bold text-lg flex justify-center items-center transition-all ${phone.length >= 6 ? 'bg-brand text-dark shadow-md hover:bg-brand-light active:scale-[0.98]' : 'bg-gray-100 text-gray-400'}`}>
            
            Continue
            <ArrowRight size={20} className="ml-2" />
          </button>
        </form>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400">
          By continuing, you agree to our{' '}
          <span className="text-brand-dark font-medium">Terms of Service</span>{' '}
          and{' '}
          <span className="text-brand-dark font-medium">Privacy Policy</span>.
        </p>
      </div>
    </motion.div>);

};