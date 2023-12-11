// Packages
import { useEffect } from 'react';
import { AppProps } from 'next/app';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';

// Constants
import { LATO, ROBOTO } from '@/UI/constants/fonts';

// Utils
import { chains, appInfo, wagmiConfig } from '@/UI/utils/RainbowKit';

// Lib
import { useAppStore } from '@/UI/lib/zustand/store';

// Layouts
import Header from '@/UI/layouts/Header/Header';
import ReadyState from '@/UI/utils/ReadyState';

// Styles
import '@rainbow-me/rainbowkit/styles.css';
import 'src/UI/stylesheets/vendor/_prism-onedark.scss';
import 'src/UI/stylesheets/_global.scss';
import Toast from '@/UI/components/Toast/Toast';
import useToast from '@/UI/hooks/useToast';
import { IthacaSDK } from '@ithaca-finance/sdk';

const STATUS_MAP: Record<string, string> = {
  'NEW': 'info',
  'FILLED': 'success',
  'REJECTED': 'error',
  'CANCEL_REJECTED': 'error'
};

const TITLE_MAP: Record<string, string> = {
  'NEW': 'Transaction Sent',
  'FILLED': 'Transaction Confirmed',
  'REJECTED': 'Transaction Failed',
  'CANCEL_REJECTED': 'Transaction Failed'
};

const MESSAGE_MAP: Record<string, string> = {
  'NEW': 'We have received your request',
  'FILLED': 'Position details will be updated shortly',
  'REJECTED': 'Transaction Failed, please try again',
  'CANCEL_REJECTED': 'Transaction Failed, please try again'
};

const Ithaca = ({ Component, pageProps }: AppProps) => {
  const { toastList, showToast } = useToast();

  const {newToast} = useAppStore();

  useEffect(() => {
    if (newToast) {
      showToast(
        {
          id: Math.floor(Math.random() * 1000),
          title: TITLE_MAP[newToast.orderStatus],
          message: MESSAGE_MAP[newToast.orderStatus],
          type: STATUS_MAP[newToast.orderStatus]
        },
        'top-right'
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newToast])
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        modalSize='compact'
        appInfo={appInfo}
        chains={chains}
        theme={darkTheme({
          accentColor: 'rgba(94, 225, 146, 0.60)',
          accentColorForeground: 'white',
          borderRadius: 'large',
          overlayBlur: 'small',
        })}
      >
        <div className={`${LATO.className} ${ROBOTO.className} appWrapper`}>
          <Toast toastList={toastList} position={'top-right'} />
          <Header />
          <ReadyState>
            <Component {...pageProps} />
          </ReadyState>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

function App({ Component, pageProps, router }: AppProps) {
  const { nextAuction, fetchNextAuction, fetchSpotPrices, initIthacaProtocol, ithacaSDK, isAuthenticated } = useAppStore();

  useEffect(() => {
    getTimeNextAuction(nextAuction.milliseconds || 0, fetchNextAuction, fetchSpotPrices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[nextAuction]);

  useEffect(() => {
    initIthacaProtocol();
  }, [initIthacaProtocol]);

  useEffect(() => {
    if (isAuthenticated) {
      heartBeat(ithacaSDK)
    }
  }, [isAuthenticated])
  return <Ithaca Component={Component} pageProps={pageProps} router={router} />;
}

const heartBeat = (ithacaSDK: IthacaSDK) => {
  setTimeout(() => {
    ithacaSDK.auth.heartbeat();
    heartBeat(ithacaSDK);
  }, 10)
};

const getTimeNextAuction = async (
  timeUntilNexAuction: number,
  fetchNextAuction: () => void,
  fetchSpotPrices: () => void
) => {
  setTimeout(() => {
    fetchNextAuction();
    fetchSpotPrices();
  }, timeUntilNexAuction);
};

export default App;
