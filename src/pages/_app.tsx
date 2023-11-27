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

const Ithaca = ({ Component, pageProps }: AppProps) => {
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
  const { nextAuction, fetchNextAuction, fetchSpotPrices, initIthacaProtocol } = useAppStore();
  getTimeNextAuction(nextAuction.milliseconds, fetchNextAuction, fetchSpotPrices);

  useEffect(() => {
    initIthacaProtocol();
  }, [initIthacaProtocol]);

  return <Ithaca Component={Component} pageProps={pageProps} router={router} />;
}

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
