import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

/**
 * Handles the Supabase magic link callback
 * This page is visited when user clicks the magic link in their email
 * The URL contains the session hash that Supabase uses for authentication
 */
export const AuthCallbackScreen = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();

  useEffect(() => {
    const handleCallback = async () => {
      if (!isSupabaseConfigured || !supabase) {
        window.alert('Supabase is not configured');
        navigate('/login');
        return;
      }

      try {
        const authCode = new URLSearchParams(window.location.search).get('code');

        const { data: exchangeData, error: exchangeError } = authCode
          ? await supabase.auth.exchangeCodeForSession(authCode)
          : { data: { session: null, user: null }, error: null };

        const user = exchangeData.session?.user ?? exchangeData.user;
        const error = exchangeError;

        if (error || !user) {
          throw new Error(error?.message || 'Failed to verify magic link');
        }

        // User email is guaranteed from Supabase auth
        const email = user.email || '';
        const userMetadata = user.user_metadata || {};
        const name = userMetadata.name as string | undefined;
        const phone = userMetadata.phone as string | undefined;

        // Log in via backend
        try {
          await login(email, name, phone);
        } catch (e) {
          // If backend login fails, still navigate to home
          // The user is authenticated with Supabase at least
          console.warn('Backend login failed:', e);
        }

        // Clear any pending auth from sessionStorage
        sessionStorage.removeItem('swiftdrop_pending_auth');

        const isRunnerSignup = Boolean(userMetadata.isRunner);

        // Redirect to runner onboarding or home
        navigate(isRunnerSignup ? '/runner-signup' : '/home', { replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        window.alert(error instanceof Error ? error.message : 'Authentication failed');
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, login]);

  return (
    <div className="flex flex-col h-full bg-white px-6 pt-12 pb-8 justify-center items-center">
      <div className="space-y-4 text-center">
        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-primary/10">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-2xl font-bold text-dark">Verifying...</h1>
        <p className="text-gray-500">
          Signing you in. One moment please.
        </p>
      </div>
    </div>
  );
};
