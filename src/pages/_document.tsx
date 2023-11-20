// Packages
import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang='en'>
        <Head>
          <Script
            strategy='afterInteractive'
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
          />
          <Script
            id='ga'
            strategy='afterInteractive'
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GTM_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
          <meta name='msapplication-TileColor' content='#0B0E15' />
          <meta name='theme-color' content='#ffffff' />
          <meta property='og:type' content='website' />
          <meta property='og:image' content='https://i.ibb.co/dPSFNpJ/og.jpg' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta property='twitter:domain' content='https://app.ithaca.finance/' />
          <meta name='twitter:image' content='https://i.ibb.co/dPSFNpJ/og.jpg' />
          <meta name='twitter:card' content='summary_large_image' />
          <link rel='icon' href='/favicon/favicon.ico' />
          <link rel='apple-touch-icon' sizes='180x180' href='/favicon/apple-touch-icon.png' />
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon/favicon-32x32.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon/favicon-16x16.png' />
          <link rel='manifest' href='/favicon/site.webmanifest' />
          <link rel='mask-icon' href='/favicon/safari-pinned-tab.svg' color='#5bbad5' />
        </Head>
        <body>
          <Main />
          <div id="portal" />
          <div id="datePicker" />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
