import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface ProfileRequest {
  username: string;
  fullName: string;
  email: string;
  walletAddress: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ProfileRequest = await request.json();
    const { username, fullName, email, walletAddress } = body;

    // Validate required fields
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if username is already taken (if provided)
    if (username) {
      const { data: existingUsername, error: usernameError } = await supabase
        .from('user_profiles')
        .select('wallet_address')
        .eq('username', username.toLowerCase())
        .neq('wallet_address', walletAddress.toLowerCase())
        .single();

      if (usernameError && usernameError.code !== 'PGRST116') {
        throw usernameError;
      }

      if (existingUsername) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
      }
    }

    // Upsert profile data
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .upsert({
        wallet_address: walletAddress.toLowerCase(),
        username: username?.toLowerCase() || null,
        full_name: fullName || null,
        email: email?.toLowerCase() || null,
        total_xp: 0, // Initialize with 0 XP for new profiles
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'wallet_address'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      username: profile.username || '',
      fullName: profile.full_name || '',
      email: profile.email || '',
      walletAddress: profile.wallet_address,
    });

  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}
