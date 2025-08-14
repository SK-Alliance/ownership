'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthState } from '@campnetwork/origin/react';
import { useWalletConnection } from '@/hooks/useWalletConnection';

// Component that handles redirects after authentication
export const RedirectHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authenticated } = useAuthState();
  const { isConnected, address } = useWalletConnection();
  
  useEffect(() => {
    // Only handle redirects when user is authenticated
    if (authenticated && isConnected && address) {
      const redirectTo = searchParams.get('redirect');
      
      if (redirectTo) {
        // Redirect to the originally requested page
        router.replace(redirectTo);
      } else {
        // Default redirect to profile page
        router.replace('/profile');
      }
    }
  }, [authenticated, isConnected, address, searchParams, router]);

  return null;
};
