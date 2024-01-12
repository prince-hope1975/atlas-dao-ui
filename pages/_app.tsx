/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import "bootstrap/dist/css/bootstrap.min.css";
// import "../style/global.css";
import "./styles.css";
import "@interchain-ui/react/styles";
import NiceModal from "@ebay/nice-modal-react";
import type { AppProps } from "next/app";
import React, { useMemo } from "react";
import { RootLayout } from "@/components/layout/rootLayout";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import { stargazeIndexerClient } from "@/services/graphql";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 0,
        // cacheTime: 0,
      },
    },
  });

  return (
    <ApolloProvider client={stargazeIndexerClient}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <RootLayout>
            <NiceModal.Provider>
              <Component {...pageProps} />
            </NiceModal.Provider>
          </RootLayout>
        </WalletProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}

export default MyApp;
