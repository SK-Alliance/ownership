import { useEffect, useRef } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useWalletAuth } from '@/lib/wallet-auth';

export const useWalletConnection = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
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
    disconnect();
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
