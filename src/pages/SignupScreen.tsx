import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, User, Building2, Bike, Check, Sparkles, ExternalLink, ShieldCheck, Briefcase } from 'lucide-react';
import { getAuthCallbackUrl, isSupabaseConfigured, supabase } from '../lib/supabase';
import { useAppContext } from '../contexts/AppContext';

type AccountType = 'individual' | 'business' | 'runner';

const accountTypes: {
  id: AccountType;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ComponentType<any>;
}[] = [
  {
    id: 'individual',
    title: 'Individual',
    subtitle: 'Send & receive parcels, personal errands',
    badge: 'Customer',
    icon: User,
  },
  {
    id: 'business',
    title: 'Business',
    subtitle: 'Shop owners, corporate errands & deliveries',
    badge: 'Merchant',
    icon: Building2,
  },
  {
    id: 'runner',
    title: 'Runner / Driver',
    subtitle: 'Deliver packages & earn on your schedule',
    badge: 'Partner',
    icon: Bike,
  },
];

const businessCategories = [
  'Retail & Grocery',
  'Restaurant & Fast Food',
  'Pharmacy & Health',
  'Electronics & Tech',
  'E-Commerce & Online Shop',
  'Professional & Corporate Services',
  'Other Business',
];

export const SignupScreen = () => {
  const navigate = useNavigate();
  const { login, createBusinessProfile } = useAppContext();
  const [accountType, setAccountType] = useState<AccountType>('individual');
  
  // Input states
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState(businessCategories[0]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [isSending, setIsSending] = useState(false);

  // Validation rules
  const isEmailValid = email.includes('@');
  const isPhoneValid = phone.length >= 9;
  const isNameValid = name.trim().length >= 2;
  const isBusinessNameValid = businessName.trim().length >= 2;

  // Form valid check per account type
  const isFormValid = accountType === 'runner'
    ? true
    : accountType === 'business'
      ? isBusinessNameValid || (email.length > 0 && isEmailValid)
      : isNameValid && isEmailValid && isPhoneValid;

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. If Runner / Driver account is selected -> redirect to Runner Platform (Port 5175)
    if (accountType === 'runner') {
      const runnerAppBaseUrl = import.meta.env.VITE_RUNNER_APP_URL || 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:5175'
          : 'https://runners.swiftdrop.co.ke');

      const params = new URLSearchParams();
      if (email.trim()) params.append('email', email.trim());
      if (name.trim()) params.append('name', name.trim());
      if (phone.trim()) params.append('phone', phone.trim());

      const queryString = params.toString();
      const targetUrl = queryString ? `${runnerAppBaseUrl}?${queryString}` : runnerAppBaseUrl;
      window.location.href = targetUrl;
      return;
    }

    // 2. If Business account is selected -> Create Corporate Business Profile and go to Business Profile
    if (accountType === 'business') {
      if (!isBusinessNameValid || !isEmailValid || !isPhoneValid) return;
      setIsSending(true);

      try {
        // Register or login corporate user
        await login(email, name || businessName, phone);
        
        // Create corporate business profile
        await createBusinessProfile({
          name: businessName.trim(),
          email: email.trim(),
          phone: `+254${phone.replace(/\D/g, '')}`
        });

        navigate('/business-profile');
      } catch (err) {
        console.error('Failed to create corporate business account:', err);
        const msg = err instanceof Error ? err.message : 'Could not create business profile right now.';
        window.alert(msg);
        navigate('/business-profile');
      } finally {
        setIsSending(false);
      }
      return;
    }

    // 3. Individual customer account signup flow
    if (!isFormValid) return;

    // Check localhost bypass
    const isLocalhost = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1'
    );

    if (isLocalhost) {
      navigate('/home');
      return;
    }

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
          emailRedirectTo: getAuthCallbackUrl(),
          data: {
            name: name.trim(),
            phone: `+254 ${phone}`,
            accountType: 'individual',
            role: 'individual',
          }
        }
      });

      if (error) {
        throw error;
      }

      navigate('/check-email', {
        state: { email, accountType: 'individual' }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not send magic link right now.';

      if (message.toLowerCase().includes('already exists')) {
        window.alert(message);
        navigate('/login', {
          replace: true,
          state: { email }
        });
        return;
      }

      window.alert(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-white px-6 pt-10 pb-6 overflow-y-auto no-scrollbar"
    >
      <div className="flex-1 pb-6">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-1.5 bg-brand/15 text-dark font-bold text-xs px-3 py-1 rounded-full mb-3">
            <Sparkles size={14} className="text-brand-dark" />
            <span>Join SwiftDrop Platform</span>
          </div>
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">
            Select how you would like to use SwiftDrop today
          </p>
        </div>

        {/* Account Type Selection Cards */}
        <div className="space-y-3 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Select Account Type
          </label>
          
          <div className="grid grid-cols-1 gap-2.5">
            {accountTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = accountType === type.id;
              
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setAccountType(type.id)}
                  className={`flex items-center p-3.5 rounded-2xl border-2 text-left transition-all duration-200 relative ${
                    isSelected
                      ? 'border-brand bg-brand/10 shadow-sm ring-2 ring-brand/20'
                      : 'border-gray-100 bg-gray-50 hover:bg-gray-100/80 hover:border-gray-200'
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl mr-3.5 transition-colors ${
                      isSelected ? 'bg-brand text-dark' : 'bg-white text-gray-600 shadow-sm'
                    }`}
                  >
                    <Icon size={22} />
                  </div>
                  
                  <div className="flex-1 pr-6">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-dark text-base">{type.title}</span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-brand-dark text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {type.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">{type.subtitle}</p>
                  </div>

                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-brand bg-brand text-dark'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleContinue} className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={accountType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Business Account Banner & Fields */}
              {accountType === 'business' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100/60 border border-blue-200 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
                      <Briefcase size={18} className="text-blue-600" />
                      <span>SwiftDrop B2B Business Portal</span>
                    </div>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Businesses manage corporate teams, multi-branch dispatch, bulk CSV orders, cost centers, and corporate wallets on our dedicated <strong>Business Portal</strong>.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-dark">Business / Company Name</label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Acme Retailers Ltd"
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3.5 outline-none text-dark font-medium text-sm focus:border-brand transition-colors bg-white"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-dark">Business Industry / Category</label>
                      <select
                        value={businessCategory}
                        onChange={(e) => setBusinessCategory(e.target.value)}
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3.5 outline-none text-dark font-medium text-sm focus:border-brand transition-colors bg-white"
                      >
                        {businessCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-dark">Contact Person Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3.5 outline-none text-dark font-medium text-sm focus:border-brand transition-colors bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-dark">Corporate Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@company.com"
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3.5 outline-none text-dark font-medium text-sm focus:border-brand transition-colors bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-dark">Phone Number</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 font-bold text-sm text-gray-500">
                          +254
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="712 345 678"
                          className="w-full border-2 border-gray-100 rounded-xl pl-16 pr-4 py-3.5 outline-none text-dark font-medium text-sm focus:border-brand transition-colors bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Runner / Driver Notice Banner & Optional Inputs */}
              {accountType === 'runner' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-green-100/60 border border-emerald-200 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                      <ShieldCheck size={18} className="text-emerald-600" />
                      <span>Dedicated Runner & Driver Portal</span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Runners and drivers register & set up their profile on our dedicated <strong>SwiftDrop Partner Platform</strong> to manage earnings, accept tasks, and configure vehicles.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-dark">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 outline-none text-dark font-medium text-sm focus:border-brand transition-colors bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-dark">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 outline-none text-dark font-medium text-sm focus:border-brand transition-colors bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-dark">Phone Number</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 font-bold text-sm text-gray-500">
                          +254
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="712 345 678"
                          className="w-full border-2 border-gray-100 rounded-xl pl-16 pr-4 py-3 outline-none text-dark font-medium text-sm focus:border-brand transition-colors bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Individual Form Fields */}
              {accountType === 'individual' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-dark">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full border-2 border-gray-100 rounded-xl px-4 py-3.5 outline-none text-dark font-medium text-sm focus:border-brand transition-colors bg-white"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-dark">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border-2 border-gray-100 rounded-xl px-4 py-3.5 outline-none text-dark font-medium text-sm focus:border-brand transition-colors bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-dark">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 font-bold text-sm text-gray-500">
                        +254
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="712 345 678"
                        className="w-full border-2 border-gray-100 rounded-xl pl-16 pr-4 py-3.5 outline-none text-dark font-medium text-sm focus:border-brand transition-colors bg-white"
                      />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSending}
            className={`w-full py-4 mt-2 rounded-full font-bold text-base flex justify-center items-center shadow-md transition-all ${
              accountType === 'business'
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
                : accountType === 'runner'
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98]'
                  : isFormValid && !isSending
                    ? 'bg-brand text-dark hover:bg-brand-light active:scale-[0.98]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isSending ? (
              'Creating Account...'
            ) : accountType === 'business' ? (
              <>
                <span>Go to Business Portal</span>
                <ExternalLink size={18} className="ml-2" />
              </>
            ) : accountType === 'runner' ? (
              <>
                <span>Go to Runner & Driver Platform</span>
                <ExternalLink size={18} className="ml-2" />
              </>
            ) : (
              <>
                <span>Create Customer Account</span>
                <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Already have an account? Log In link */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-brand-dark font-bold hover:underline"
            >
              Log In
            </button>
          </p>
        </div>
      </div>

      {/* Terms footer */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-gray-400">
          By continuing, you agree to our{' '}
          <span className="text-brand-dark font-medium cursor-pointer hover:underline">Terms of Service</span>{' '}
          and{' '}
          <span className="text-brand-dark font-medium cursor-pointer hover:underline">Privacy Policy</span>.
        </p>
      </div>
    </motion.div>
  );
};
