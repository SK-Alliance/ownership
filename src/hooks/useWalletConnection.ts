import { useEffect, useRef } from 'react';
import { useAuthState, useConnect, useAuth } from '@campnetwork/origin/react';
import { useWalletAuth } from '@/lib/wallet-auth';

export const useWalletConnection = () => {
  const { authenticated, loading } = useAuthState();
  const auth = useAuth();
  const { disconnect: campDisconnect } = useConnect();
  
  // Try to get real wallet address from multiple sources
  const getWalletAddress = () => {
    if (!authenticated) return undefined;
    
    // Method 1: Try window.ethereum if available
    if (typeof window !== 'undefined' && window.ethereum?.selectedAddress) {
      return window.ethereum.selectedAddress;
    }
    
    // Method 2: Try to get from auth context (if available)
    try {
      if (auth && typeof auth === 'object') {
        // Try different possible property names
        const authObj = auth as any;
        if (authObj.address) return authObj.address;
        if (authObj.account) return authObj.account;
        if (authObj.walletAddress) return authObj.walletAddress;
      }
    } catch (error) {
      // Ignore errors accessing auth properties
    }
    
    // Fallback: Use a consistent demo address for development
    return 'camp-connected-user';
  };
  
  const address = getWalletAddress();
  const isConnected = authenticated;
  const isConnecting = loading;
  const { 
    user, 
    isLoading, 
    error, 
    walletConnected,
    handleWalletConnection, 
    handleWalletDisconnection,
    isWalletProcessed 
  } = useWalletAuth();

  const lastProcessedAddress = useRef<string | null>(null);
  const connectionProcessed = useRef<boolean>(false);

  useEffect(() => {
    const processConnection = async () => {
      // Only process if we have a connected wallet and it's different from last processed
      if (isConnected && address && address !== lastProcessedAddress.current) {
        
        // Skip if this wallet was already processed
        if (isWalletProcessed(address)) {
          console.log(`⚡ Wallet ${address} already processed, skipping`);
          return;
        }

        try {
          await handleWalletConnection(address);
          lastProcessedAddress.current = address;
          connectionProcessed.current = true;
        } catch (error) {
          console.error('Failed to process wallet connection:', error);
        }
      }
    };

    processConnection();
  }, [isConnected, address, handleWalletConnection, isWalletProcessed]);

  useEffect(() => {
    // Handle disconnection
    if (!isConnected && connectionProcessed.current) {
      handleWalletDisconnection();
      lastProcessedAddress.current = null;
      connectionProcessed.current = false;
    }
  }, [isConnected, handleWalletDisconnection]);

  // Manual disconnect function
  const handleDisconnect = async () => {
    await handleWalletDisconnection();
    campDisconnect();
  };

  return {
    // Wallet state
    address,
    isConnected,
    isConnecting,
    
    // User state
    user,
    isLoading: isLoading || isConnecting,
    error,
    walletConnected,
    
    // Actions
    disconnect: handleDisconnect,
    
    // Status helpers
    isAuthenticated: isConnected && walletConnected && !!user,
    isInitializing: isConnecting || (isConnected && isLoading),
  };
};
