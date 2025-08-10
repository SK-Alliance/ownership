"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CampProvider } from "@campnetwork/origin/react";

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
            <CampProvider
                clientId={process.env.NEXT_PUBLIC_CAMP_CLIENT_ID || "fce77d7a-8085-47ca-adff-306a933e76aa"}
              >
                {children}
            </CampProvider>
        </QueryClientProvider>
    );
}