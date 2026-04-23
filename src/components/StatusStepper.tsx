import React from 'react';
import { motion } from 'framer-motion';
import { OrderStatus } from '../types';
interface StatusStepperProps {
  status: OrderStatus;
}
export const StatusStepper = ({ status }: StatusStepperProps) => {
  const steps: OrderStatus[] = [
  'Rider Assigned',
  'Picking Up',
  'En Route',
  'Delivered'];

  const currentIndex = steps.indexOf(status);
  // Handle cases where status isn't in the main flow (e.g. Pending, Cancelled)
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  if (status === 'Cancelled') {
    return (
      <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center font-bold text-sm">
        Order Cancelled
      </div>);

  }
  return (
    <div className="py-2">
      <div className="flex justify-between relative">
        {/* Background Line */}
        <div className="absolute top-3 left-4 right-4 h-1 bg-gray-100 -z-10 rounded-full"></div>

        {/* Active Line */}
        <motion.div
          className="absolute top-3 left-4 h-1 bg-brand -z-10 rounded-full"
          initial={{
            width: '0%'
          }}
          animate={{
            width: `${activeIndex / (steps.length - 1) * 100}%`
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut'
          }} />
        

        {steps.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isActive = index === activeIndex;
          return (
            <div
              key={step}
              className="flex flex-col items-center relative z-10 w-1/4">
              
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isCompleted ? '#FFC244' : '#F3F4F6',
                  borderColor: isCompleted ? '#FFC244' : '#E5E7EB'
                }}
                className={`w-7 h-7 rounded-full border-4 flex items-center justify-center mb-2 ${isCompleted ? 'border-white shadow-sm' : 'border-white'}`}>
                
                {isCompleted && index < activeIndex &&
                <svg
                  className="w-3 h-3 text-dark"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7" />
                  
                  </svg>
                }
                {isActive && <div className="w-2 h-2 bg-dark rounded-full" />}
              </motion.div>
              <span
                className={`text-[10px] font-semibold text-center leading-tight ${isActive ? 'text-dark' : isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                
                {step}
              </span>
            </div>);

        })}
      </div>
    </div>);

};