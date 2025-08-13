import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT || "",
  pinataGateway: "gateway.pinatacloud.io",
});

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
    
    const upload = await pinata.upload.file(file);
    const ipfsHash = upload.IpfsHash;
    
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
    
    const upload = await pinata.upload.json(metadata);
    const ipfsHash = upload.IpfsHash;
    
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