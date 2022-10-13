import styles from "../styles/Footer.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <div className={styles.footer_main}>
      <div>
        <Image
          className={styles.logo}
          src="/Logo.png"
          width="100px"
          height="100px"
        ></Image>
      </div>
      <div className={styles.footer_text}>
        <p>
          <span></span>
          <br />
          Zmaja od Bosne 8<br />
          Kampus Univerziteta
          <br />
          71000 Sarajevo
        </p>

        <p>
          <span>+387 33 565 200</span>
          <br />
          <a>info@fsk.unsa.ba</a>
        </p>

        <div className={styles.line} />

        <div>
          <p>Edin Šahbaz | Faris Rizvanović</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
