import { userService } from './database';
import { useUserStore } from './stores/user-store';
import type { Database } from '@/types/database';

type UserRow = Database['public']['Tables']['users']['Row'];

class WalletAuthService {
  private processedWallets = new Set<string>();
  private isProcessing = false;

  async handleWalletConnection(walletAddress: string): Promise<UserRow> {
    // Prevent duplicate processing
    if (this.isProcessing || this.processedWallets.has(walletAddress.toLowerCase())) {
      const existingUser = useUserStore.getState().user;
      if (existingUser && existingUser.wallet_address.toLowerCase() === walletAddress.toLowerCase()) {
        return existingUser;
      }
    }

    this.isProcessing = true;
    const { setLoading, setUser, setError, setWalletConnected } = useUserStore.getState();

    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 Checking user for wallet: ${walletAddress}`);

      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_url_here') {
        console.warn('⚠️ Supabase not configured - creating mock user');
        
        // Create a mock user for development without Supabase
        const mockUser = {
          id: `mock-${Date.now()}`,
          wallet_address: walletAddress,
          display_name: null,
          email: null,
          avatar_url: null,
          xp_points: 100,
          monthly_credits: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as UserRow;
        
        setUser(mockUser);
        this.processedWallets.add(walletAddress.toLowerCase());
        setWalletConnected(true);
        return mockUser;
      }

      // Check if user exists in Supabase
      let user = await userService.getByWallet(walletAddress);

      if (user) {
        console.log(`✅ Existing user found:`, user);
        setUser(user);
      } else {
        console.log(`👤 Creating new user for wallet: ${walletAddress}`);
        
        // Create new user with default values
        user = await userService.create(walletAddress);
        console.log(`🎉 New user created:`, user);
        setUser(user);
      }

      // Mark wallet as processed and connected
      this.processedWallets.add(walletAddress.toLowerCase());
      setWalletConnected(true);

      return user;
    } catch (error) {
      console.error('❌ Error handling wallet connection:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setError(errorMessage);
      
      // Don't throw error to prevent React crash - instead create a fallback user
      console.warn('🔄 Creating fallback user due to connection error');
      const fallbackUser = {
        id: `fallback-${Date.now()}`,
        wallet_address: walletAddress,
        display_name: null,
        email: null,
        avatar_url: null,
        xp_points: 0,
        monthly_credits: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as UserRow;
      
      setUser(fallbackUser);
      this.processedWallets.add(walletAddress.toLowerCase());
      setWalletConnected(true);
      return fallbackUser;
    } finally {
      setLoading(false);
      this.isProcessing = false;
    }
  }

  async handleWalletDisconnection(): Promise<void> {
    const { clearUser } = useUserStore.getState();
    
    console.log('👋 Wallet disconnected - clearing user data');
    clearUser();
    this.processedWallets.clear();
    this.isProcessing = false;
  }

  isWalletProcessed(walletAddress: string): boolean {
    return this.processedWallets.has(walletAddress.toLowerCase());
  }

  // Reset processing state (useful for development)
  resetProcessingState(): void {
    this.processedWallets.clear();
    this.isProcessing = false;
  }
}

// Singleton instance
export const walletAuthService = new WalletAuthService();

// React hook for wallet authentication
export const useWalletAuth = () => {
  const { user, isLoading, error, walletConnected } = useUserStore();

  return {
    user,
    isLoading,
    error,
    walletConnected,
    handleWalletConnection: walletAuthService.handleWalletConnection.bind(walletAuthService),
    handleWalletDisconnection: walletAuthService.handleWalletDisconnection.bind(walletAuthService),
    isWalletProcessed: walletAuthService.isWalletProcessed.bind(walletAuthService),
    resetProcessingState: walletAuthService.resetProcessingState.bind(walletAuthService),
  };
};
