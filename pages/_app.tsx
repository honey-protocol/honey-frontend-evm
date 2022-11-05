import type { AppProps } from 'next/app';
import { MoralisProvider } from 'react-moralis';
import { ThemeProvider } from 'degen';
import 'degen/styles';
import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { accentSequence, ThemeAccent } from 'helpers/themes/theme-utils';
import { UserProvider } from '../contexts/userContext';
import { QueryClientProvider, QueryClient } from "react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useLoanFlowStore from "../store/loanFlowStore";
import useLendFlowStore from "../store/lendFlowStore";
import useLiquidationFlowStore from "../store/liquidationFlowStore";

const queryClient = new QueryClient()

const defaultAccent: ThemeAccent = accentSequence[0];
const storedAccent =
  typeof window !== 'undefined'
    ? (localStorage.getItem('accent') as ThemeAccent)
    : undefined;

function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter()
  const resetLoanFlowStore = useLoanFlowStore((state) => state.reset)
  const resetLendFlowStore = useLendFlowStore((state) => state.reset)
  const resetLiquidationFlowStore = useLiquidationFlowStore((state) => state.reset)
  useEffect(() => {
    const handleRouteChange = (url: any, {shallow}: any) => {
      resetLoanFlowStore()
      resetLendFlowStore()
      resetLiquidationFlowStore()
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <ThemeProvider defaultMode="dark" defaultAccent={storedAccent || defaultAccent}>
      <QueryClientProvider client={queryClient}>
        <MoralisProvider
          appId={process.env.NEXT_PUBLIC_APP_ID as string}
          serverUrl={process.env.NEXT_PUBLIC_SERVER_URL as string}
        >
          <UserProvider>
            {/* {children} */}
            <Component {...pageProps} />
            <ToastContainer theme="dark" position="top-right"/>
          </UserProvider>
        </MoralisProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default MyApp; 
