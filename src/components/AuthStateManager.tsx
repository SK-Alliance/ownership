'use client';

import { useEffect } from 'react';
import { useAuthState } from '@campnetwork/origin/react';
import { clearUserSessionCookies } from '@/lib/auth-cookies';

/**
 * Component that listens to Camp Network authentication state changes
 * and automatically clears session cookies when the wallet is disconnected
 */
export const AuthStateManager: React.FC = () => {
  const { authenticated, loading } = useAuthState();

  useEffect(() => {
    // Only clear cookies if we're not loading and user is not authenticated
    // This prevents clearing cookies during initial load
    if (!loading && !authenticated) {
      console.log('🔒 Wallet disconnected - clearing session cookies');
      clearUserSessionCookies();
    }
  }, [authenticated, loading]);

  useEffect(() => {
    if (authenticated) {
      console.log('🔓 Wallet connected - user authenticated');
    }
  }, [authenticated]);

  // This component doesn't render anything, it just manages state
  return null;
};
