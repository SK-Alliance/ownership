// User management functions for client-side operations
export interface UserData {
  id: string;
  wallet_address: string;
  display_name?: string;
  email?: string;
  xp_points?: number;
  monthly_credits?: number;
}

export interface GetOrCreateUserResponse {
  success: boolean;
  user_id?: string;
  user?: UserData;
  created?: boolean;
  error?: string;
}

/**
 * Get or create a user in the database based on wallet address
 * Returns the user ID that can be used for foreign key relationships
 */
export async function getOrCreateUser(walletAddress: string, userData?: {
  display_name?: string;
  email?: string;
}): Promise<{ success: boolean; user_id?: string; error?: string }> {
  try {
    if (!walletAddress) {
      return { success: false, error: 'Wallet address is required' };
    }

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet_address: walletAddress,
        display_name: userData?.display_name,
        email: userData?.email,
      }),
    });

    const result: { success: boolean; data?: { user_id: string; user: UserData; created: boolean }; error?: string } = await response.json();

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to get or create user' };
    }

    return { 
      success: true, 
      user_id: result.data?.user_id 
    };

  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get user by wallet address
 */
export async function getUserByWalletAddress(walletAddress: string): Promise<{
  success: boolean;
  user?: UserData;
  error?: string;
}> {
  try {
    if (!walletAddress) {
      return { success: false, error: 'Wallet address is required' };
    }

    const response = await fetch(`/api/users?wallet_address=${encodeURIComponent(walletAddress)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result: { success: boolean; data?: { user: UserData }; error?: string } = await response.json();

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to fetch user' };
    }

    return { 
      success: true, 
      user: result.data?.user 
    };

  } catch (error) {
    console.error('Error in getUserByWalletAddress:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
