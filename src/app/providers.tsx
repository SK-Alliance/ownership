"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { CampProvider } from "@campnetwork/origin/react";
import { config } from '../../wagmi.config';
import { basecampTestnet } from 'viem/chains';

export function Providers({ children }: { children: React.ReactNode }) {

    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#FFD56B', // Gold color matching your design
                        accentColorForeground: '#0A0A0A', // Dark text on gold
                        borderRadius: 'large',
                        fontStack: 'system',
                        overlayBlur: 'small',
                    })}
                    initialChain={basecampTestnet}>
                    <CampProvider clientId={process.env.NEXT_PUBLIC_ORIGIN_CLIENT_ID || "demo-client-id"}>
                        {children}
                    </CampProvider>
                </RainbowKitProvider>
            </WagmiProvider>
        </QueryClientProvider>
    );
}