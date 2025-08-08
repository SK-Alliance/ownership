import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Database } from '@/types/database';

type UserRow = Database['public']['Tables']['users']['Row'];

interface UserState {
  user: UserRow | null;
  isLoading: boolean;
  error: string | null;
  walletConnected: boolean;
  
  // Actions
  setUser: (user: UserRow | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setWalletConnected: (connected: boolean) => void;
  updateUserXP: (newXP: number) => void;
  updateUserCredits: (newCredits: number) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      walletConnected: false,

      setUser: (user) => set({ user, error: null }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error, isLoading: false }),
      
      setWalletConnected: (walletConnected) => set({ walletConnected }),
      
      updateUserXP: (newXP) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, xp_points: newXP } });
        }
      },
      
      updateUserCredits: (newCredits) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, monthly_credits: newCredits } });
        }
      },
      
      clearUser: () => set({ 
        user: null, 
        error: null, 
        walletConnected: false,
        isLoading: false 
      }),
    }),
    {
      name: 'auctor-user-storage',
      partialize: (state) => ({ 
        user: state.user,
        walletConnected: state.walletConnected 
      }),
      // Add SSR compatibility
      skipHydration: true,
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useUserStore((state) => state.user);
export const useUserLoading = () => useUserStore((state) => state.isLoading);
export const useUserError = () => useUserStore((state) => state.error);
export const useWalletConnected = () => useUserStore((state) => state.walletConnected);
