import { supabase } from './supabase'

export interface UploadResult {
  url: string
  path: string
  success: boolean
  error?: string
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  external_url?: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
}

export class SupabaseStorage {
  private static readonly BUCKET_NAME = 'nft-assets'
  
  /**
   * Upload image file to Supabase storage
   */
  static async uploadImage(file: File, itemId: string): Promise<UploadResult> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${itemId}-${Date.now()}.${fileExt}`
      const filePath = `images/${fileName}`

      // Upload to Supabase Storage with proper headers for NFT compatibility
      const { error } = await supabase.storage
        .from(SupabaseStorage.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
          duplex: 'half'
        })

      if (error) {
        console.error('Supabase upload error:', error)
        return {
          url: '',
          path: '',
          success: false,
          error: error.message
        }
      }

      // Use API proxy URL for universal compatibility (MetaMask, OpenSea, etc.)
      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL || 'http://localhost:3000';
      
      const proxyUrl = `${baseUrl}/api/nft/image/${filePath.replace('images/', '')}`;

      return {
        url: proxyUrl,
        path: filePath,
        success: true
      }

    } catch (error) {
      console.error('Upload error:', error)
      return {
        url: '',
        path: '',
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  /**
   * Upload NFT metadata JSON to Supabase storage
   */
  static async uploadMetadata(metadata: NFTMetadata, itemId: string): Promise<UploadResult> {
    try {
      const fileName = `${itemId}-metadata-${Date.now()}.json`
      const filePath = `metadata/${fileName}`

      // Convert metadata to blob
      const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
        type: 'application/json'
      })

      // Upload to Supabase Storage with proper JSON content-type
      const { error } = await supabase.storage
        .from(SupabaseStorage.BUCKET_NAME)
        .upload(filePath, metadataBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/json'
        })

      if (error) {
        console.error('Metadata upload error:', error)
        return {
          url: '',
          path: '',
          success: false,
          error: error.message
        }
      }

      // Use API proxy URL for universal compatibility
      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL || 'http://localhost:3000';
      
      const proxyUrl = `${baseUrl}/api/nft/metadata/${filePath.replace('metadata/', '')}`;

      return {
        url: proxyUrl,
        path: filePath,
        success: true
      }

    } catch (error) {
      console.error('Metadata upload error:', error)
      return {
        url: '',
        path: '',
        success: false,
        error: error instanceof Error ? error.message : 'Metadata upload failed'
      }
    }
  }

  /**
   * Create complete NFT metadata object
   */
  static createNFTMetadata(
    itemData: {
      title: string
      brand: string
      category: string
      serialNumber: string
      est_value?: number
    },
    imageUrl: string,
    ownerAddress: string
  ): NFTMetadata {
    return {
      name: `${itemData.title} - Ownership Certificate`,
      description: `Digital ownership proof for ${itemData.title} by ${itemData.brand}. Serial: ${itemData.serialNumber}`,
      image: imageUrl,
      external_url: `https://camp-origin-ownership.vercel.app/item/${itemData.serialNumber}`,
      attributes: [
        {
          trait_type: 'Item Category',
          value: itemData.category
        },
        {
          trait_type: 'Brand',
          value: itemData.brand
        },
        {
          trait_type: 'Serial Number',
          value: itemData.serialNumber
        },
        {
          trait_type: 'Registration Date',
          value: new Date().toISOString()
        },
        {
          trait_type: 'Owner Address',
          value: ownerAddress
        },
        ...(itemData.est_value && itemData.est_value > 0 ? [{
          trait_type: 'Estimated Value USD',
          value: itemData.est_value.toString()
        }] : [])
      ]
    }
  }

  /**
   * Complete upload process: image + metadata
   */
  static async uploadComplete(
    file: File,
    itemData: {
      title: string
      brand: string
      category: string
      serialNumber: string
      est_value?: number
    },
    ownerAddress: string
  ): Promise<{ imageUrl: string; metadataUrl: string; success: boolean; error?: string }> {
    try {
      const itemId = itemData.serialNumber.replace(/[^a-zA-Z0-9]/g, '-')

      // Upload image first
      const imageResult = await this.uploadImage(file, itemId)
      if (!imageResult.success) {
        return {
          imageUrl: '',
          metadataUrl: '',
          success: false,
          error: `Image upload failed: ${imageResult.error}`
        }
      }

      // Create and upload metadata
      const metadata = this.createNFTMetadata(itemData, imageResult.url, ownerAddress)
      const metadataResult = await this.uploadMetadata(metadata, itemId)
      
      if (!metadataResult.success) {
        return {
          imageUrl: imageResult.url,
          metadataUrl: '',
          success: false,
          error: `Metadata upload failed: ${metadataResult.error}`
        }
      }

      return {
        imageUrl: imageResult.url,
        metadataUrl: metadataResult.url,
        success: true
      }

    } catch (error) {
      return {
        imageUrl: '',
        metadataUrl: '',
        success: false,
        error: error instanceof Error ? error.message : 'Complete upload failed'
      }
    }
  }
}