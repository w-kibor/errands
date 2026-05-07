import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getAuthCallbackUrl, isSupabaseConfigured, supabase } from '../lib/supabase';
import { useAppContext } from '../contexts/AppContext';
export const OtpScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAppContext();
  const storedAuth = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('swiftdrop_pending_auth') || 'null') as {
        email?: string;
        phone?: string;
        name?: string;
        purpose?: string;
        isSignup?: boolean;
      } | null;
    } catch {
      return null;
    }
  })();
  const email = location.state?.email || storedAuth?.email || 'you@example.com';
  const phone = location.state?.phone || storedAuth?.phone || '';
  const isSignup = location.state?.isSignup || storedAuth?.isSignup || false;
  const signupName = location.state?.name || storedAuth?.name || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-focus next
    if (value !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    // Check if complete
    if (newOtp.every((digit) => digit !== '')) {
      void verifyCode(newOtp.join(''));
    }
  };

  const requestCode = async () => {
    if (!isSupabaseConfigured || !supabase) {
      window.alert('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the root .env file first.');
      return;
    }

    sessionStorage.setItem('swiftdrop_pending_auth', JSON.stringify({
      email,
      phone,
      name: signupName,
      purpose: isSignup ? 'REGISTER' : 'LOGIN',
      isSignup
    }));

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: isSignup,
        emailRedirectTo: getAuthCallbackUrl(),
        ...(isSignup
          ? {
              data: {
                name: signupName,
                phone
              }
            }
          : {})
      }
    });

    if (error) {
      throw error;
    }

    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    inputRefs.current[0]?.focus();
  };

  const verifyCode = async (code: string) => {
    if (!isSupabaseConfigured || !supabase) {
      window.alert('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the root .env file first.');
      return;
    }

    setIsVerifying(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email'
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('Verification succeeded but no user was returned.');
      }

      await login(email, isSignup ? signupName : undefined, phone || undefined);
      sessionStorage.removeItem('swiftdrop_pending_auth');

      navigate('/home');
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Could not verify your account right now. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
      className="flex flex-col h-full bg-white px-6 pt-8 pb-8">
      
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-6 hover:bg-gray-100">
        
        <ArrowLeft size={20} className="text-dark" />
      </button>

      <h1 className="text-3xl font-bold text-dark mb-2">Verify it's you</h1>
      <p className="text-gray-500 mb-8">
        {isSignup ? 'Verify your email to create account: ' : 'We sent a code to '}
        <span className="font-semibold text-dark">{email}</span>
      </p>

      <div className="flex justify-between mb-8 px-2">
        {otp.map((digit, index) =>
        <input
          key={index}
          ref={(el) => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-16 h-16 text-center text-2xl font-bold text-dark bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-brand focus:bg-white outline-none transition-all"
          autoFocus={index === 0} />

        )}
      </div>

      <div className="text-center mt-4">
        {timer > 0 ?
        <p className="text-gray-500 font-medium">
            Resend code in{' '}
            <span className="text-brand-dark">
              00:{timer.toString().padStart(2, '0')}
            </span>
          </p> :

        <button
          onClick={() => void requestCode()}
          className="text-brand-dark font-bold hover:underline">
          
            Resend Code
          </button>
        }
      </div>

      {isVerifying && (
        <div className="mt-4 text-center text-xs text-gray-500">Verifying code...</div>
      )}
    </motion.div>);

};