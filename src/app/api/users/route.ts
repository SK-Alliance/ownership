import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Initialize Supabase client with service role for server operations
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CreateUserRequest {
  wallet_address: string;
  display_name?: string;
  email?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserRequest = await request.json();
    const { wallet_address, display_name, email } = body;

    if (!wallet_address) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // First, try to find existing user by wallet address
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('id, wallet_address, display_name, email')
      .eq('wallet_address', wallet_address.toLowerCase())
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking for existing user:', selectError);
      return NextResponse.json(
        { success: false, error: selectError.message },
        { status: 500 }
      );
    }

    // If user exists, return their data
    if (existingUser) {
      return NextResponse.json({
        success: true,
        data: {
          user_id: existingUser.id,
          user: existingUser,
          created: false
        }
      });
    }

    // User doesn't exist, create new one
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        wallet_address: wallet_address.toLowerCase(),
        display_name: display_name || null,
        email: email || null,
        xp_points: 0,
        monthly_credits: 100
      }])
      .select('id, wallet_address, display_name, email')
      .single();

    if (insertError) {
      console.error('Error creating new user:', insertError);
      return NextResponse.json(
        { success: false, error: insertError.message },
        { status: 500 }
      );
    }

    console.log('✅ New user created with ID:', newUser.id);
    return NextResponse.json({
      success: true,
      data: {
        user_id: newUser.id,
        user: newUser,
        created: true
      }
    });

  } catch (error) {
    console.error('Error in user management API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet_address');

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, wallet_address, display_name, email, xp_points, monthly_credits')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
