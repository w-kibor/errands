import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';

/**
 * Shown after user enters their email to send magic link
 * Instructs user to check their email and click the magic link
 */
export const CheckEmailScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';

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
      
      <button
        onClick={() => navigate('/login')}
        className="inline-flex items-center gap-2 text-primary font-semibold mb-8 hover:opacity-70 transition">
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
        <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-primary/10">
          <Mail className="w-10 h-10 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-dark">Check your email</h1>
          <p className="text-gray-500">
            We've sent a link to <span className="font-semibold text-gray-700">{email}</span>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3 w-full">
          <p className="text-sm text-blue-900">
            <strong>Click the link in your email</strong> to verify your account and sign in to SwiftDrop.
          </p>
          <p className="text-xs text-blue-800">
            The link will take you directly into your account, or to runner setup if you chose that option.
          </p>
        </div>

        <div className="space-y-3 w-full pt-4">
          <p className="text-sm text-gray-500">Didn't receive the email?</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 px-4 bg-gray-100 text-dark font-semibold rounded-lg hover:bg-gray-200 transition">
            Try another email
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          Link expires in 24 hours
        </p>
      </div>
    </motion.div>
  );
};
