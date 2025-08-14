import { supabase } from './supabase';
import { storageService } from './storage';
import { userService } from './database';
import type { Database } from '@/types/database';

type ItemRow = Database['public']['Tables']['items']['Row'];

export interface RegisterItemParams {
  title: string;
  category: string;
  est_value?: number;
  billFile: File;
  idFile: File;
  serialNumber?: string;
}

export interface RegisterItemResult {
  success: boolean;
  item?: ItemRow;
  error?: string;
}

export class ItemRegistrationService {
  /**
   * Register a new item with bill and ID document uploads
   */
  async registerItem(
    params: RegisterItemParams,
    userWallet: string
  ): Promise<RegisterItemResult> {
    try {
      console.log('🚀 Starting item registration for:', params.title);

      // 1. Get current user
      const user = await userService.getByWallet(userWallet);
      if (!user) {
        throw new Error('User not found. Please connect your wallet first.');
      }

      // 2. Upload bill file to "proofs" bucket
      console.log('📄 Uploading bill document...');
      const billUpload = await storageService.uploadBillDocument(params.billFile, userWallet);
      
      // 3. Upload ID file to "ids" bucket  
      console.log('🆔 Uploading ID document...');
      const idUpload = await storageService.uploadIdDocument(params.idFile, userWallet);

      // 4. Generate unique artifact ID
      const artifactId = `artifact_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      // 5. Insert into items table
      console.log('💾 Creating item record in database...');
      const { data: item, error: insertError } = await supabase
        .from('items')
        .insert({
          owner_id: user.id,
          artifact_id: artifactId,
          title: params.title,
          category: params.category,
          estimated_value: params.est_value || null,
          serial_number: params.serialNumber || null,
          verification_status: 'pending' as const,
          proof_document_url: billUpload.url, // Keep for backward compatibility
          bill_url: billUpload.url,
          id_url: idUpload.url,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        // Cleanup uploaded files on database error
        try {
          if (billUpload.path) {
            await storageService.deleteFile('proofs', billUpload.path);
          }
          if (idUpload.path) {
            await storageService.deleteFile('ids', idUpload.path);
          }
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError);
        }
        throw new Error(`Failed to save item: ${insertError.message}`);
      }

      // 6. Award XP for successful registration
      try {
        await userService.addXP(userWallet, 50, 'Item registered', item.id);
        console.log('🎉 XP awarded for item registration');
      } catch (xpError) {
        console.warn('XP award failed:', xpError);
        // Don't fail the registration for XP errors
      }

      console.log('✅ Item registration completed successfully:', item.id);

      return {
        success: true,
        item: item as ItemRow
      };

    } catch (error) {
      console.error('❌ Item registration failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get all items for a user
   */
  async getUserItems(userWallet: string): Promise<ItemRow[]> {
    try {
      const user = await userService.getByWallet(userWallet);
      if (!user) return [];

      const { data: items, error } = await supabase
        .from('items')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return items || [];
    } catch (error) {
      console.error('Failed to fetch user items:', error);
      return [];
    }
  }

  /**
   * Get item by ID (with ownership/co-ownership check)
   */
  async getItemById(itemId: string, userWallet: string): Promise<ItemRow | null> {
    try {
      const user = await userService.getByWallet(userWallet);
      if (!user) return null;

      // Check if user owns or co-owns the item
      const { data: item, error } = await supabase
        .from('items')
        .select(`
          *,
          co_owners(co_owner_id)
        `)
        .eq('id', itemId)
        .single();

      if (error) throw error;
      if (!item) return null;

      // Check ownership
      const isOwner = item.owner_id === user.id;
      const coOwnersData = item as unknown as { co_owners?: Array<{ co_owner_id: string }> };
      const isCoOwner = coOwnersData.co_owners?.some((co) => co.co_owner_id === user.id);

      if (!isOwner && !isCoOwner) {
        throw new Error('Unauthorized: You do not have access to this item');
      }

      return item as ItemRow;
    } catch (error) {
      console.error('Failed to fetch item:', error);
      return null;
    }
  }

  /**
   * Update item verification status (admin function)
   */
  async updateVerificationStatus(
    itemId: string,
    status: 'pending' | 'verified' | 'rejected'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('items')
        .update({ verification_status: status })
        .eq('id', itemId);

      if (error) throw error;

      // Award XP for successful verification
      if (status === 'verified') {
        const { data: item } = await supabase
          .from('items')
          .select('owner_id, users(wallet_address)')
          .eq('id', itemId)
          .single();

        if (item) {
          const itemData = item as unknown as { users?: { wallet_address: string } };
          if (itemData.users?.wallet_address) {
            await userService.addXP(
              itemData.users.wallet_address, 
              100, 
              'Item verified', 
              itemId
            );
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to update verification status:', error);
      return false;
    }
  }
}

export const itemRegistrationService = new ItemRegistrationService();
