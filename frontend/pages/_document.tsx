import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="google-site-verification"
          content="qiWXwGnUnJyq0vrurVeRUcnIBcJdHFr9BMhfmSr5qZw"
        />
        <meta
          name="description"
          content="View Indian government announcements and circulars in simple, easy-to-understand language. Our AI-powered platform translates official updates into regional languages and audio for better public access."
        />
        <meta
          name="keywords"
          content="government announcements in simple language, simplified government circulars India, translate government notifications Hindi English, Indian government updates in regional languages, easy-to-understand government news, AI translation for government circulars, government schemes simplified, state and central government announcements, public access to official government updates, AI-powered government news platform"
        />
        <meta name="author" content="IndianGovToday" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="IndianGovToday – Simplified Government Announcements" />
        <meta property="og:description" content="AI-powered translations of Indian government circulars into simple regional languages." />
        <meta property="og:image" content="https://indiangovtoday.app/og-image.png" />
        <meta property="og:url" content="https://indiangovtoday.app/" />
        <meta property="og:title" content="Indian Announcements" />
        <link
          rel="preload"
          as="image"
          href="https://indgov.s3.ap-south-1.amazonaws.com/DesktopBackGroundPhoto.webp"
        />
        <link
          rel="preload"
          as="image"
          href="https://indgov.s3.ap-south-1.amazonaws.com/MobileBackGroundImage.webp"
          media="(max-width: 640px)"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
