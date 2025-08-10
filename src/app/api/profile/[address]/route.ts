//this api shows the user information from the db

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await params;

    if (!address) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Get user profile from database
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('wallet_address', address.toLowerCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile not found
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({
      username: profile.username || '',
      fullName: profile.full_name || '',
      email: profile.email || '',
      walletAddress: profile.wallet_address,
      xpPoints: profile.xp_points || 0,
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
