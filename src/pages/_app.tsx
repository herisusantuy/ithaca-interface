// Packages
import { Toaster } from 'react-hot-toast';
import { Lato } from 'next/font/google';
import { AppProps } from 'next/app';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';

// Constants
import { TOAST_STYLES } from '@/UI/constants/toast';

// Utils
import { chains, appInfo, wagmiConfig } from '@/UI/utils/RainbowKit';

// Layouts
import Header from '@/UI/layouts/Header/Header';

// Styles
import '@rainbow-me/rainbowkit/styles.css';
import 'src/UI/stylesheets/vendor/_prism-onedark.scss';
import 'src/UI/stylesheets/_global.scss';

const font = Lato({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });

const Ithaca = ({ Component, pageProps }: AppProps) => {
	return (
		<WagmiConfig config={wagmiConfig}>
			<RainbowKitProvider appInfo={appInfo} chains={chains} theme={darkTheme()}>
				<div className={`${font.className} appWrapper`}>
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
	return <Ithaca Component={Component} pageProps={pageProps} router={router} />;
}

export default App;
