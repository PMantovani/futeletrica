import Head from "next/head";

export const PageHead: React.FC<{ description: string }> = (props) => {
  return (
    <Head>
      <title>FutElétrica 2013</title>
      <meta name="description" content="Fut Elétrica 2013" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content="Fut Elétrica 2013" />
      <meta property="og:image" content="https://futeletrica.vercel.app/images/logo.png" />
      <meta property="og:description" content={props.description} />
      <meta property="og:image:width" content="457" />
      <meta property="og:image:height" content="545" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
