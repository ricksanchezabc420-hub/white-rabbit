'use client';

import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    // Required
    appName: "WHITE RABBIT",
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo_project_id",
    chains: [mainnet, polygon],
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
    },
    // Optional
    appDescription: "Fast-acting, flavourful, and formulated for the modern mind.",
    appUrl: "https://whiterabbit.com", 
    appIcon: "https://whiterabbit.com/icon.png", 
  }),
);

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider 
          mode="dark" 
          customTheme={{
            "--ck-font-family": "var(--font-sans), sans-serif",
            "--ck-border-radius": "1rem",
            "--ck-body-background": "#0A0A0A",
            "--ck-body-background-secondary": "#111111",
            "--ck-primary-button-background": "rgba(255, 0, 255, 0.1)",
            "--ck-primary-button-hover-background": "rgba(255, 0, 255, 0.2)",
            "--ck-primary-button-color": "#FF00FF",
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
