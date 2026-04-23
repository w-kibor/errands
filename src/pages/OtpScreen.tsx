import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
export const OtpScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAppContext();
  const phone = location.state?.phone || '712 345 678';
  const isSignup = location.state?.isSignup || false;
  const signupName = location.state?.name || '';
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
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
      // Simulate API call
      setTimeout(() => {
        login(`+254 ${phone}`, isSignup ? signupName : undefined);
        navigate('/home');
      }, 500);
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
        {isSignup ? 'Verify your number to create account: ' : 'We sent a code to '}
        <span className="font-semibold text-dark">+254 {phone}</span>
      </p>

      <div className="flex justify-between mb-8 px-2">
        {otp.map((digit, index) =>
        <input
          key={index}
          ref={(el) => inputRefs.current[index] = el}
          type="number"
          inputMode="numeric"
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
          onClick={() => setTimer(30)}
          className="text-brand-dark font-bold hover:underline">
          
            Resend Code
          </button>
        }
      </div>
    </motion.div>);

};