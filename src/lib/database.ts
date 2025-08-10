import { supabase } from './supabase';
import type { Database } from '@/types/database';

type Tables = Database['public']['Tables'];
type UserRow = Tables['users']['Row'];
type ItemRow = Tables['items']['Row'];
type ItemInsert = Tables['items']['Insert'];
type ItemUpdate = Tables['items']['Update'];
type TransactionInsert = Tables['transactions']['Insert'];
type SettingsRow = Tables['settings']['Row'];
type SettingsUpdate = Tables['settings']['Update'];

// User operations
export const userService = {
  async getByWallet(walletAddress: string): Promise<UserRow | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(walletAddress: string, displayName?: string, email?: string): Promise<UserRow> {
    try {
      // Try using the RPC function first
      const { error } = await supabase.rpc('upsert_user', {
        wallet_addr: walletAddress,
        display_name_param: displayName || null,
        email_param: email || null,
      });

      if (error) {
        console.warn('RPC upsert_user failed, falling back to direct insert:', error);
        
        // Fallback: Direct insert with default values
        const { data: insertData, error: insertError } = await supabase
          .from('users')
          .insert({
            wallet_address: walletAddress,
            display_name: displayName || null,
            email: email || null,
            xp_points: 0,
            monthly_credits: 10, // Default credits
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return insertData;
      }

      // Get the created user
      const user = await this.getByWallet(walletAddress);
      if (!user) throw new Error('Failed to create user');
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getStats(walletAddress: string) {
    const { data, error } = await supabase.rpc('get_user_stats', {
      wallet_addr: walletAddress,
    });

    if (error) throw error;
    return data[0];
  },

  async addXP(walletAddress: string, amount: number, reason: string, itemId?: string) {
    const { error } = await supabase.rpc('add_user_xp', {
      user_wallet: walletAddress,
      xp_amount: amount,
      reason,
      item_uuid: itemId || null,
    });

    if (error) throw error;
  },
};

// Item operations
export const itemService = {
  async getByUser(walletAddress: string): Promise<ItemRow[]> {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        owner:users!items_owner_id_fkey(wallet_address, display_name),
        co_owners(
          role,
          added_at,
          user:users!co_owners_co_owner_id_fkey(wallet_address, display_name)
        )
      `)
      .eq('users.wallet_address', walletAddress);

    if (error) throw error;
    return data || [];
  },

  async getCoOwnedByUser(walletAddress: string): Promise<ItemRow[]> {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        owner:users!items_owner_id_fkey(wallet_address, display_name),
        co_owners!inner(
          role,
          added_at,
          user:users!co_owners_co_owner_id_fkey(wallet_address, display_name)
        )
      `)
      .eq('co_owners.user.wallet_address', walletAddress);

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<ItemRow | null> {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        owner:users!items_owner_id_fkey(wallet_address, display_name),
        co_owners(
          role,
          added_at,
          user:users!co_owners_co_owner_id_fkey(wallet_address, display_name)
        )
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(item: ItemInsert): Promise<ItemRow> {
    const { data, error } = await supabase
      .from('items')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: ItemUpdate): Promise<ItemRow> {
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async addCoOwner(
    itemId: string,
    ownerWallet: string,
    coOwnerWallet: string,
    role: 'primary' | 'secondary' | 'viewer' = 'viewer'
  ): Promise<void> {
    const { error } = await supabase.rpc('add_co_owner', {
      item_uuid: itemId,
      owner_wallet: ownerWallet,
      co_owner_wallet: coOwnerWallet,
      role_param: role,
    });

    if (error) throw error;
  },

  async removeCoOwner(itemId: string, coOwnerWallet: string): Promise<void> {
    // Get co-owner user ID
    const user = await userService.getByWallet(coOwnerWallet);
    if (!user) throw new Error('Co-owner not found');

    const { error } = await supabase
      .from('co_owners')
      .delete()
      .eq('item_id', itemId)
      .eq('co_owner_id', user.id);

    if (error) throw error;
  },

  async transfer(
    itemId: string,
    fromWallet: string,
    toWallet: string,
    txHash?: string
  ): Promise<void> {
    const { error } = await supabase.rpc('transfer_item_ownership', {
      item_uuid: itemId,
      from_wallet: fromWallet,
      to_wallet: toWallet,
      tx_hash_param: txHash || null,
    });

    if (error) throw error;
  },
};

// Settings operations
export const settingsService = {
  async getByUser(walletAddress: string): Promise<SettingsRow | null> {
    const { data, error } = await supabase
      .from('settings')
      .select(`
        *,
        user:users!settings_user_id_fkey(wallet_address)
      `)
      .eq('users.wallet_address', walletAddress)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async update(walletAddress: string, updates: Omit<SettingsUpdate, 'user_id'>): Promise<SettingsRow> {
    // Get user first
    const user = await userService.getByWallet(walletAddress);
    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('settings')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Transaction operations
export const transactionService = {
  async getByUser(walletAddress: string): Promise<unknown[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        item:items(title, artifact_id),
        from_owner:users!transactions_from_owner_id_fkey(wallet_address, display_name),
        to_owner:users!transactions_to_owner_id_fkey(wallet_address, display_name)
      `)
      .or(`from_owner.wallet_address.eq.${walletAddress},to_owner.wallet_address.eq.${walletAddress}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(transaction: TransactionInsert): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .insert(transaction);

    if (error) throw error;
  },
};

// XP operations
export const xpService = {
  async getLogsByUser(walletAddress: string): Promise<unknown[]> {
    const { data, error } = await supabase
      .from('xp_logs')
      .select(`
        *,
        item:items(title, artifact_id),
        user:users(wallet_address, display_name)
      `)
      .eq('user.wallet_address', walletAddress)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
