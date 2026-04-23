import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, MessageCircle, Mail, ChevronRight } from 'lucide-react';

export const HelpSupportScreen = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: 'How long do deliveries take?',
      answer: 'Normal deliveries typically take 60-90 minutes in Nairobi depending on traffic.'
    },
    {
      question: 'How do I contact my runner?',
      answer: 'Open your active order and tap Chat or Call on the tracking screen.'
    },
    {
      question: 'Can I change delivery details after booking?',
      answer: 'Yes, contact support immediately and we will help update details when possible.'
    },
    {
      question: 'How do refunds work?',
      answer: 'Refunds are processed to your original payment method after issue verification.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-gray-50"
    >
      <div className="bg-white px-6 pt-10 pb-4 shadow-sm flex items-center z-10">
        <button
          onClick={() => navigate('/profile')}
          className="p-2 -ml-2 bg-gray-50 rounded-full"
        >
          <ArrowLeft size={20} className="text-dark" />
        </button>
        <h1 className="text-lg font-bold text-dark ml-4">Help & Support</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 pb-24 no-scrollbar">
        <div className="grid grid-cols-1 gap-3">
          <button className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mr-3">
                <Phone size={18} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-dark">Call Support</p>
                <p className="text-xs text-gray-500">+254 700 123 456</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <button className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
                <MessageCircle size={18} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-dark">Live Chat</p>
                <p className="text-xs text-gray-500">Average reply in 2 mins</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <button className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mr-3">
                <Mail size={18} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-dark">Email Support</p>
                <p className="text-xs text-gray-500">support@swiftdrop.co.ke</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold text-dark px-1">Frequently Asked Questions</h2>
          {faqs.map((faq) => (
            <div key={faq.question} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-sm font-bold text-dark">{faq.question}</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
