import { supabase } from './supabase';

export interface UploadResult {
  url: string;
  path: string;
}

export class StorageService {
  /**
   * Upload file to Supabase storage bucket
   */
  async uploadFile(
    bucket: string,
    file: File,
    path?: string
  ): Promise<UploadResult> {
    try {
      // Generate unique filename if no path provided
      const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
      const filePath = `${fileName}`;

      // Upload file
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error(`Upload error to ${bucket}:`, error);
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        url: publicData.publicUrl,
        path: filePath
      };
    } catch (error) {
      console.error('Storage upload error:', error);
      throw error;
    }
  }

  /**
   * Upload bill document to proofs bucket
   */
  async uploadBillDocument(file: File, userWallet: string): Promise<UploadResult> {
    const path = `bills/${userWallet}/${Date.now()}-${file.name}`;
    return this.uploadFile('proofs', file, path);
  }

  /**
   * Upload ID document to ids bucket
   */
  async uploadIdDocument(file: File, userWallet: string): Promise<UploadResult> {
    const path = `ids/${userWallet}/${Date.now()}-${file.name}`;
    return this.uploadFile('ids', file, path);
  }

  /**
   * Delete file from storage
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error(`Delete error from ${bucket}:`, error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}

export const storageService = new StorageService();
