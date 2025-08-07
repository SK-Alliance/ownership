export interface ItemDetails {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'registered' | 'verified' | 'rejected';
  estimatedValue?: number;
  currency?: string;
  creatorWallet: string;
  originHash: string;
  registrationDate: string;
  verificationDate?: string;
  coOwners: CoOwner[];
  metadata: ItemMetadata;
  verificationHistory: VerificationEvent[];
}

export interface CoOwner {
  walletAddress: string;
  addedDate: string;
  permissions: string[];
}

export interface ItemMetadata {
  fileType?: string;
  fileSize?: number;
  dimensions?: string;
  resolution?: string;
  duration?: string;
  additionalData: Record<string, unknown>;
}

export interface VerificationEvent {
  id: string;
  type: 'registered' | 'verified' | 'co_owner_added' | 'co_owner_removed' | 'rejected';
  date: string;
  description: string;
  actor?: string;
  details: Record<string, unknown>;
}

// API Response Types (for future backend integration)
export interface GetItemDetailsResponse {
  success: boolean;
  data: ItemDetails | null;
  error?: string;
}

export interface AddCoOwnerRequest {
  itemId: string;
  walletAddress: string;
  permissions: string[];
}

export interface AddCoOwnerResponse {
  success: boolean;
  data?: CoOwner;
  error?: string;
}

export interface DownloadPPDResponse {
  success: boolean;
  downloadUrl?: string;
  error?: string;
}
