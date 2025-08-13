import { http, createConfig } from 'wagmi'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

// BaseCamp network configuration
export const baseCampTestnet = {
  id: 123420001114,
  name: 'Camp Network Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BaseCamp',
    symbol: 'BCAMP',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.basecamp.t.raas.gelato.cloud'],
    },
  },
  blockExplorers: {
    default: { name: 'BaseCamp Explorer', url: 'https://basecamp.cloud.blockscout.com' },
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