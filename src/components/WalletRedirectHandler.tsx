'use client';

import { useWalletRedirect } from '@/hooks/useWalletRedirect';

export function WalletRedirectHandler() {
  useWalletRedirect();
  return null;
}
