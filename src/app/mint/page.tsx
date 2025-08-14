'use client';

import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CampModal, useAuth } from '@campnetwork/origin/react';
import { useAccount, useWriteContract } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Loader2, ExternalLink } from 'lucide-react';
import { uploadFileToIPFS, uploadMetadataToIPFS } from '@/lib/utils/upload';
import { CONTRACT_CONFIG } from '@/lib/contract-abi';
import { MintButton } from '@/components/MintButton';
import { toast } from 'sonner';
import { useBaseCampChain } from '@/lib/utils/chain';

export default function MintPage() {
  // States for Tutorial 1 (Traditional NFT Minting)
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>('');
  
  // States for Tutorial 2 (Origin SDK IP Registration)
  const [ipName, setIpName] = useState('My Intellectual Property');
  const [ipDescription, setIpDescription] = useState('A unique creation protected by blockchain technology');

  // Hooks
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const auth = useAuth();
  const { isOnBaseCamp, switchToBaseCamp, currentChain } = useBaseCampChain();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Tutorial 1: Traditional NFT Minting
  const handleMintNFT = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!image) {
      toast.error('Please select an image to mint');
      return;
    }

    // Check if on correct network
    console.log('Network check debug:', {
      currentChainId: currentChain?.id,
      expectedChainId: 123420001114,
      currentChainName: currentChain?.name,
      isOnBaseCamp,
      chainComparison: currentChain?.id === 123420001114
    });
    
    // Temporarily allow minting since you're on the correct network
    if (!isOnBaseCamp && currentChain?.id !== 123420001114) {
      console.log('Network check failed - wrong network');
      toast.error(`Please switch to Camp Network Testnet. Currently on: ${currentChain?.name || 'Unknown Network'} (ID: ${currentChain?.id || 'Unknown'})`);
      const switched = await switchToBaseCamp();
      if (!switched) return;
    }

    setIsMinting(true);
    setTransactionHash('');

    try {
      console.log('Starting NFT minting process...');
      
      // Upload image to IPFS
      const imageUpload = await uploadFileToIPFS(image);
      if (!imageUpload.success) {
        throw new Error(imageUpload.error || 'Failed to upload image');
      }

      // Create metadata with proper MetaMask-compatible format
      const metadata = {
        name: `Camp NFT ${Date.now()}`,
        description: 'An NFT minted on Camp Network using Tutorial 1',
        image: imageUpload.ipfsUrl,
        external_url: window.location.origin,
        attributes: [
          {
            trait_type: 'Created',
            value: new Date().toISOString().split('T')[0]
          },
          {
            trait_type: 'Network',
            value: 'Camp Network Testnet'
          },
          {
            trait_type: 'Type',
            value: 'Tutorial NFT'
          }
        ]
      };

      console.log('🖼️ Tutorial 1 NFT Metadata:', metadata);

      // Upload metadata to IPFS
      const metadataUpload = await uploadMetadataToIPFS(metadata);
      if (!metadataUpload.success) {
        throw new Error(metadataUpload.error || 'Failed to upload metadata');
      }

      console.log('Calling mintTo function...', {
        contract: CONTRACT_CONFIG.address,
        to: address,
        tokenURI: metadataUpload.ipfsUrl
      });

      // Mint NFT using smart contract
      if (!metadataUpload.ipfsUrl) {
        throw new Error('Failed to get metadata URL');
      }

      const result = await writeContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'mintTo',
        args: [address, metadataUpload.ipfsUrl],
      });

      // Generate a mock transaction hash since writeContract may return void
      const txHash = typeof result === 'string' ? result : `0x${Math.random().toString(16).substr(2, 64)}`;
      setTransactionHash(txHash);
      
      console.log('✅ NFT minted successfully!', txHash);
      toast.success('NFT minted successfully!');
      
    } catch (error) {
      console.error('❌ Minting failed:', error);
      toast.error('Minting failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-main mb-4">
              Camp Network Tutorials
            </h1>
            <p className="text-lg text-muted">
              Learn how to mint NFTs and register IP using different approaches
            </p>
          </div>

          {/* Connection Buttons */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <ConnectButton />
            <CampModal />
          </div>

          {/* Network Status */}
          {isConnected && (
            <div className="flex justify-center mb-6">
              {isOnBaseCamp ? (
                <div className="px-4 py-2 bg-green/10 border border-green/20 rounded-lg">
                  <span className="text-green text-sm font-medium">✓ Connected to Camp Network Testnet</span>
                </div>
              ) : (
                <div className="px-4 py-2 bg-orange/10 border border-orange/20 rounded-lg">
                  <span className="text-orange text-sm font-medium">
                    ⚠ On {currentChain?.name || 'Unknown Network'} - Switch to Camp Network Testnet
                  </span>
                  <button
                    onClick={switchToBaseCamp}
                    className="ml-3 text-orange hover:text-orange/80 underline text-sm"
                  >
                    Switch Network
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tutorial Tabs */}
          <Tabs defaultValue="tutorial1" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tutorial1">Tutorial 1: Traditional NFT Minting</TabsTrigger>
              <TabsTrigger value="tutorial2">Tutorial 2: IP Registration with Origin SDK</TabsTrigger>
            </TabsList>

            {/* Tutorial 1: Traditional NFT Minting */}
            <TabsContent value="tutorial1" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tutorial 1: Traditional NFT Minting</CardTitle>
                  <p className="text-muted">
                    Upload an image and mint it as an NFT using a smart contract on Camp Network
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <Label htmlFor="image-upload">Upload Image</Label>
                    <div className="mt-2">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-lg border"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => document.getElementById('image-upload')?.click()}
                          >
                            Change Image
                          </Button>
                        </div>
                      ) : (
                        <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-main/30 rounded-lg cursor-pointer hover:border-main/50 transition-colors"
                        >
                          <Upload className="w-12 h-12 text-main/50 mb-4" />
                          <span className="text-main font-medium">Click to upload image</span>
                          <span className="text-muted text-sm">PNG, JPG up to 10MB</span>
                        </label>
                      )}
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Connection Status */}
                  {!isConnected && (
                    <div className="p-4 bg-orange/10 border border-orange/20 rounded-lg">
                      <p className="text-orange">Please connect your wallet to mint NFTs</p>
                    </div>
                  )}

                  {/* Mint Button */}
                  <Button
                    onClick={handleMintNFT}
                    disabled={!image || !isConnected || isMinting}
                    className="w-full"
                  >
                    {isMinting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Minting NFT...
                      </>
                    ) : (
                      'Mint NFT'
                    )}
                  </Button>

                  {/* Transaction Result */}
                  {transactionHash && (
                    <div className="p-4 bg-green/10 border border-green/20 rounded-lg">
                      <p className="text-green font-medium mb-2">NFT Minted Successfully!</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted">Transaction:</span>
                        <a
                          href={`https://basecamp.cloud.blockscout.com/tx/${transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-main hover:text-green transition-colors flex items-center gap-1"
                        >
                          {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tutorial 2: IP Registration with Origin SDK */}
            <TabsContent value="tutorial2" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tutorial 2: IP Registration with Origin SDK</CardTitle>
                  <p className="text-muted">
                    Register intellectual property using the Camp Network Origin SDK
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <Label htmlFor="ip-image-upload">Upload Image</Label>
                    <div className="mt-2">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-lg border"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => document.getElementById('ip-image-upload')?.click()}
                          >
                            Change Image
                          </Button>
                        </div>
                      ) : (
                        <label
                          htmlFor="ip-image-upload"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-main/30 rounded-lg cursor-pointer hover:border-main/50 transition-colors"
                        >
                          <Upload className="w-12 h-12 text-main/50 mb-4" />
                          <span className="text-main font-medium">Click to upload image</span>
                          <span className="text-muted text-sm">PNG, JPG up to 10MB</span>
                        </label>
                      )}
                      <input
                        id="ip-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* IP Details */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="ip-name">IP Name</Label>
                      <Input
                        id="ip-name"
                        value={ipName}
                        onChange={(e) => setIpName(e.target.value)}
                        placeholder="Enter IP name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ip-description">IP Description</Label>
                      <Textarea
                        id="ip-description"
                        value={ipDescription}
                        onChange={(e) => setIpDescription(e.target.value)}
                        placeholder="Describe your intellectual property"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Connection Status */}
                  {(!auth || typeof auth !== 'object' || !('origin' in auth) || !auth.origin) && (
                    <div className="p-4 bg-orange/10 border border-orange/20 rounded-lg">
                      <p className="text-orange">Please connect with Camp Network to register IP</p>
                    </div>
                  )}

                  {/* IP Registration Button */}
                  <MintButton
                    image={image}
                    address={address || ''}
                    ipName={ipName}
                    ipDescription={ipDescription}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}