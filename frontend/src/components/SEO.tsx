import { Helmet } from 'react-helmet-async';

type SEOProps = {
    title: string;
    description: string;
    url: string; // Required - every page MUST have a canonical URL
    name?: string;
    type?: string;
    image?: string;
};

export default function SEO({
    title,
    description,
    name = "FarmConnect",
    type = "website",
    url,
    image = "https://farmbro.vercel.app/screenshot-desktop.png"
}: SEOProps) {
    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title}</title>
            <meta name='description' content={description} />

            {/* Open Graph / Facebook / LinkedIn */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={name} />
            {url && <meta property="og:url" content={url} />}
            {image && <meta property="og:image" content={image} />}

            {/* Twitter Cards */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}

            {/* Canonical URL */}
            {url && <link rel="canonical" href={url} />}
        </Helmet>
    );
}
