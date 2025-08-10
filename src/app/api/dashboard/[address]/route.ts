import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserTier } from '@/data/dashboard';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!address) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Fetch user profile with XP
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('wallet_address, username, full_name, total_xp')
      .eq('wallet_address', address.toLowerCase())
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    // If no profile exists, create a default one
    if (!userProfile) {
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          wallet_address: address.toLowerCase(),
          total_xp: 0
        })
        .select('wallet_address, username, full_name, total_xp')
        .single();

      if (createError) {
        throw createError;
      }

      const dashboardUser = {
        address: address,
        username: newProfile.username || '',
        fullName: newProfile.full_name || '',
        totalXP: 0,
        tier: getUserTier(0),
        listingCredits: {
          used: 0,
          total: 10,
          resetDate: '2025-09-01'
        }
      };

      return NextResponse.json(dashboardUser);
    }

    // Return existing profile
    const dashboardUser = {
      address: address,
      username: userProfile.username || '',
      fullName: userProfile.full_name || '',
      totalXP: userProfile.total_xp || 0,
      tier: getUserTier(userProfile.total_xp || 0),
      listingCredits: {
        used: 3, // This would come from actual data in production
        total: 10,
        resetDate: '2025-09-01'
      }
    };

    return NextResponse.json(dashboardUser);

  } catch (error) {
    console.error('Error fetching dashboard user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user dashboard data' },
      { status: 500 }
    );
  }
}
