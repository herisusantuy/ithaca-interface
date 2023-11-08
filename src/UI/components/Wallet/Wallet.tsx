// Packages
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { watchAccount } from '@wagmi/core'
import { useSDKStore } from '@/UI/lib/zustand/store';
import { createWalletClient, custom } from 'viem';
import { arbitrumGoerli } from 'viem/chains';
import useFromStore from '@/UI/hooks/useFromStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any

let inProgress = false;

const Wallet = () => {
  const { initSdk, currentAccount, setCurrentAccount } = useSDKStore();
  const walletSDK = useFromStore(useSDKStore, state => state.walletSDK);
  watchAccount(async (account) => {
    if (account.address !== currentAccount) {
      if (!account.address && !inProgress && currentAccount) {
        setCurrentAccount();
        walletSDK?.auth.logout();
        // rewrite later
        // needed to stop multiple requests
        setTimeout(() => {
          inProgress = false;
        }, 4000)
      }
      else {
        if (!currentAccount && !inProgress) {
          inProgress = true;
          setCurrentAccount(account.address);
          const sdk = await initSdk(createWalletClient({
            chain: arbitrumGoerli,
            transport: custom(window.ethereum),
          }));
          sdk.auth.login().catch((err) => {
            setCurrentAccount();
            console.error(err)
          })
          // rewrite later
          // needed to stop multiple requests
          setTimeout(() => {
            inProgress = false;
          }, 4000)
        }
      }
    }
    else {
      // accountDetails.current = account.address;
    }
  })
  return <ConnectButton showBalance={false} />;
};

export default Wallet;
