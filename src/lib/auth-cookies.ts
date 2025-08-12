// Helper functions for managing authentication state in cookies
// This works with the middleware to control route access

export const setAuthCookie = (isAuthenticated: boolean, walletAddress?: string) => {
  if (typeof document === 'undefined') return;
  
  if (isAuthenticated && walletAddress) {
    // Set auth cookie
    document.cookie = `camp-auth=true; path=/; max-age=86400; samesite=strict`;
    document.cookie = `camp-wallet=${walletAddress}; path=/; max-age=86400; samesite=strict`;
    document.cookie = `camp-session=${Date.now()}; path=/; max-age=86400; samesite=strict`;
  } else {
    // Clear auth cookies
    document.cookie = 'camp-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'camp-wallet=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'camp-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

export const clearAuthCookies = () => {
  setAuthCookie(false);
};

export const getAuthCookie = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  return document.cookie
    .split(';')
    .some(cookie => cookie.trim().startsWith('camp-auth=true'));
};

export const getWalletFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookie = document.cookie
    .split(';')
    .find(cookie => cookie.trim().startsWith('camp-wallet='));
    
  return cookie ? cookie.split('=')[1] : null;
};
