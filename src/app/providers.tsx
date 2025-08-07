"use client";

import { ReactNode, useState } from "react";
import { CampProvider } from "@campnetwork/origin/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

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
    <QueryClientProvider client={queryClient}>
      <CampProvider clientId={process.env.NEXT_PUBLIC_ORIGIN_CLIENT_ID || ""}>
        <ApolloProvider client={apollo}>
          {children}
        </ApolloProvider>
      </CampProvider>
    </QueryClientProvider>
  );
}