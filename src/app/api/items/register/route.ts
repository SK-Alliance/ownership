import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PinataStorage } from '@/lib/pinata-storage';
import { RegisterItemResponse } from '@/types/api';

export async function POST(req: NextRequest): Promise<NextResponse<RegisterItemResponse>> {
  try {
    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const estValue = formData.get('est_value') as string;
    const walletAddress = formData.get('wallet_address') as string;
    const billFile = formData.get('billFile') as File | null;
    const idFile = formData.get('idFile') as File | null;

    // Validate required fields
    if (!title || !category || !estValue || !walletAddress) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, category, est_value, wallet_address'
      }, { status: 400 });
    }

    const estimatedValue = parseFloat(estValue);
    if (isNaN(estimatedValue) || estimatedValue <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid estimated value'
      }, { status: 400 });
    }

    // Get user from wallet address
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', walletAddress)
      .single();

    if (userError || !user) {
      return NextResponse.json({
        success: false,
        error: 'User not found. Please connect your wallet first.'
      }, { status: 404 });
    }

    let billUrl: string | null = null;
    let billHash: string | null = null;
    let idUrl: string | null = null;
    let idHash: string | null = null;

    // Upload bill file to Pinata IPFS
    if (billFile && billFile.size > 0) {
      console.log('📄 Uploading bill document to IPFS via Pinata');
      
      const billResult = await PinataStorage.uploadDocument(billFile, walletAddress, 'bill');

      if (!billResult.success) {
        console.error('Bill upload error:', billResult.error);
        return NextResponse.json({
          success: false,
          error: `Failed to upload bill document: ${billResult.error}`
        }, { status: 500 });
      }

      billUrl = billResult.url;
      billHash = billResult.hash;
      console.log('✅ Bill uploaded to IPFS:', billHash);
    }

    // Upload ID file to Pinata IPFS
    if (idFile && idFile.size > 0) {
      console.log('🆔 Uploading ID document to IPFS via Pinata');
      
      const idResult = await PinataStorage.uploadDocument(idFile, walletAddress, 'id');

      if (!idResult.success) {
        console.error('ID upload error:', idResult.error);
        
        // Cleanup bill file if it was uploaded to IPFS
        if (billHash) {
          await PinataStorage.deleteFile(billHash);
        }
        
        return NextResponse.json({
          success: false,
          error: `Failed to upload ID document: ${idResult.error}`
        }, { status: 500 });
      }

      idUrl = idResult.url;
      idHash = idResult.hash;
      console.log('✅ ID uploaded to IPFS:', idHash);
    }

    // Insert item into database
    const { data: insertedItem, error: insertError } = await supabase
      .from('items')
      .insert({
        title,
        category,
        estimated_value: estimatedValue,
        owner_id: user.id,
        bill_url: billUrl,
        bill_hash: billHash,
        id_url: idUrl,
        id_hash: idHash,
        status: 'pending_verification',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      
      // Cleanup uploaded files on database error from IPFS
      const cleanupPromises = [];
      if (billHash) {
        cleanupPromises.push(PinataStorage.deleteFile(billHash));
      }
      if (idHash) {
        cleanupPromises.push(PinataStorage.deleteFile(idHash));
      }
      
      if (cleanupPromises.length > 0) {
        await Promise.allSettled(cleanupPromises);
      }
      
      return NextResponse.json({
        success: false,
        error: `Failed to save item: ${insertError.message}`
      }, { status: 500 });
    }

    // Award XP for successful registration
    try {
      await supabase.from('xp_logs').insert({
        user_id: user.id,
        points: 100,
        reason: 'item_registration',
        item_id: insertedItem.id,
        created_at: new Date().toISOString()
      });

      // Update user's total XP
      await supabase.rpc('increment_user_xp', {
        user_wallet: walletAddress,
        xp_amount: 100
      });
    } catch (xpError) {
      console.warn('Failed to award XP:', xpError);
      // Don't fail the request for XP errors
    }

    return NextResponse.json({
      success: true,
      data: {
        id: insertedItem.id,
        title: insertedItem.title,
        category: insertedItem.category,
        estimated_value: insertedItem.estimated_value,
        owner_id: insertedItem.owner_id,
        bill_url: insertedItem.bill_url,
        bill_hash: insertedItem.bill_hash,
        id_url: insertedItem.id_url,
        id_hash: insertedItem.id_hash,
        status: insertedItem.status,
        created_at: insertedItem.created_at
      }
    });

  } catch (error) {
    console.error('Item registration API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
