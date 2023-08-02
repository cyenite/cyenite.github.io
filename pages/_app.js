import 'tailwindcss/tailwind.css'
import '../styles/index.css'
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return <>
    <div className="container">
      {/* <Script src="https://www.googletagmanager.com/gtag/js?id=G-MD8QD02FWZ" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-MD8QD02FWZ');
        `}
      </Script> */}
    </div>
    <Component {...pageProps} />
  </>
}

export default MyApp
