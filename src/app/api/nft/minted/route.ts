import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Initialize Supabase client with service role for server operations
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const walletAddress = searchParams.get('wallet_address');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query - either by user_id or wallet_address from user session
    let query = supabase
      .from('minted_nfts')
      .select(`
        *,
        users!inner (
          id,
          wallet_address,
          display_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by user
    if (userId) {
      query = query.eq('user_id', userId);
    } else if (walletAddress) {
      query = query.eq('users.wallet_address', walletAddress.toLowerCase());
    }

    const { data: mintedNFTs, error, count } = await query;

    if (error) {
      console.error('Error fetching minted NFTs:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Transform data for frontend
    const transformedNFTs = mintedNFTs?.map(nft => ({
      id: nft.id,
      userId: nft.user_id,
      itemName: nft.item_name,
      model: nft.model,
      manufacturer: nft.manufacturer,
      category: nft.category,
      description: nft.description,
      estimatedValue: nft.estimated_value,
      imageUrl: nft.image_url,
      imageFileName: nft.image_filename,
      imageFileSize: nft.image_filesize,
      imageFileType: nft.image_filetype,
      
      // Blockchain data
      tokenId: nft.token_id,
      contractAddress: nft.contract_address,
      transactionHash: nft.transaction_hash,
      blockchainNetwork: nft.blockchain_network,
      ipfsMetadataUrl: nft.ipfs_metadata_url,
      ipfsImageUrl: nft.ipfs_image_url,
      
      // License terms
      commercialUse: nft.commercial_use,
      derivatives: nft.derivatives,
      attribution: nft.attribution,
      
      // Timestamps
      mintedAt: nft.created_at,
      updatedAt: nft.updated_at,
      
      // User info
      user: {
        id: nft.users.id,
        walletAddress: nft.users.wallet_address,
        displayName: nft.users.display_name,
        email: nft.users.email,
      }
    })) || [];

    return NextResponse.json({
      success: true,
      data: transformedNFTs,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    });

  } catch (error) {
    console.error('Error in minted NFTs API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
