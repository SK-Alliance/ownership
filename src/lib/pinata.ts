import { PinataSDK } from 'pinata';

// Initialize Pinata SDK
const pinataJwt = process.env.PINATA_JWT;
const pinataGatewayUrl = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud';

if (!pinataJwt) {
  console.warn('⚠️ Pinata not configured! Please add PINATA_JWT to your environment variables');
}

export const pinata = new PinataSDK({
  pinataJwt: pinataJwt || 'placeholder-jwt',
  pinataGateway: pinataGatewayUrl,
});

// Helper to get typed Pinata client
export const getTypedPinata = () => pinata;