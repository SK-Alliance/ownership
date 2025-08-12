import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// API to fetch the items listed by the user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // First, get the user ID from the wallet address
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();

    if (userError) {
      console.error('User lookup error:', userError);
      return NextResponse.json(
        { success: false, error: 'Failed to find user' },
        { status: 404 }
      );
    }

    if (!user) {
      return NextResponse.json({ 
        success: true, 
        data: [] // No user found, return empty array
      });
    }

    // Now fetch items for this user
    const { data: items, error } = await supabase
      .from('items')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch items from database' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: items || []
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Implement item creation logic
    const body = await request.json();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Item created successfully',
      data: { id: Date.now().toString(), ...body }
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create item' },
      { status: 500 }
    );
  }
}