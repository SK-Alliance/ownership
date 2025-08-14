import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const filePath = path.join('/');
    
    // Get metadata file from Supabase storage
    const { data, error } = await supabase.storage
      .from('nft-assets')
      .download(filePath);

    if (error || !data) {
      return new NextResponse('Metadata not found', { status: 404 });
    }

    // Read the JSON content
    const text = await data.text();
    let metadata;
    
    try {
      metadata = JSON.parse(text);
    } catch (parseError) {
      console.error('Invalid JSON metadata:', parseError);
      return new NextResponse('Invalid metadata format', { status: 400 });
    }

    // Ensure image URLs are converted to API proxy URLs
    if (metadata.image && metadata.image.includes('supabase.co')) {
      // Extract the file path from Supabase URL
      const imagePathMatch = metadata.image.match(/nft-assets\/(.+?)(\?|$)/);
      if (imagePathMatch) {
        const imagePath = imagePathMatch[1];
        // Convert to our API proxy URL
        const baseUrl = request.url.replace(/\/api\/nft\/metadata.*/, '');
        metadata.image = `${baseUrl}/api/nft/image/${imagePath}`;
      }
    }

    return NextResponse.json(metadata, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Metadata proxy error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}