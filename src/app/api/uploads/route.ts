import { NextRequest, NextResponse } from 'next/server';
import { PinataStorage } from '@/lib/pinata-storage';

// API to handle file uploading and IPFS metadata uploads
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    
    // Handle IPFS metadata upload
    if (contentType?.includes('application/json')) {
      const body = await request.json();
      
      if (body.type === 'ipfs_metadata' && body.metadata) {
        console.log('📦 Uploading metadata to IPFS via Pinata:', body.metadata);
        
        // Upload metadata to Pinata IPFS
        const result = await PinataStorage.uploadMetadata(body.metadata, body.itemId || 'metadata');
        
        if (!result.success) {
          return NextResponse.json({
            success: false,
            error: result.error || 'Failed to upload metadata to IPFS'
          }, { status: 500 });
        }
        
        console.log('🔗 IPFS hash:', result.hash);
        
        return NextResponse.json({ 
          success: true, 
          message: 'Metadata uploaded to IPFS successfully',
          ipfsHash: result.hash,
          metadataURI: `ipfs://${result.hash}`,
          url: result.url
        });
      }
    }

    // Handle regular file upload
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const itemId = formData.get('itemId') as string || 'file';
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log('📁 Uploading file to IPFS via Pinata:', file.name);
    
    // Upload file to Pinata IPFS
    const result = await PinataStorage.uploadImage(file, itemId);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to upload file to IPFS'
      }, { status: 500 });
    }
    
    console.log('🔗 IPFS hash:', result.hash);
    
    return NextResponse.json({ 
      success: true, 
      message: 'File uploaded to IPFS successfully',
      data: { 
        filename: file.name,
        size: file.size,
        url: result.url,
        ipfsHash: result.hash,
        ipfsURI: `ipfs://${result.hash}`
      }
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'Upload API endpoint is working'
  });
}