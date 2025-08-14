import { useSwitchChain, useAccount } from 'wagmi';
import { baseCampTestnet } from '@/lib/wagmi-config';
import { toast } from 'sonner';

export function useBaseCampChain() {
  const { switchChain } = useSwitchChain();
  const { chain } = useAccount();

  const isOnBaseCamp = chain?.id === baseCampTestnet.id;

  const addBaseCampNetwork = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error('Please install MetaMask or another Web3 wallet');
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${baseCampTestnet.id.toString(16)}`, // Convert to hex
            chainName: baseCampTestnet.name,
            nativeCurrency: {
              name: baseCampTestnet.nativeCurrency.name,
              symbol: baseCampTestnet.nativeCurrency.symbol,
              decimals: baseCampTestnet.nativeCurrency.decimals,
            },
            rpcUrls: baseCampTestnet.rpcUrls.default.http,
            blockExplorerUrls: [baseCampTestnet.blockExplorers.default.url],
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

  const switchToBaseCamp = async () => {
    if (!switchChain) {
      toast.error('Chain switching not supported');
      return false;
    }

    try {
      await switchChain({ chainId: baseCampTestnet.id });
      toast.success('Switched to Camp Network Testnet');
      return true;
    } catch (error: unknown) {
      console.error('Failed to switch chain:', error);
      
      // If the network doesn't exist, try to add it first
      const errorObj = error as { code?: number; message?: string };
      if (errorObj?.code === 4902 || errorObj?.message?.includes('Unrecognized chain ID')) {
        toast.info('Adding Camp Network to your wallet...');
        const added = await addBaseCampNetwork();
        if (added) {
          // Try switching again after adding
          try {
            await switchChain({ chainId: baseCampTestnet.id });
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
    isOnBaseCamp,
    switchToBaseCamp,
    addBaseCampNetwork,
    currentChain: chain,
    baseCampChain: baseCampTestnet
  };
}