'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthState } from '@campnetwork/origin/react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { authenticated, loading } = useAuthState();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Don't redirect while still loading authentication state
    if (loading) return;

    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/profile', '/register', '/settings', '/item'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
    // If user is authenticated and on home page, redirect to dashboard
    if (authenticated && pathname === '/') {
      setIsRedirecting(true);
      router.push('/dashboard');
      return;
    }
    
    // If user is not authenticated and trying to access protected routes, redirect to home
    if (!authenticated && isProtectedRoute) {
      setIsRedirecting(true);
      router.push('/');
      return;
    }
    
    // Reset redirecting state if no redirect is needed
    setIsRedirecting(false);
  }, [authenticated, loading, pathname, router]);

  // Show loading state while checking authentication or redirecting
  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F10]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-green-500/20"></div>
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-green-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-white/80 font-medium">
            {loading ? 'Checking authentication...' : 'Redirecting...'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
