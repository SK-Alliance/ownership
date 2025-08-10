'use client';

import { useAuthState } from '@campnetwork/origin/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function useWalletRedirect() {
  const { authenticated, loading } = useAuthState();
  // TODO: Get actual address from Camp Network SDK  
  const address = authenticated ? 'camp-connected-user' : undefined;
  const isConnected = authenticated;
  const isConnecting = loading;
  const router = useRouter();
  const pathname = usePathname();
  const previousConnected = useRef(false);
  const hasCheckedProfile = useRef(false);

  useEffect(() => {
    // Reset when wallet disconnects
    if (!isConnected) {
      previousConnected.current = false;
      hasCheckedProfile.current = false;
      return;
    }

    // Skip if still connecting
    if (isConnecting) return;

    // Skip if wallet was already connected (avoid redirects on page navigation)
    if (previousConnected.current) return;

    // Mark as connected
    previousConnected.current = true;

    // Skip if already on profile page
    if (pathname === '/profile') return;

    // Skip if on home page (let users stay on landing)
    if (pathname === '/') return;

    // Skip redirect for specific protected pages that users should complete first
    const protectedPages = ['/register'];
    if (protectedPages.includes(pathname)) return;

    // For new wallet connection, check if user needs to complete profile
    const checkAndRedirectToProfile = async () => {
      if (!address || hasCheckedProfile.current) return;
      
      hasCheckedProfile.current = true;

      try {
        const response = await fetch(`/api/profile/${address}`);
        
        if (response.status === 404) {
          // New user - redirect to profile
          router.push('/profile');
        } else if (response.ok) {
          const profileData = await response.json();
          
          // Check if profile is incomplete
          const hasCompleteProfile = profileData.username || profileData.fullName || profileData.email;
          
          if (!hasCompleteProfile) {
            // Profile exists but incomplete - redirect to profile
            router.push('/profile');
          }
          // If profile is complete, let user stay on current page
        }
        // On error, don't redirect
      } catch (error) {
        console.error('Error checking profile:', error);
        // On error, don't redirect
      }
    };

    // Small delay to ensure wallet connection is fully established
    const timeoutId = setTimeout(checkAndRedirectToProfile, 500);
    return () => clearTimeout(timeoutId);
  }, [isConnected, isConnecting, address, pathname, router]);

  return { isConnected, address };
}
