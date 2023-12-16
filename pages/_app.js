import '@/styles/globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css'; // Note: needed for next.js < 10
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
