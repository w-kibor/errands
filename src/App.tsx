import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './contexts/AppContext';
import { BottomNav } from './components/BottomNav';
// Pages
import { SplashScreen } from './pages/SplashScreen';
import { LoginScreen } from './pages/LoginScreen';
import { OtpScreen } from './pages/OtpScreen';
import { SignupScreen } from './pages/SignupScreen';
import { HomeScreen } from './pages/HomeScreen';
import { CreateDeliveryScreen } from './pages/CreateDeliveryScreen';
import { PriceEstimateScreen } from './pages/PriceEstimateScreen';
import { TrackingScreen } from './pages/TrackingScreen';
import { OrderHistoryScreen } from './pages/OrderHistoryScreen';
import { ChatScreen } from './pages/ChatScreen';
import { RatingScreen } from './pages/RatingScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { ShopErrandsScreen } from './pages/ShopErrandsScreen';
import { ServicesScreen } from './pages/ServicesScreen';
import { CreateServiceRequestScreen } from './pages/CreateServiceRequestScreen';
import { RunnerSignupScreen } from './pages/RunnerSignupScreen';
const AppContent = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      {/* Mobile Device Frame */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[850px] bg-white sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden relative sm:border-[8px] border-gray-900 flex flex-col">
        {/* Top Status Bar Mock (Desktop only) */}
        <div className="hidden sm:flex justify-between items-center px-6 py-2 bg-transparent absolute top-0 w-full z-[999] pointer-events-none">
          <span className="text-xs font-bold text-dark">9:41</span>
          <div className="flex space-x-1.5">
            <div className="w-4 h-3 bg-dark rounded-sm"></div>
            <div className="w-3 h-3 bg-dark rounded-full"></div>
            <div className="w-5 h-3 bg-dark rounded-sm"></div>
          </div>
        </div>

        {/* Routes */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/otp" element={<OtpScreen />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route
                path="/create-delivery"
                element={<CreateDeliveryScreen />} />
              
              <Route path="/estimate" element={<PriceEstimateScreen />} />
              <Route path="/tracking" element={<TrackingScreen />} />
              <Route path="/orders" element={<OrderHistoryScreen />} />
              <Route path="/chat" element={<ChatScreen />} />
              <Route path="/rating" element={<RatingScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/shop-errands" element={<ShopErrandsScreen />} />
              <Route path="/services" element={<ServicesScreen />} />
              <Route path="/create-request" element={<CreateServiceRequestScreen />} />
              <Route path="/runner-signup" element={<RunnerSignupScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>);

};
export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>);

}