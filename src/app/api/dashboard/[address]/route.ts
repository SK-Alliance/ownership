import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await params;

    if (!address) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', address.toLowerCase())
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    // Get user's items
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .eq('owner_address', address.toLowerCase())
      .order('created_at', { ascending: false });

    if (itemsError) {
      throw itemsError;
    }

    // Calculate dashboard stats
    const totalItems = items?.length || 0;
    const totalValue = items?.reduce((sum, item) => sum + (item.est_value || 0), 0) || 0;
    const recentItems = items?.slice(0, 5) || [];

    return NextResponse.json({
      profile: profile || null,
      items: items || [],
      stats: {
        totalItems,
        totalValue,
        recentItems: recentItems.length,
      },
      recentItems,
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
