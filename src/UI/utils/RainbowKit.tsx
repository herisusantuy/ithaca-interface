// Packages
import { arbitrumGoerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';

// Project ID
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('Environment variable PROJECT_ID is not set.');
}

// Chains
const { chains, publicClient, webSocketPublicClient } = configureChains([arbitrumGoerli], [publicProvider()]);

// Info
const appInfo = {
  appName: 'Ithaca',
};

// Connectors
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({
        projectId,
        chains,
      }),
      walletConnectWallet({ projectId, chains }),
    ],
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
