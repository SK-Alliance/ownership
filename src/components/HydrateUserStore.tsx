'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/lib/stores/user-store';

export const HydrateUserStore = () => {
  useEffect(() => {
    // Rehydrate the store on client side
    useUserStore.persist.rehydrate();
  }, []);

  return null;
};
