import Ubuntu from "../components/ubuntu";
import ReactGA from 'react-ga';
import Meta from "../components/SEO/Meta";
import Script from 'next/script';

const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
ReactGA.initialize(TRACKING_ID);

function App() {
  return (
    <>
      <div className="container">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-MD8QD02FWZ" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-MD8QD02FWZ');
        `}
        </Script>
      </div>
      {/* <GoogleAnalytics trackingId={process.env.NEXT_PUBLIC_ANALYTICS_ID} /> */}
      <Meta />
      <Ubuntu />
    </>
  )
}

export default App;
