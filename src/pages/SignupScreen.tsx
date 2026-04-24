import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export const SignupScreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSending, setIsSending] = useState(false);

  const isNameValid = name.trim().length >= 2;
  const isEmailValid = email.includes('@');
  const isPhoneValid = phone.length >= 9;

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNameValid && isEmailValid && isPhoneValid) {
      if (!isSupabaseConfigured || !supabase) {
        window.alert('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the root .env file first.');
        return;
      }

      setIsSending(true);
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            data: {
              name: name.trim(),
              phone: `+254 ${phone}`
            }
          }
        });

        if (error) {
          throw error;
        }

        navigate('/check-email', {
          state: { email }
        });
      } catch (error) {
        window.alert(error instanceof Error ? error.message : 'Could not send magic link right now.');
      } finally {
        setIsSending(false);
      }
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
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-4 outline-none text-dark font-medium focus:border-brand transition-colors"
            />
            {email.length > 0 && !email.includes('@') && (
              <p className="text-xs text-red-500 mt-1">
                Enter a valid email address
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-dark">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="712 345 678"
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-4 outline-none text-dark font-medium focus:border-brand transition-colors"
            />
            {phone.length > 0 && phone.length < 9 && (
              <p className="text-xs text-red-500 mt-1">
                Phone number must be at least 9 digits
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isNameValid || !isEmailValid || !isPhoneValid || isSending}
            className={`w-full py-4 rounded-full font-bold text-lg flex justify-center items-center transition-all ${
              isNameValid && isEmailValid && isPhoneValid
                ? 'bg-brand text-dark shadow-md hover:bg-brand-light active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {isSending ? 'Sending Link...' : 'Create Account'}
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
