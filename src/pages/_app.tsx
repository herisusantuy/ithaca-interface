// Packages
import { Toaster } from 'react-hot-toast';
import { AppProps } from 'next/app';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';

// Constants
import { LATO, ROBOTO } from '@/UI/constants/fonts';
import { TOAST_STYLES } from '@/UI/constants/toast';

// Utils
import { chains, appInfo, wagmiConfig } from '@/UI/utils/RainbowKit';

// Lib
import { useAppStore } from '@/UI/lib/zustand/store';

// Layouts
import Header from '@/UI/layouts/Header/Header';

// Styles
import '@rainbow-me/rainbowkit/styles.css';
import 'src/UI/stylesheets/vendor/_prism-onedark.scss';
import 'src/UI/stylesheets/_global.scss';
import { useEffect } from 'react';
import { IthacaSDK } from '@ithaca-finance/sdk';

const Ithaca = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
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
          <Header />
          <Component {...pageProps} />
          <Toaster
            position='top-right'
            toastOptions={{
              className: 'toast',
              duration: 5000,
              success: {
                style: TOAST_STYLES.success,
              },
              error: {
                style: TOAST_STYLES.error,
              },
            }}
          />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

function App({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    fetchContractList();
    fetchReferencePrices();
    fetchSystemInfo();
    getNextAuctionTime(0, setNextAuction, publicSDK);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { setNextAuction, fetchContractList, fetchReferencePrices, fetchSystemInfo, publicSDK } = useAppStore();
  return <Ithaca Component={Component} pageProps={pageProps} router={router} />;
}

const getNextAuctionTime = async (
  timeUntilNexAuction: number,
  setNextAuction: (time: number) => number,
  publicSDK: IthacaSDK
) => {
  setTimeout(() => {
    publicSDK.protocol.nextAuction().then((res) => {
      const time = setNextAuction(res);
      getNextAuctionTime(time, setNextAuction, publicSDK);
    }).catch((err) => {
      console.error(err)
    })
  }, timeUntilNexAuction)
}

export default App;
