//this api helps you to create a user profile and save its info

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
    const { username, email, walletAddress } = body;

    // Validate required fields
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Log the wallet address for debugging
    console.log('Attempting to save profile with wallet address:', walletAddress);

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if display name is already taken (if provided)
    if (username) {
      const { data: existingUser, error: usernameError } = await supabase
        .from('users')
        .select('wallet_address')
        .eq('display_name', username)
        .neq('wallet_address', walletAddress.toLowerCase())
        .single();

      if (usernameError && usernameError.code !== 'PGRST116') {
        throw usernameError;
      }

      if (existingUser) {
        return NextResponse.json({ error: 'Display name already taken' }, { status: 409 });
      }
    }

    // Upsert profile data
    const { data: profile, error } = await supabase
      .from('users')
      .upsert({
        wallet_address: walletAddress.toLowerCase(),
        display_name: username || null,
        email: email?.toLowerCase() || null,
        xp_points: 0, // Initialize with 0 XP for new profiles
        monthly_credits: 5, // Initialize with default credits
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
      username: profile.display_name || '',
      fullName: profile.display_name || '',
      email: profile.email || '',
      walletAddress: profile.wallet_address,
      xpPoints: profile.xp_points || 0,
    });

  } catch (error) {
    console.error('Error saving profile:', error);
    
    // More specific error handling for network issues
    if (error instanceof TypeError && error.message.includes('fetch failed')) {
      return NextResponse.json(
        { 
          error: 'Database connection failed. Please check your internet connection and try again.',
          details: 'Unable to reach Supabase database'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}
