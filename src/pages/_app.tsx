import '@/styles/globals.css';
import moment from 'moment';
import 'moment/locale/pt-br';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

moment.locale('pt-br');

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>Teeth Aligner</title>
      </Head>

      <Component {...pageProps} />

      <ToastContainer />
    </QueryClientProvider>
  );
}
