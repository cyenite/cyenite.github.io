import Ubuntu from "../components/ubuntu";
import ReactGA from 'react-ga4';
import Meta from "../components/SEO/Meta";

//const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
ReactGA.initialize('G-MD8QD02FWZ');

function App() {
  return (
    <>
      {/* <GoogleAnalytics trackingId={process.env.NEXT_PUBLIC_ANALYTICS_ID} /> */}
      <Meta />
      <Ubuntu />
    </>
  )
}

export default App;
