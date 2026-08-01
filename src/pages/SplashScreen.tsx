import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
export const SplashScreen = () => {
  const navigate = useNavigate();
  const { user, isHydrating } = useAppContext();
  useEffect(() => {
    if (isHydrating) return;

    const timer = setTimeout(() => {
      navigate(user ? '/home' : '/signup');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate, user, isHydrating]);
  return (
    <div className="flex flex-col items-center justify-center h-full bg-brand relative overflow-hidden">
      {/* Background decorative circles */}
      <motion.div
        initial={{
          scale: 0,
          opacity: 0
        }}
        animate={{
          scale: 1,
          opacity: 0.1
        }}
        transition={{
          duration: 1
        }}
        className="absolute w-96 h-96 bg-white rounded-full -top-20 -right-20" />
      
      <motion.div
        initial={{
          scale: 0,
          opacity: 0
        }}
        animate={{
          scale: 1,
          opacity: 0.1
        }}
        transition={{
          duration: 1,
          delay: 0.2
        }}
        className="absolute w-64 h-64 bg-white rounded-full -bottom-10 -left-10" />
      

      <motion.div
        initial={{
          scale: 0.5,
          opacity: 0,
          y: 20
        }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          duration: 0.8
        }}
        className="flex flex-col items-center z-10">
        
        <div className="bg-white p-5 rounded-3xl shadow-lg mb-4">
          <Package size={48} className="text-brand-dark" strokeWidth={2.5} />
        </div>
        <motion.h1
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.4
          }}
          className="text-4xl font-bold text-dark tracking-tight">
          
          SwiftDrop
        </motion.h1>
        <motion.p
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            delay: 0.6
          }}
          className="text-dark/80 font-medium mt-2">
          
          Anything, anywhere, fast.
        </motion.p>
      </motion.div>
    </div>);

};