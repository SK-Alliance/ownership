import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Auctor-specific utility functions
export const formatXP = (xp: number): string => {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toString();
};

export const getXPLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

export const getXPForNextLevel = (currentXP: number): number => {
  const currentLevel = getXPLevel(currentXP);
  return (currentLevel * 100) - currentXP;
};

export const formatProvenanceId = (id: string): string => {
  return `AUC-${new Date().getFullYear()}-${id.padStart(6, '0')}`;
};

export const truncateAddress = (address: string, chars = 4): string => {
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

// Animation utilities
export const createStaggeredAnimation = (index: number, delay = 100) => ({
  animationDelay: `${index * delay}ms`,
});

// Color utilities for dynamic theming
export const getStatusColor = (status: 'verified' | 'pending' | 'error' | 'disputed') => {
  const colors = {
    verified: 'var(--accent-green)',
    pending: 'var(--accent-gold)', 
    error: 'var(--accent-red)',
    disputed: 'var(--accent-red)',
  };
  return colors[status] || colors.pending;
};

// Validation utilities
export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const isValidTokenId = (tokenId: string): boolean => {
  return /^[0-9]+$/.test(tokenId);
};
