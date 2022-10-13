import Head from "next/head";
import ContactForm from "../components/ContactForm";
import styles from "../styles/Contact.module.css";

export default function Contact() {
  return (
    <div className={styles.contact_page}>
      <Head>
        <title>Biblioteka | Fakultet za saobraćaj i komunikacije</title>
        <meta
          name="description"
          content="Website biblioteke Fakulteta za saobraćaj i komunikacije Univerziteta u Sarajevu."
        />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main>
        <div className={styles.contactus_text}>
          <h1>Kontaktirajte nas</h1>
        </div>

        <ContactForm />
      </main>
    </div>
  );
}
