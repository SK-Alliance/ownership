'use client';

import { useEffect } from 'react';
import { useAuthState } from '@campnetwork/origin/react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { setAuthCookie, clearAuthCookies } from '@/lib/auth-cookies';

// Component that manages auth cookies for middleware
export const AuthCookieManager = () => {
  const { authenticated } = useAuthState();
  const { address, isConnected } = useWalletConnection();

  useEffect(() => {
    // Set or clear cookies based on authentication state
    if (authenticated && isConnected && address) {
      setAuthCookie(true, address);
    } else {
      clearAuthCookies();
    }
  }, [authenticated, isConnected, address]);

  // This component doesn't render anything
  return null;
};
