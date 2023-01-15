import styles from "../styles/ContactForm.module.css";

const ContactForm = () => {
  return (
    <div class={styles.float_container}>
      <div class={styles.float_child}>
        <form className={styles.contact_form}>
          <div className={styles.contact_input_email_subject}>
            <div>
              <p>Predmet</p>
            </div>
            <div className={styles.contact_input_email_subject_input}>
              <div className={styles.subject_input}>
                <input type="text" />
              </div>
            </div>
          </div>

          <div className={styles.contact_text}>
            <div>
              <p>Poruka</p>
            </div>
            <div>
              <textarea cols="30" rows="10"></textarea>
            </div>
          </div>

          <div className={styles.contact_btn_send}>
            <button className={styles.btn_send}>Pošalji</button>
          </div>
        </form>
      </div>
      <div class={styles.float_child}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11507.954913001047!2d18.3990697!3d43.8560623!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xebf148def438abc2!2sFaculty%20of%20Traffic%20and%20Communications!5e0!3m2!1sen!2sba!4v1665698562110!5m2!1sen!2sba"
          width="100%"
          height="100%"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactForm;
