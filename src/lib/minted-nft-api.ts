// Utility functions for interacting with the minted NFTs API
import { StoreMintedNFTRequest } from '@/app/api/nft/store/route';

export type MintedNFTData = StoreMintedNFTRequest;

export interface MintedNFTResponse {
  success: boolean;
  message?: string;
  data?: unknown;
  error?: string;
  details?: string;
}

export interface GetMintedNFTsResponse {
  success: boolean;
  data: MintedNFTData[];
  total: number;
  limit: number;
  offset: number;
  error?: string;
  details?: string;
}

/**
 * Store minted NFT data to the database
 */
export async function storeMintedNFT(nftData: MintedNFTData): Promise<MintedNFTResponse> {
  try {
    const response = await fetch('/api/nft/store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nftData),
    });

    const result: MintedNFTResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to store minted NFT data');
    }

    return result;
  } catch (error) {
    console.error('Error storing minted NFT:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get minted NFTs for a user
 */
export async function getMintedNFTs(
  owner_id: string,
  options?: {
    limit?: number;
    offset?: number;
  }
): Promise<GetMintedNFTsResponse> {
  try {
    const params = new URLSearchParams({
      owner_id,
      limit: (options?.limit || 20).toString(),
      offset: (options?.offset || 0).toString(),
    });

    const response = await fetch(`/api/nft/store?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result: GetMintedNFTsResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to retrieve minted NFTs');
    }

    return result;
  } catch (error) {
    console.error('Error getting minted NFTs:', error);
    return {
      success: false,
      data: [],
      total: 0,
      limit: options?.limit || 20,
      offset: options?.offset || 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Helper function to extract minted NFT data from form data and SDK response
 */
export function prepareMintedNFTData(
  owner_id: string,
  formData: {
    itemName: string;
    model: string;
    manufacturer: string;
    category: string;
    estimatedValue: number;
    description: string;
    image?: File;
  },
  sdkResponse?: {
    token_id?: string;
    contract_address?: string;
    transaction_hash?: string;
    ipfs_metadata_url?: string;
    ipfs_image_url?: string;
  },
  imageUrls?: {
    original_image_url?: string;
    nft_image_url?: string;
  }
): MintedNFTData {
  return {
    owner_id,
    
    // Blockchain data from SDK response
    token_id: sdkResponse?.token_id,
    contract_address: sdkResponse?.contract_address,
    transaction_hash: sdkResponse?.transaction_hash,
    
    // Form data
    item_name: formData.itemName,
    model: formData.model,
    manufacturer: formData.manufacturer,
    category: formData.category,
    estimated_value: formData.estimatedValue,
    description: formData.description,
    
    // File information
    original_image_url: imageUrls?.original_image_url,
    nft_image_url: imageUrls?.nft_image_url,
    image_file_name: formData.image?.name,
    image_file_size: formData.image?.size,
    image_content_type: formData.image?.type,
    
    // IPFS URLs from SDK
    ipfs_metadata_url: sdkResponse?.ipfs_metadata_url,
    ipfs_image_url: sdkResponse?.ipfs_image_url,
    
    // Default values will be set by API
    mint_status: 'completed',
    network: 'Camp Network',
    nft_type: 'Ownership Certificate',
  };
}
