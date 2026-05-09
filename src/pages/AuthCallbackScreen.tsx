import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { apiRequest } from '../lib/api';

/**
 * Handles the Supabase magic link callback
 * This page is visited when user clicks the magic link in their email
 * The URL contains the session hash that Supabase uses for authentication
 */
export const AuthCallbackScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      if (!isSupabaseConfigured || !supabase) {
        window.alert('Supabase is not configured');
        navigate('/login');
        return;
      }

      try {
        // Supabase automatically processes the hash fragment from the magic link
        // Give it a moment to establish the session
        await new Promise(resolve => setTimeout(resolve, 100));

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          throw new Error(error?.message || 'Failed to verify magic link');
        }

        // User email is guaranteed from Supabase auth
        const userMetadata = user.user_metadata || {};

        // Sync user to backend database
        try {
          await apiRequest('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
              email: user.email,
              name: userMetadata.name || 'New User',
              phone: userMetadata.phone,
              avatar: userMetadata.avatar || null
            })
          });
        } catch (error) {
          // User might already exist from a previous signup attempt
          // This is okay - they can still proceed with verified flag
          console.warn('Could not create user in database:', error);
        }

        sessionStorage.setItem('swiftdrop_magic_link_verified', 'true');

        // Clear any pending auth from sessionStorage
        sessionStorage.removeItem('swiftdrop_pending_auth');

        const isRunnerSignup = Boolean(userMetadata.isRunner);

        // Wait for React to process the state update before navigating
        // This ensures the ProtectedRoute sees the updated user context
        await new Promise(resolve => setTimeout(resolve, 50));

        // Redirect to runner onboarding or home
        navigate(isRunnerSignup ? '/runner-signup' : '/home', { replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        window.alert(error instanceof Error ? error.message : 'Authentication failed');
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

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
