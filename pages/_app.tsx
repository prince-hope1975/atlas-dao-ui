
// import "../style/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@interchain-ui/react/styles";
import "./styles.css";
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
  defaultOptions:{
    queries:{
      
    }
  }
    // defaultOptions: {
    //   queries: {
    //     refetchOnWindowFocus: false,
    //     refetchOnReconnect: false,
    //     staleTime: 0,
    //     // cacheTime: 0,
    //   },
    // },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={stargazeIndexerClient}>
        <WalletProvider>
          <RootLayout>
            <NiceModal.Provider>
              <Component {...pageProps} />
            </NiceModal.Provider>
          </RootLayout>
        </WalletProvider>
      </ApolloProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
