export interface UploadResult {
  success: boolean;
  ipfsHash?: string;
  ipfsUrl?: string;
  error?: string;
}

export async function uploadFileToIPFS(file: File): Promise<UploadResult> {
  try {
    // Check file size (max 10MB)
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      throw new Error("File size exceeds 10MB limit");
    }

    console.log("Uploading file to IPFS...", file.name);
    
    // Use API route instead of direct Pinata SDK
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadType', 'file');

    const response = await fetch('/api/pinata/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload file to IPFS');
    }

    const result = await response.json();
    const ipfsHash = result.IpfsHash;
    
    // Return URL format (not URI) as required by Origin SDK
    const ipfsUrl = `https://gateway.pinatacloud.io/ipfs/${ipfsHash}`;
    
    console.log("✅ File uploaded to IPFS:", ipfsUrl);
    
    return {
      success: true,
      ipfsHash,
      ipfsUrl
    };
  } catch (error) {
    console.error("❌ IPFS upload failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown upload error"
    };
  }
}

export async function uploadMetadataToIPFS(metadata: object): Promise<UploadResult> {
  try {
    console.log("Uploading metadata to IPFS...", metadata);
    
    // Use API route instead of direct Pinata SDK
    const response = await fetch('/api/pinata/json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata)
    });

    if (!response.ok) {
      throw new Error('Failed to upload metadata to IPFS');
    }

    const result = await response.json();
    const ipfsHash = result.IpfsHash;
    
    // Return URL format for metadata
    const ipfsUrl = `https://gateway.pinatacloud.io/ipfs/${ipfsHash}`;
    
    console.log("✅ Metadata uploaded to IPFS:", ipfsUrl);
    
    return {
      success: true,
      ipfsHash,
      ipfsUrl
    };
  } catch (error) {
    console.error("❌ Metadata upload failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown upload error"
    };
  }
}