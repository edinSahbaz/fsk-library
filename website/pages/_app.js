import "animate.css";
import Head from "next/head";
import Layout from "../components/Layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>eBiblioteka | Fakultet za saobraćaj i komunikacije UNSA</title>
        <meta
          name="description"
          content="Website biblioteke Fakulteta za saobraćaj i komunikacije Univerziteta u Sarajevu."
        />
        <link rel="icon" href="/Logo.png" />
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
