-- Create storage bucket for NFT assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('nft-assets', 'nft-assets', true);

-- Set up RLS policies for the bucket
CREATE POLICY "Anyone can view NFT assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'nft-assets');

CREATE POLICY "Authenticated users can upload NFT assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'nft-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own NFT assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'nft-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own NFT assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'nft-assets' AND auth.uid()::text = (storage.foldername(name))[1]);