// Contract ABI for OwnershipCertificate
export const OWNERSHIP_CERTIFICATE_ABI = [
  // Mint function
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      }
    ],
    "name": "mintTo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  // Batch mint function
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "to",
        "type": "address[]"
      },
      {
        "internalType": "string[]",
        "name": "tokenURIs",
        "type": "string[]"
      }
    ],
    "name": "batchMintTo",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "tokenIds",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  // View functions
  {
    "inputs": [],
    "name": "getCurrentTokenId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalMinted",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintingPaused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintingFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Events
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      }
    ],
    "name": "CertificateMinted",
    "type": "event"
  }
] as const

// Contract configuration
export const CONTRACT_CONFIG = {
  address: '0x91C7187EDbb47a4556C39932f4B32B27107AEC76' as const,
  abi: OWNERSHIP_CERTIFICATE_ABI,
  owner: '0xc4935DDA27d2fADcbb8a5B64156C4791dF978a00' as const,
} as const