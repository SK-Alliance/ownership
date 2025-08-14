"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { useState } from 'react';

import { CampProvider } from "@campnetwork/origin/react";
import { config } from "@/lib/wagmi-config";
import { baseCampTestnet } from "@/lib/wagmi-config";

import '@rainbow-me/rainbowkit/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
    // Use useState to ensure single instance
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30 * 1000, // 30 seconds
                retry: 1,
                refetchOnWindowFocus: false,
            },
        },
    }));

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    initialChain={baseCampTestnet}
                >
                    <CampProvider
                        clientId={process.env.NEXT_PUBLIC_CAMP_CLIENT_ID || "fce77d7a-8085-47ca-adff-306a933e76aa"}
                    >
                        {children}
                    </CampProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}