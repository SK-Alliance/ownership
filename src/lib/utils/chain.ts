import { toast } from 'sonner';

// Since we're using Camp Network Origin SDK exclusively,
// we don't need Wagmi chain utilities anymore.
// This is kept for backward compatibility and future reference.

interface ChainConfig {
  id: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: {
      http: string[];
    };
  };
  blockExplorers: {
    default: {
      url: string;
    };
  };
}

// Camp Network configuration (for reference)
const campNetworkConfig: ChainConfig = {
  id: 325000, // Camp Network Testnet
  name: 'Camp Network Testnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-camp-network-4xje7wy105.t.conduit.xyz'],
    },
  },
  blockExplorers: {
    default: {
      url: 'https://explorer-camp-network-4xje7wy105.t.conduit.xyz',
    },
  },
};

export function useCampNetworkChain() {
  const addCampNetwork = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error('Please install MetaMask or another Web3 wallet');
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${campNetworkConfig.id.toString(16)}`, // Convert to hex
            chainName: campNetworkConfig.name,
            nativeCurrency: {
              name: campNetworkConfig.nativeCurrency.name,
              symbol: campNetworkConfig.nativeCurrency.symbol,
              decimals: campNetworkConfig.nativeCurrency.decimals,
            },
            rpcUrls: campNetworkConfig.rpcUrls.default.http,
            blockExplorerUrls: [campNetworkConfig.blockExplorers.default.url],
          },
        ],
      });
      toast.success('Camp Network added to wallet');
      return true;
    } catch (error) {
      console.error('Failed to add network:', error);
      toast.error('Failed to add Camp Network to wallet');
      return false;
    }
  };

  const switchToCampNetwork = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error('Please install MetaMask or another Web3 wallet');
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${campNetworkConfig.id.toString(16)}` }],
      });
      toast.success('Switched to Camp Network Testnet');
      return true;
    } catch (error: unknown) {
      console.error('Failed to switch chain:', error);
      
      // If the network doesn't exist, try to add it first
      const errorObj = error as { code?: number; message?: string };
      if (errorObj?.code === 4902 || errorObj?.message?.includes('Unrecognized chain ID')) {
        toast.info('Adding Camp Network to your wallet...');
        const added = await addCampNetwork();
        if (added) {
          // Try switching again after adding
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${campNetworkConfig.id.toString(16)}` }],
            });
            toast.success('Switched to Camp Network Testnet');
            return true;
          } catch (switchError) {
            console.error('Failed to switch after adding:', switchError);
          }
        }
      }
      
      toast.error('Failed to switch to Camp Network. Please switch manually in your wallet.');
      return false;
    }
  };

  return {
    switchToCampNetwork,
    addCampNetwork,
    campNetworkConfig
  };
}

// Deprecated - use useCampNetworkChain instead
export const useBaseCampChain = useCampNetworkChain;