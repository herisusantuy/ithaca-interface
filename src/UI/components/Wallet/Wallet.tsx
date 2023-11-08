// Packages
import { useAppStore } from '@/UI/lib/zustand/store';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';

const Wallet = () => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { initIthacaSDK } = useAppStore();

  useEffect(() => {
    if (!walletClient) return;
    initIthacaSDK(publicClient, walletClient);
  }, [initIthacaSDK, publicClient, walletClient]);

  return <ConnectButton showBalance={false} />;
};

export default Wallet;
