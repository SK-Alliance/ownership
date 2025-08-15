import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Initialize Supabase client
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface StoreMintedNFTRequest {
  // User identification
  owner_id: string;
  
  // Blockchain data from Camp Origin SDK
  token_id?: string;
  contract_address?: string;
  transaction_hash?: string;
  
  // Form data from user input
  item_name: string;
  model: string;
  manufacturer: string;
  category: string;
  estimated_value: number;
  description: string;
  
  // File information
  original_image_url?: string;
  nft_image_url?: string;
  image_file_name?: string;
  image_file_size?: number;
  image_content_type?: string;
  
  // IPFS URLs from Camp Origin SDK
  ipfs_metadata_url?: string;
  ipfs_image_url?: string;
  
  // License terms (optional, will use defaults if not provided)
  license_price?: number;
  license_duration?: number;
  license_royalty_bps?: number;
  license_payment_token?: string;
  
  // Status and metadata
  mint_status?: 'pending' | 'completed' | 'failed';
  network?: string;
  nft_type?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: StoreMintedNFTRequest = await request.json();

    // Validate required fields
    if (!body.owner_id) {
      return NextResponse.json(
        { error: 'owner_id is required' },
        { status: 400 }
      );
    }

    if (!body.item_name || !body.model || !body.manufacturer || 
        !body.category || !body.description) {
      return NextResponse.json(
        { error: 'All form fields (item_name, model, manufacturer, category, description) are required' },
        { status: 400 }
      );
    }

    if (!body.estimated_value || body.estimated_value <= 0) {
      return NextResponse.json(
        { error: 'estimated_value must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate category against allowed values
    const validCategories = [
      'Electronics', 'Jewelry', 'Art', 'Collectibles', 'Fashion',
      'Home & Garden', 'Sports & Recreation', 'Tools & Equipment',
      'Books & Media', 'Other'
    ];

    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    // Prepare data for insertion with defaults
    const mintedNFTData = {
      owner_id: body.owner_id,
      
      // Blockchain data
      token_id: body.token_id || null,
      contract_address: body.contract_address || null,
      transaction_hash: body.transaction_hash || null,
      
      // Form data
      item_name: body.item_name,
      model: body.model,
      manufacturer: body.manufacturer,
      category: body.category,
      estimated_value: body.estimated_value,
      description: body.description,
      
      // File information
      original_image_url: body.original_image_url || null,
      nft_image_url: body.nft_image_url || null,
      image_file_name: body.image_file_name || null,
      image_file_size: body.image_file_size || null,
      image_content_type: body.image_content_type || null,
      
      // IPFS URLs
      ipfs_metadata_url: body.ipfs_metadata_url || null,
      ipfs_image_url: body.ipfs_image_url || null,
      
      // License terms with defaults
      license_price: body.license_price || 0,
      license_duration: body.license_duration || 2592000, // 30 days default
      license_royalty_bps: body.license_royalty_bps || 0,
      license_payment_token: body.license_payment_token || '0x0000000000000000000000000000000000000000',
      
      // Status and metadata with defaults
      mint_status: body.mint_status || 'completed',
      network: body.network || 'Camp Network',
      nft_type: body.nft_type || 'Ownership Certificate',
      
      // Timestamps (created_at, minted_at will be set by database defaults)
    };

    // Insert the minted NFT data
    const { data, error } = await supabase
      .from('minted_nfts')
      .insert([mintedNFTData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to store minted NFT data', details: error.message },
        { status: 500 }
      );
    }

    // Return success response with the created record
    return NextResponse.json({
      success: true,
      message: 'Minted NFT data stored successfully',
      data: data
    }, { status: 201 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve minted NFTs for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner_id = searchParams.get('owner_id');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!owner_id) {
      return NextResponse.json(
        { error: 'owner_id parameter is required' },
        { status: 400 }
      );
    }

    // Query minted NFTs for the user
    const { data, error, count } = await supabase
      .from('minted_nfts')
      .select('*', { count: 'exact' })
      .eq('owner_id', owner_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve minted NFTs', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      total: count || 0,
      limit,
      offset
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
