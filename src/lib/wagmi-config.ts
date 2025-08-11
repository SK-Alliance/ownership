import { http, createConfig } from 'wagmi'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

// BaseCamp network configuration
export const baseCampTestnet = {
  id: 656476,
  name: 'BaseCamp Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BaseCamp',
    symbol: 'BCAMP',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.camp-network.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'BaseCamp Explorer', url: 'https://explorer.camp-network.xyz' },
  },
  testnet: true,
} as const

export const config = createConfig({
  chains: [baseCampTestnet],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your_walletconnect_project_id_here' 
    }),
  ],
  transports: {
    [baseCampTestnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}