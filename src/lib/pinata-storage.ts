import { pinata } from './pinata';

export interface UploadResult {
  url: string;
  hash: string;
  success: boolean;
  error?: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export class PinataStorage {
  /**
   * Upload image file to Pinata IPFS
   */
  static async uploadImage(file: File, itemId: string): Promise<UploadResult> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${itemId}-${Date.now()}.${fileExt}`;

      // Upload to Pinata IPFS
      const upload = await pinata.upload.file(file).addMetadata({
        name: fileName,
        keyValues: {
          type: 'nft-image',
          itemId: itemId,
          originalName: file.name
        }
      });

      return {
        url: `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`,
        hash: upload.IpfsHash,
        success: true
      };

    } catch (error) {
      console.error('Pinata image upload error:', error);
      return {
        url: '',
        hash: '',
        success: false,
        error: error instanceof Error ? error.message : 'Image upload failed'
      };
    }
  }

  /**
   * Upload NFT metadata JSON to Pinata IPFS
   */
  static async uploadMetadata(metadata: NFTMetadata, itemId: string): Promise<UploadResult> {
    try {
      const fileName = `${itemId}-metadata-${Date.now()}.json`;

      // Upload metadata JSON to Pinata
      const upload = await pinata.upload.json(metadata).addMetadata({
        name: fileName,
        keyValues: {
          type: 'nft-metadata',
          itemId: itemId
        }
      });

      return {
        url: `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`,
        hash: upload.IpfsHash,
        success: true
      };

    } catch (error) {
      console.error('Pinata metadata upload error:', error);
      return {
        url: '',
        hash: '',
        success: false,
        error: error instanceof Error ? error.message : 'Metadata upload failed'
      };
    }
  }

  /**
   * Upload document file (bills, IDs) to Pinata IPFS
   */
  static async uploadDocument(
    file: File, 
    userWallet: string, 
    documentType: 'bill' | 'id'
  ): Promise<UploadResult> {
    try {
      const fileName = `${documentType}-${userWallet}-${Date.now()}-${file.name}`;

      // Upload document to Pinata
      const upload = await pinata.upload.file(file).addMetadata({
        name: fileName,
        keyValues: {
          type: `document-${documentType}`,
          userWallet: userWallet,
          originalName: file.name
        }
      });

      return {
        url: `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`,
        hash: upload.IpfsHash,
        success: true
      };

    } catch (error) {
      console.error('Pinata document upload error:', error);
      return {
        url: '',
        hash: '',
        success: false,
        error: error instanceof Error ? error.message : 'Document upload failed'
      };
    }
  }

  /**
   * Create complete NFT metadata object
   */
  static createNFTMetadata(
    itemData: {
      title: string;
      brand: string;
      category: string;
      serialNumber: string;
      est_value?: number;
    },
    imageUrl: string,
    ownerAddress: string
  ): NFTMetadata {
    return {
      name: `${itemData.title} - Ownership Certificate`,
      description: `Digital ownership proof for ${itemData.title} by ${itemData.brand}. Serial: ${itemData.serialNumber}`,
      image: imageUrl,
      external_url: `https://camp-origin-ownership.vercel.app/item/${itemData.serialNumber}`,
      attributes: [
        {
          trait_type: 'Item Category',
          value: itemData.category
        },
        {
          trait_type: 'Brand',
          value: itemData.brand
        },
        {
          trait_type: 'Serial Number',
          value: itemData.serialNumber
        },
        {
          trait_type: 'Registration Date',
          value: new Date().toISOString()
        },
        {
          trait_type: 'Owner Address',
          value: ownerAddress
        },
        ...(itemData.est_value && itemData.est_value > 0 ? [{
          trait_type: 'Estimated Value USD',
          value: itemData.est_value.toString()
        }] : [])
      ]
    };
  }

  /**
   * Complete upload process: image + metadata to IPFS
   */
  static async uploadComplete(
    file: File,
    itemData: {
      title: string;
      brand: string;
      category: string;
      serialNumber: string;
      est_value?: number;
    },
    ownerAddress: string
  ): Promise<{ imageUrl: string; imageHash: string; metadataUrl: string; metadataHash: string; success: boolean; error?: string }> {
    try {
      const itemId = itemData.serialNumber.replace(/[^a-zA-Z0-9]/g, '-');

      // Upload image first to IPFS
      const imageResult = await this.uploadImage(file, itemId);
      if (!imageResult.success) {
        return {
          imageUrl: '',
          imageHash: '',
          metadataUrl: '',
          metadataHash: '',
          success: false,
          error: `Image upload failed: ${imageResult.error}`
        };
      }

      // Create and upload metadata to IPFS
      const metadata = this.createNFTMetadata(itemData, imageResult.url, ownerAddress);
      const metadataResult = await this.uploadMetadata(metadata, itemId);
      
      if (!metadataResult.success) {
        return {
          imageUrl: imageResult.url,
          imageHash: imageResult.hash,
          metadataUrl: '',
          metadataHash: '',
          success: false,
          error: `Metadata upload failed: ${metadataResult.error}`
        };
      }

      return {
        imageUrl: imageResult.url,
        imageHash: imageResult.hash,
        metadataUrl: metadataResult.url,
        metadataHash: metadataResult.hash,
        success: true
      };

    } catch (error) {
      return {
        imageUrl: '',
        imageHash: '',
        metadataUrl: '',
        metadataHash: '',
        success: false,
        error: error instanceof Error ? error.message : 'Complete upload failed'
      };
    }
  }

  /**
   * Delete/unpin file from Pinata IPFS (if needed)
   */
  static async deleteFile(ipfsHash: string): Promise<boolean> {
    try {
      await pinata.unpin([ipfsHash]);
      return true;
    } catch (error) {
      console.error('Pinata delete error:', error);
      return false;
    }
  }
}