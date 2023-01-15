import ContactForm from "../components/ContactForm";
import styles from "../styles/Contact.module.css";

export default function Contact() {
  return (
    <div className={styles.contact_page}>
      <main>
        <div className={styles.contactus_text}>
          <h1>Kontaktirajte nas</h1>
        </div>
        <ContactForm />
      </main>
    </div>
  );
}
