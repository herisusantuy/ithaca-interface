// Packages
import { useAppStore } from '@/UI/lib/zustand/store';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import styles from './Wallet.module.scss';
import ConnectWalletIcon from '../Icons/ConnectWalletIcon';
import ChevronDown from '../Icons/ChevronDown';

const Wallet = () => {
  const { ithacaSDK, initIthacaSDK, isAuthenticated } = useAppStore();
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

  // return <ConnectButton showBalance={false} />;
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type='button' className={styles.connectWallet}>
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type='button' className={styles.wrongNetwork}>
                    Wrong network
                    <ChevronDown color='#fff'/>
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  {/* <button onClick={openChainModal} style={{ display: 'flex', alignItems: 'center' }} type='button'>
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} style={{ width: 12, height: 12 }} />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button> */}

                  <button onClick={openAccountModal} type='button' className={styles.connectedWallet}>
                    {account.displayName}
                    <ConnectWalletIcon />
                    {/* {account.displayBalance ? ` (${account.displayBalance})` : ''} */}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default Wallet;
