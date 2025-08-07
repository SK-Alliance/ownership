"use client";

import { ReactNode, useState } from "react";
import { CampProvider } from "@campnetwork/origin/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  const [apollo] = useState(
    () =>
      new ApolloClient({
        uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL || "",
        cache: new InMemoryCache(),
      })
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#FFD56B', // Gold color matching your design
            accentColorForeground: '#0A0A0A', // Dark text on gold
            borderRadius: 'large',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          <CampProvider clientId={process.env.NEXT_PUBLIC_ORIGIN_CLIENT_ID || ""}>
            <ApolloProvider client={apollo}>
              {children}
            </ApolloProvider>
          </CampProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}