import { DashboardData, UserProfile, RegisteredItem } from '@/types/dashboard';

// Helper function to determine user tier based on XP
export const getUserTier = (xp: number): UserProfile['tier'] => {
  if (xp > 50) return 'Power Owner';
  if (xp > 20) return 'Verified Collector';
  return 'New User';
};

// Helper function to get tier color
export const getTierColor = (tier: UserProfile['tier']): string => {
  switch (tier) {
    case 'Power Owner':
      return 'bg-gradient-to-r from-gold to-yellow-400';
    case 'Verified Collector':
      return 'bg-gradient-to-r from-green to-emerald-400';
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-600';
  }
};

// Helper function to get verification status color
export const getStatusColor = (status: RegisteredItem['verificationStatus']): string => {
  switch (status) {
    case 'verified':
      return 'bg-green';
    case 'pending':
      return 'bg-yellow-500';
    case 'rejected':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// Dummy data for dashboard
export const dummyDashboardData: DashboardData = {
  user: {
    address: '0x742d35Cc6534C0532925a3b8D40645857f15739e',
    totalXP: 75,
    tier: getUserTier(75),
    listingCredits: {
      used: 3,
      total: 10,
      resetDate: '2025-09-01'
    }
  },
  items: [
    {
      id: '1',
      title: 'Digital Art Collection #001',
      category: 'Digital Art',
      xp: 25,
      verificationStatus: 'verified',
      registrationDate: '2025-07-15',
      coOwners: 2,
      description: 'Abstract digital artwork featuring vibrant colors and geometric patterns.'
    },
    {
      id: '2',
      title: 'Music Album: "Ethereal Beats"',
      category: 'Music',
      xp: 30,
      verificationStatus: 'verified',
      registrationDate: '2025-07-10',
      coOwners: 1,
      description: 'Electronic music album with 12 tracks of ambient and experimental sounds.'
    },
    {
      id: '3',
      title: 'Photography Series: Urban Landscapes',
      category: 'Photography',
      xp: 20,
      verificationStatus: 'pending',
      registrationDate: '2025-08-01',
      coOwners: 0,
      description: 'A collection of black and white photographs capturing urban architecture.'
    },
    {
      id: '4',
      title: 'Short Film: "The Journey"',
      category: 'Video',
      xp: 0,
      verificationStatus: 'rejected',
      registrationDate: '2025-07-28',
      coOwners: 3,
      description: 'A 15-minute narrative short film about personal growth and discovery.'
    },
    {
      id: '5',
      title: 'Logo Design for Tech Startup',
      category: 'Design',
      xp: 15,
      verificationStatus: 'verified',
      registrationDate: '2025-07-20',
      coOwners: 0,
      description: 'Modern minimalist logo design created for emerging technology company.'
    },
    {
      id: '6',
      title: 'Poetry Collection: "Digital Dreams"',
      category: 'Literature',
      xp: 10,
      verificationStatus: 'pending',
      registrationDate: '2025-08-03',
      coOwners: 1,
      description: 'A collection of 20 poems exploring themes of technology and human connection.'
    }
  ]
};
