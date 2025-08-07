export interface UserProfile {
  address: string;
  totalXP: number;
  tier: 'New User' | 'Verified Collector' | 'Power Owner';
  listingCredits: {
    used: number;
    total: number;
    resetDate: string;
  };
}

export interface RegisteredItem {
  id: string;
  title: string;
  category: string;
  xp: number;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  registrationDate: string;
  imageUrl?: string;
  coOwners: number;
  description?: string;
}

export interface DashboardData {
  user: UserProfile;
  items: RegisteredItem[];
}
