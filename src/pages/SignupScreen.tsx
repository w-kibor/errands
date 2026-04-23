import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, ArrowLeft } from 'lucide-react';

export const SignupScreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'details' | 'verify'>('details');

  const isNameValid = name.trim().length >= 2;
  const isPhoneValid = phone.length >= 9;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNameValid && isPhoneValid) {
      navigate('/otp', {
        state: {
          phone,
          isSignup: true,
          name: name.trim()
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
      className="flex flex-col h-full bg-white px-6 pt-12 pb-8"
    >
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-dark mb-2">Create Account</h1>
        <p className="text-gray-500 mb-8">
          Join SwiftDrop and get services delivered fast
        </p>

        <form onSubmit={handleContinue} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-4 outline-none text-dark font-medium focus:border-brand transition-colors"
              autoFocus
            />
            {name.length > 0 && name.trim().length < 2 && (
              <p className="text-xs text-red-500 mt-1">
                Name must be at least 2 characters
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-dark">
              Phone Number
            </label>
            <div className="flex border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-brand transition-colors">
              <button
                type="button"
                className="flex items-center px-4 bg-gray-50 border-r border-gray-100 text-dark font-medium"
              >
                <span>🇰🇪</span>
                <span className="mx-2">+254</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="712 345 678"
                className="flex-1 px-4 py-4 outline-none text-dark font-medium text-lg w-full"
              />
            </div>
            {phone.length > 0 && phone.length < 9 && (
              <p className="text-xs text-red-500 mt-1">
                Phone number must be at least 9 digits
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isNameValid || !isPhoneValid}
            className={`w-full py-4 rounded-full font-bold text-lg flex justify-center items-center transition-all ${
              isNameValid && isPhoneValid
                ? 'bg-brand text-dark shadow-md hover:bg-brand-light active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            Create Account
            <ArrowRight size={20} className="ml-2" />
          </button>
        </form>

        {/* Already have account? */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-brand-dark font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400">
          By continuing, you agree to our{' '}
          <span className="text-brand-dark font-medium">Terms of Service</span>{' '}
          and{' '}
          <span className="text-brand-dark font-medium">Privacy Policy</span>.
        </p>
      </div>
    </motion.div>
  );
};
