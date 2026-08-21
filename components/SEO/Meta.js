import Head from 'next/head';

const TITLE = 'Aaron Rono — The Survey';
const DESCRIPTION =
    'The portfolio of Aaron Rono, a software engineer trained in geomatics, plotted as a survey sheet: 35 projects as control stations on one continuous plane.';
const URL = 'https://cyenite.github.io/';
const IMAGE = `${URL}images/logos/logo_1200.png`;

export default function Meta() {
    return (
        <Head>
            <title>{TITLE}</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            <meta name="description" content={DESCRIPTION} />
            <meta name="author" content="Aaron Rono" />
            <meta name="robots" content="index, follow" />
            <meta name="theme-color" content="#f1f5f7" />
            <link rel="canonical" href={URL} />

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Aaron Rono — The Survey" />
            <meta property="og:title" content={TITLE} />
            <meta property="og:description" content={DESCRIPTION} />
            <meta property="og:url" content={URL} />
            <meta property="og:image" content={IMAGE} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={TITLE} />
            <meta name="twitter:description" content={DESCRIPTION} />
            <meta name="twitter:image" content={IMAGE} />
            <meta name="twitter:creator" content="@cyenite" />

            <link rel="icon" href="./images/logos/fevicon.svg" />
            <link rel="apple-touch-icon" href="./images/logos/logo.png" />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Person',
                        name: 'Aaron Rono',
                        alternateName: 'cyenite',
                        url: URL,
                        jobTitle: 'Mobile Software Engineer',
                        worksFor: { '@type': 'Organization', name: 'Solutech Limited' },
                        alumniOf: {
                            '@type': 'CollegeOrUniversity',
                            name: 'Dedan Kimathi University of Technology',
                        },
                        email: 'mailto:aaronokip@gmail.com',
                        sameAs: ['https://github.com/cyenite', 'https://www.linkedin.com/in/aaronkip/'],
                    }),
                }}
            />
        </Head>
    );
}
