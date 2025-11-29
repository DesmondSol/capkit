import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Capkit - From Idea to Investment",
  description = "The all-in-one platform for Ethiopian entrepreneurs. Validate ideas, build products, and prepare for investment with AI-powered tools.",
  keywords = "startup, ethiopia, business canvas, investment, ai co-founder, capkit, fanaye technologies",
  image = "https://capkit-et.web.app/og-image.png", 
  url = "https://capkit-et.web.app"
}) => {
  const siteTitle = title.includes('Capkit') ? title : `${title} | Capkit`;

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};