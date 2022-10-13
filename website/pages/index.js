import Head from "next/head";
import AuthForm from "../components/AuthForm";
import Searchbar from "../components/Searchbar";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div>
      <Head>
        <title>eBiblioteka | Fakultet za saobraćaj i komunikacije UNSA</title>
        <meta
          name="description"
          content="Website biblioteke Fakulteta za saobraćaj i komunikacije Univerziteta u Sarajevu."
        />
        <link rel="icon" href="/Logo.png" />
      </Head>

      <AuthForm />
    </div>
  );
}
