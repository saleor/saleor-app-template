import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'urql';
import { client } from '../lib/graphql';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp
