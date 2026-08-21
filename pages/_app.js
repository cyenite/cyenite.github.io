import { Archivo, Martian_Mono } from 'next/font/google';
import Script from 'next/script';

import '../styles/index.css';

const archivo = Archivo({
    subsets: ['latin'],
    axes: ['wdth'],
    display: 'swap',
});

const martianMono = Martian_Mono({
    subsets: ['latin'],
    axes: ['wdth'],
    display: 'swap',
});

export default function App({ Component, pageProps }) {
    return (
        <>
            <style jsx global>{`
                :root {
                    --font-archivo: ${archivo.style.fontFamily};
                    --font-martian: ${martianMono.style.fontFamily};
                }
            `}</style>

            <Component {...pageProps} />

            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-MD8QD02FWZ"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-MD8QD02FWZ');
                `}
            </Script>
        </>
    );
}
