import React from 'react'
import Head from 'next/head';

export default function Meta() {
    return (
        <Head>
           /* Primary Meta Tags */
            <title>Aaron Rono's Portfolio - Software Engineer</title>
            <meta charSet="utf-8" />
            <meta name="title" content="Aaron Rono Portfolio - Software Engineer" />
            <meta name="description"
                content="Aaron Rono's (cyenite) Personal Portfolio Website. Made with Ubuntu 20.4 (Linux) theme by Next.js and Tailwind CSS." />
            <meta name="author" content="Aaron Rono (cyenite)" />
            <meta name="keywords"
                content="cyenite, cyenite's portfolio, cyenite linux, ubuntu portfolio, aaron kipkoech protfolio" />
            <meta name="robots" content="index, follow" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#E95420" />

            /* Search Engine */
            <meta name="image" content="images/logos/fevicon.png" />
            /* Schema.org for Google */
            <meta itemProp="name" content="Aaron Kipkoech Portfolio - Software Engineer" />
            <meta itemProp="description"
                content="cyenite, cyenite's portfolio, cyenite linux, ubuntu portfolio, aaron kipkoech protfolio" />
            <meta itemProp="image" content="images/logos/fevicon.png" />
            /* Twitter */
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="Aaron Kipkoech Portfolio - Software Engineer" />
            <meta name="twitter:description"
                content="cyenite, cyenite's portfolio, cyenite linux, ubuntu portfolio, aaron kipkoech protfolio" />
            <meta name="twitter:site" content="cyenite" />
            <meta name="twitter:creator" content="cyenite" />
            <meta name="twitter:image:src" content="images/logos/logo_1024.png" />
            /* Open Graph general (Facebook, Pinterest & Google+) */
            <meta name="og:title" content="Aaron Kipkoech Portfolio - Software Engineer" />
            <meta name="og:description"
                content="cyenite, cyenite's portfolio, cyenite linux, ubuntu portfolio, aaron kipkoech protfolio" />
            <meta name="og:image" content="images/logos/logo_1200.png" />
            <meta name="og:url" content="http://cyenite.github.io/" />
            <meta name="og:site_name" content="Cyenite's Personal Portfolio" />
            <meta name="og:locale" content="en_IN" />
            <meta name="og:type" content="website" />

            <link rel="icon" href="images/logos/fevicon.svg" />
            <link rel="apple-touch-icon" href="images/logos/logo.png" />
            <link rel="preload" href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" as="style" />
            <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet"></link>
        </Head>
    )
}
