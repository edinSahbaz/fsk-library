import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Biblioteka | Fakultet za saobraćaj i komunikacije</title>
        <meta
          name="description"
          content="Website biblioteke Fakulteta za saobraćaj i komunikacije Univerziteta u Sarajevu."
        />
        <link rel="icon" href="/logo.png" />
      </Head>

      <main></main>
    </div>
  );
}
