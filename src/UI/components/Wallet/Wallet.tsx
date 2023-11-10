// Packages
import { useAppStore } from '@/UI/lib/zustand/store';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';

const Wallet = () => {
  const { ithacaSDK, initIthacaSDK } = useAppStore();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  useAccount({
    onDisconnect: async () => {
      await ithacaSDK.auth.logout();
      localStorage.removeItem('ithaca.session');
    },
  });

  useEffect(() => {
    initIthacaSDK(publicClient, walletClient ?? undefined);
  }, [initIthacaSDK, publicClient, walletClient]);

  return <ConnectButton showBalance={false} />;
};

export default Wallet;
