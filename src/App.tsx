import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './contexts/AppContext';
import { BottomNav } from './components/BottomNav';
import { useAppContext } from './contexts/AppContext';
// Pages
import { SplashScreen } from './pages/SplashScreen';
import { LoginScreen } from './pages/LoginScreen';
import { OtpScreen } from './pages/OtpScreen';
import { SignupScreen } from './pages/SignupScreen';
import { AuthCallbackScreen } from './pages/AuthCallbackScreen';
import { CheckEmailScreen } from './pages/CheckEmailScreen';
import { HomeScreen } from './pages/HomeScreen';
import { CreateDeliveryScreen } from './pages/CreateDeliveryScreen';
import { PriceEstimateScreen } from './pages/PriceEstimateScreen';
import { TrackingScreen } from './pages/TrackingScreen';
import { OrderHistoryScreen } from './pages/OrderHistoryScreen';
import { ChatScreen } from './pages/ChatScreen';
import { RatingScreen } from './pages/RatingScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { EditProfileScreen } from './pages/EditProfileScreen';
import { AddressesScreen } from './pages/AddressesScreen';
import { PaymentMethodsScreen } from './pages/PaymentMethodsScreen';
import { NotificationsScreen } from './pages/NotificationsScreen';
import { HelpSupportScreen } from './pages/HelpSupportScreen';
import { AboutScreen } from './pages/AboutScreen';
import { ShopErrandsScreen } from './pages/ShopErrandsScreen';
import { ServicesScreen } from './pages/ServicesScreen';
import { CreateServiceRequestScreen } from './pages/CreateServiceRequestScreen';
import { RunnerSignupScreen } from './pages/RunnerSignupScreen';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, isHydrating } = useAppContext();
  const location = useLocation();
  const verifiedMagicLink = sessionStorage.getItem('swiftdrop_magic_link_verified') === 'true';

  if (isHydrating) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-gray-500">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user && !verifiedMagicLink) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

const AppContent = () => {
  const { user } = useAppContext();
  const verifiedMagicLink = sessionStorage.getItem('swiftdrop_magic_link_verified') === 'true';
  const canAccessApp = Boolean(user || verifiedMagicLink);
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
              <Route path="/auth/callback" element={<AuthCallbackScreen />} />
              <Route path="/check-email" element={<CheckEmailScreen />} />
              <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
              <Route path="/create-delivery" element={<ProtectedRoute><CreateDeliveryScreen /></ProtectedRoute>} />
              <Route path="/estimate" element={<ProtectedRoute><PriceEstimateScreen /></ProtectedRoute>} />
              <Route path="/tracking" element={<ProtectedRoute><TrackingScreen /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrderHistoryScreen /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><ChatScreen /></ProtectedRoute>} />
              <Route path="/rating" element={<ProtectedRoute><RatingScreen /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
              <Route path="/edit-profile" element={<ProtectedRoute><EditProfileScreen /></ProtectedRoute>} />
              <Route path="/addresses" element={<ProtectedRoute><AddressesScreen /></ProtectedRoute>} />
              <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethodsScreen /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />
              <Route path="/help-support" element={<ProtectedRoute><HelpSupportScreen /></ProtectedRoute>} />
              <Route path="/about" element={<ProtectedRoute><AboutScreen /></ProtectedRoute>} />
              <Route path="/shop-errands" element={<ProtectedRoute><ShopErrandsScreen /></ProtectedRoute>} />
              <Route path="/services" element={<ProtectedRoute><ServicesScreen /></ProtectedRoute>} />
              <Route path="/create-request" element={<ProtectedRoute><CreateServiceRequestScreen /></ProtectedRoute>} />
              <Route path="/runner-signup" element={<ProtectedRoute><RunnerSignupScreen /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        {canAccessApp ? <BottomNav /> : null}
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