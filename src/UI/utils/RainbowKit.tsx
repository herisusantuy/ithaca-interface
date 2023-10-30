// Packages
import { polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { getDefaultWallets, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { ledgerWallet } from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig } from 'wagmi';

// Project ID
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('Environment variable PROJECT_ID is not set.');
}

// Chains
const { chains, publicClient, webSocketPublicClient } = configureChains([polygonMumbai], [publicProvider()]);

// Info
const appInfo = {
  appName: 'Ithaca',
};

// Wallets
const { wallets } = getDefaultWallets({
  appName: appInfo.appName,
  projectId,
  chains,
});

// Connectors
const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [ledgerWallet({ projectId, chains })],
  },
]);

// Wagmi Config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains, appInfo, wagmiConfig };
