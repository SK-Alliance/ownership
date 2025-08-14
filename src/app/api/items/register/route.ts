import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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
    const imageUrl = formData.get('imageUrl') as string | null;
    const metadataUrl = formData.get('metadata_url') as string | null;
    const serialNumber = formData.get('serial_number') as string | null;
    const brand = formData.get('brand') as string | null;

    // Validate required fields
    if (!title || !category || !estValue || !walletAddress) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, category, est_value, wallet_address'
      }, { status: 400 });
    }

    const estimatedValue = parseFloat(estValue);
    if (isNaN(estimatedValue) || estimatedValue < 0) {
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
    let idUrl: string | null = null;

    // Upload bill file to "proofs" bucket
    if (billFile && billFile.size > 0) {
      const billFileName = `${Date.now()}-${user.id}-bill-${billFile.name}`;
      const billArrayBuffer = await billFile.arrayBuffer();
      
      const { data: billUpload, error: billError } = await supabase.storage
        .from('proofs')
        .upload(billFileName, billArrayBuffer, {
          contentType: billFile.type,
          cacheControl: '3600'
        });

      if (billError) {
        console.error('Bill upload error:', billError);
        return NextResponse.json({
          success: false,
          error: `Failed to upload bill document: ${billError.message}`
        }, { status: 500 });
      }

      // Get public URL
      const { data: billPublicUrl } = supabase.storage
        .from('proofs')
        .getPublicUrl(billUpload.path);
      
      billUrl = billPublicUrl.publicUrl;
    }

    // Upload ID file to "ids" bucket
    if (idFile && idFile.size > 0) {
      const idFileName = `${Date.now()}-${user.id}-id-${idFile.name}`;
      const idArrayBuffer = await idFile.arrayBuffer();
      
      const { data: idUpload, error: idError } = await supabase.storage
        .from('ids')
        .upload(idFileName, idArrayBuffer, {
          contentType: idFile.type,
          cacheControl: '3600'
        });

      if (idError) {
        console.error('ID upload error:', idError);
        
        // Cleanup bill file if it was uploaded
        if (billUrl) {
          const billPath = billUrl.split('/').pop();
          if (billPath) {
            await supabase.storage.from('proofs').remove([billPath]);
          }
        }
        
        return NextResponse.json({
          success: false,
          error: `Failed to upload ID document: ${idError.message}`
        }, { status: 500 });
      }

      // Get public URL
      const { data: idPublicUrl } = supabase.storage
        .from('ids')
        .getPublicUrl(idUpload.path);
      
      idUrl = idPublicUrl.publicUrl;
    }

    // Insert item into database
    const { data: insertedItem, error: insertError } = await supabase
      .from('items')
      .insert({
        title,
        brand,
        category,
        serial_number: serialNumber,
        estimated_value: estimatedValue,
        owner_id: user.id,
        image_url: imageUrl,
        metadata_url: metadataUrl,
        bill_url: billUrl,
        id_url: idUrl,
        status: 'pending_verification',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      
      // Cleanup uploaded files on database error
      const cleanupPromises = [];
      if (billUrl) {
        const billPath = billUrl.split('/').pop();
        if (billPath) cleanupPromises.push(supabase.storage.from('proofs').remove([billPath]));
      }
      if (idUrl) {
        const idPath = idUrl.split('/').pop();
        if (idPath) cleanupPromises.push(supabase.storage.from('ids').remove([idPath]));
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
        id_url: insertedItem.id_url,
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
