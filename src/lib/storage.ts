import { PinataStorage } from './pinata-storage';

export interface UploadResult {
  url: string;
  hash: string;
}

export class StorageService {
  /**
   * Upload bill document to Pinata IPFS
   */
  async uploadBillDocument(file: File, userWallet: string): Promise<UploadResult> {
    const result = await PinataStorage.uploadDocument(file, userWallet, 'bill');
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to upload bill document');
    }

    return {
      url: result.url,
      hash: result.hash
    };
  }

  /**
   * Upload ID document to Pinata IPFS
   */
  async uploadIdDocument(file: File, userWallet: string): Promise<UploadResult> {
    const result = await PinataStorage.uploadDocument(file, userWallet, 'id');
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to upload ID document');
    }

    return {
      url: result.url,
      hash: result.hash
    };
  }

  /**
   * Delete file from Pinata IPFS
   */
  async deleteFile(ipfsHash: string): Promise<void> {
    const success = await PinataStorage.deleteFile(ipfsHash);
    if (!success) {
      throw new Error('Failed to delete file from IPFS');
    }
  }
}

export const storageService = new StorageService();
