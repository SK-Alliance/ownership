import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const metadata = data.get("metadata") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const pinataJwt = process.env.PINATA_JWT;
    if (!pinataJwt) {
      return NextResponse.json(
        { success: false, error: 'Pinata JWT not configured' },
        { status: 500 }
      );
    }

    // Parse metadata if provided
    let pinataMetadata = {};
    if (metadata) {
      try {
        pinataMetadata = JSON.parse(metadata);
      } catch (e) {
        console.warn('Failed to parse metadata:', e);
      }
    }

    // Upload file using Pinata REST API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pinataJwt}`,
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pinata API error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: `Pinata API error: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    // Use your Pinata gateway with access token for better performance
    const gatewayUrl = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || 'https://ipfs.io';
    const gatewayToken = process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN;
    
    // Build URL with gateway token if available
    let finalUrl = `${gatewayUrl}/ipfs/${result.IpfsHash}`;
    if (gatewayToken && gatewayUrl.includes('mypinata.cloud')) {
      finalUrl += `?pinataGatewayToken=${gatewayToken}`;
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      hash: result.IpfsHash,
      cid: result.IpfsHash,
      // Provide alternative URLs for debugging
      alternativeUrls: [
        `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
        `https://ipfs.io/ipfs/${result.IpfsHash}`,
        `https://cloudflare-ipfs.com/ipfs/${result.IpfsHash}`,
        gatewayToken ? `${gatewayUrl}/ipfs/${result.IpfsHash}?pinataGatewayToken=${gatewayToken}` : null
      ].filter(Boolean)
    }, { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}