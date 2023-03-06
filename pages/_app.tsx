import type { AppProps } from 'next/app';
import { MoralisProvider } from 'react-moralis';
import { ThemeProvider } from 'degen';
import 'degen/styles';
import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { accentSequence, ThemeAccent } from 'helpers/themes/theme-utils';
import { UserProvider } from '../contexts/userContext';
import { QueryClientProvider, QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useLoanFlowStore from '../store/loanFlowStore';
import useLendFlowStore from '../store/lendFlowStore';
import useLiquidationFlowStore from '../store/liquidationFlowStore';
import MoralisV2 from 'moralis';
import { vars } from 'styles/theme.css';

import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const initializeMoralis = async () => {
	try {
		console.log('Initializing moralis');
		await MoralisV2.start({
			apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY
			// ...and any other configuration
		});
		console.log('Moralis initialized');
	} catch (error) {
		console.log('Failed to initialize moralis');
	}
};

const { chains, provider } = configureChains(
	[mainnet, polygon, optimism, arbitrum, polygonMumbai],
	[publicProvider()]
);

const { connectors } = getDefaultWallets({
	appName: 'My RainbowKit App',
	chains
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider
});

const queryClient = new QueryClient();

const defaultAccent: ThemeAccent = accentSequence[0];
const storedAccent =
	typeof window !== 'undefined' ? (localStorage.getItem('accent') as ThemeAccent) : undefined;

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const resetLoanFlowStore = useLoanFlowStore((state) => state.reset);
	const resetLendFlowStore = useLendFlowStore((state) => state.reset);
	const resetLiquidationFlowStore = useLiquidationFlowStore((state) => state.reset);
	useEffect(() => {
		const handleRouteChange = (url: any, { shallow }: any) => {
			resetLoanFlowStore();
			resetLendFlowStore();
			resetLiquidationFlowStore();
		};
		router.events.on('routeChangeStart', handleRouteChange);

		//Initialize moralis
		initializeMoralis();

		return () => {
			router.events.off('routeChangeStart', handleRouteChange);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<ThemeProvider defaultMode="dark" defaultAccent={storedAccent || defaultAccent}>
			<QueryClientProvider client={queryClient}>
				<WagmiConfig client={wagmiClient}>
					<RainbowKitProvider
						modalSize="compact"
						chains={chains}
						theme={lightTheme({
							accentColor: vars.colors.brownLight
						})}
					>
						<MoralisProvider
							appId={process.env.NEXT_PUBLIC_APP_ID as string}
							serverUrl={process.env.NEXT_PUBLIC_SERVER_URL as string}
							initializeOnMount={true}
						>
							<UserProvider>
								{/* {children} */}
								<Component {...pageProps} />
								<ToastContainer theme="dark" position="top-right" />
							</UserProvider>
						</MoralisProvider>
					</RainbowKitProvider>
				</WagmiConfig>
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default MyApp;
