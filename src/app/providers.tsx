"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from '../../wagmi.config';
import { basecampTestnet } from 'viem/chains';

export function Providers({ children }: { children: React.ReactNode }) {
    // Optimized query client for faster loading
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30 * 1000, // 30 seconds
                retry: 1,
                refetchOnWindowFocus: false,
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                <RainbowKitProvider
                    initialChain={basecampTestnet}
                >
                    {children}
                </RainbowKitProvider>
            </WagmiProvider>
        </QueryClientProvider>
    );
}