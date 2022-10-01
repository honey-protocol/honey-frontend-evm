import type { AppProps } from 'next/app';
import { MoralisProvider } from 'react-moralis';
import { ThemeProvider } from 'degen';
import 'degen/styles';
import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from '../contexts/userContext';
import { QueryClientProvider, QueryClient } from "react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useLoanFlowStore from "../store/loanFlowStore";

const queryClient = new QueryClient()

function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: any, {shallow}: any) => {
      const resetLoanFlowStore = useLoanFlowStore((state) => state.reset)
      resetLoanFlowStore()
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])
  return (
    <ThemeProvider defaultMode="dark" defaultAccent="red">
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
