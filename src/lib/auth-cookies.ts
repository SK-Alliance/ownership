// Helper functions for managing authentication state in cookies
// This works with the middleware to control route access

export interface UserSessionData {
  username: string;
  fullName: string;
  email: string;
  walletAddress: string;
}

// Cookie configuration
const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 86400, // 24 hours
  sameSite: 'strict' as const,
};

// Helper function to set a cookie safely
const setCookie = (name: string, value: string, options = COOKIE_OPTIONS) => {
  if (typeof document === 'undefined') return;
  
  const encodedValue = encodeURIComponent(value);
  const optionsStr = `path=${options.path}; max-age=${options.maxAge}; samesite=${options.sameSite}`;
  document.cookie = `${name}=${encodedValue}; ${optionsStr}`;
};

// Helper function to get a cookie value safely
const getCookie = (name: string): string => {
  if (typeof document === 'undefined') return '';
  
  try {
    const cookie = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith(`${name}=`));
    
    if (cookie) {
      const value = cookie.split('=')[1];
      return decodeURIComponent(value || '');
    }
    return '';
  } catch (error) {
    console.warn(`Error reading cookie ${name}:`, error);
    return '';
  }
};

// Helper function to clear a cookie
const clearCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

// ===== AUTH COOKIES (Existing functions) =====
export const setAuthCookie = (isAuthenticated: boolean, walletAddress?: string) => {
  if (typeof document === 'undefined') return;
  
  if (isAuthenticated && walletAddress) {
    // Set auth cookie
    setCookie('camp-auth', 'true');
    setCookie('camp-wallet', walletAddress);
    setCookie('camp-session', Date.now().toString());
  } else {
    // Clear auth cookies
    clearCookie('camp-auth');
    clearCookie('camp-wallet');
    clearCookie('camp-session');
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

// ===== USER SESSION COOKIES (New functions) =====

/**
 * Store user session data in cookies
 * @param userData - User profile data to store
 */
export const setUserSessionCookies = (userData: UserSessionData): void => {
  try {
    setCookie('camp-username', userData.username || '');
    setCookie('camp-display-name', userData.fullName || '');
    setCookie('camp-email', userData.email || '');
    setCookie('camp-wallet-address', userData.walletAddress || '');
    
    // Set a timestamp for when the session was created
    setCookie('camp-session-created', Date.now().toString());
    
    console.log('✅ User session cookies stored successfully');
  } catch (error) {
    console.error('❌ Error setting user session cookies:', error);
  }
};

/**
 * Retrieve user session data from cookies
 * @returns UserSessionData object with empty strings as fallbacks
 */
export const getUserSessionCookies = (): UserSessionData => {
  try {
    return {
      username: getCookie('camp-username'),
      fullName: getCookie('camp-display-name'),
      email: getCookie('camp-email'),
      walletAddress: getCookie('camp-wallet-address'),
    };
  } catch (error) {
    console.warn('Error reading user session cookies:', error);
    return {
      username: '',
      fullName: '',
      email: '',
      walletAddress: '',
    };
  }
};

/**
 * Clear all user session cookies
 */
export const clearUserSessionCookies = (): void => {
  try {
    clearCookie('camp-username');
    clearCookie('camp-display-name');
    clearCookie('camp-email');
    clearCookie('camp-wallet-address');
    clearCookie('camp-session-created');
    
    console.log('✅ User session cookies cleared');
  } catch (error) {
    console.error('❌ Error clearing user session cookies:', error);
  }
};

/**
 * Check if user session cookies exist and are valid
 * @returns boolean indicating if session is valid
 */
export const isUserSessionValid = (): boolean => {
  try {
    const sessionData = getUserSessionCookies();
    
    // Check if we have essential data
    const hasEssentialData = Boolean(sessionData.walletAddress && 
                                   (sessionData.username || sessionData.fullName));
    
    // Check if session is not too old (optional - currently disabled)
    // const sessionAge = Date.now() - parseInt(sessionCreated || '0');
    // const isNotExpired = sessionAge < COOKIE_OPTIONS.maxAge * 1000;
    
    return hasEssentialData;
  } catch (error) {
    console.warn('Error validating user session:', error);
    return false;
  }
};

/**
 * Update specific user session data
 * @param updates - Partial user data to update
 */
export const updateUserSessionCookies = (updates: Partial<UserSessionData>): void => {
  try {
    const currentData = getUserSessionCookies();
    const updatedData = { ...currentData, ...updates };
    setUserSessionCookies(updatedData);
    
    console.log('✅ User session cookies updated');
  } catch (error) {
    console.error('❌ Error updating user session cookies:', error);
  }
};
