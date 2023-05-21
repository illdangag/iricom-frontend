import { Html, Head, Main, NextScript, } from 'next/document';

export default () => {
  return (
    <Html data-color-mode='light'>
      <Head>
        <meta name='referrer' content='no-referrer-when-downgrade'/>
      </Head>
      <body>
        <Main/>
        <NextScript/>
      </body>
    </Html>
  );
};
