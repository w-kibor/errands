import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getAuthCallbackUrl, isSupabaseConfigured, supabase } from '../lib/supabase';

export const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      if (!isSupabaseConfigured || !supabase) {
        window.alert('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the root .env file first.');
        return;
      }

      setIsSending(true);
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
            emailRedirectTo: getAuthCallbackUrl()
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
      className="flex flex-col h-full bg-white px-6 pt-12 pb-8">
      
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-dark mb-2">Welcome back</h1>
        <p className="text-gray-500 mb-8">
          Enter your email address to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              autoFocus />
          </div>

          <button
            type="submit"
            disabled={!email.includes('@') || isSending}
            className={`w-full py-4 rounded-full font-bold text-lg flex justify-center items-center transition-all ${email.includes('@') ? 'bg-brand text-dark shadow-md hover:bg-brand-light active:scale-[0.98]' : 'bg-gray-100 text-gray-400'}`}>
            
            {isSending ? 'Sending Link...' : 'Continue'}
            <ArrowRight size={20} className="ml-2" />
          </button>
        </form>
      </div>

      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-brand-dark font-bold hover:underline"
          >
            Create one
          </button>
        </p>
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
