import styles from "../styles/Footer.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(year);
  }, []);

  return (
    <div
      className={`${styles.footer_main} animate__animated animate__slideInUp`}
    >
      <div className={styles.info}>
        <div className={styles.logos}>
          <Image
            className={styles.logo}
            alt="unsa logo"
            src="/Unsa.png"
            width="100px"
            height="100px"
          ></Image>
          <Image
            className={styles.logo}
            alt="fsk logo"
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
          <div className={styles.contact_details}>
            <a className={styles.action} href="tel:+38733565200">
              <div className={styles.actionContainer}>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 1024 1024"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M885.6 230.2L779.1 123.8a80.83 80.83 0 0 0-57.3-23.8c-21.7 0-42.1 8.5-57.4 23.8L549.8 238.4a80.83 80.83 0 0 0-23.8 57.3c0 21.7 8.5 42.1 23.8 57.4l83.8 83.8A393.82 393.82 0 0 1 553.1 553 395.34 395.34 0 0 1 437 633.8L353.2 550a80.83 80.83 0 0 0-57.3-23.8c-21.7 0-42.1 8.5-57.4 23.8L123.8 664.5a80.89 80.89 0 0 0-23.8 57.4c0 21.7 8.5 42.1 23.8 57.4l106.3 106.3c24.4 24.5 58.1 38.4 92.7 38.4 7.3 0 14.3-.6 21.2-1.8 134.8-22.2 268.5-93.9 376.4-201.7C828.2 612.8 899.8 479.2 922.3 344c6.8-41.3-6.9-83.8-36.7-113.8z"></path>
                </svg>
                <span>+387 33 565 200</span>
              </div>
            </a>
            <a className={styles.action} href="mailto:info@fsk.unsa.ba">
              <div className={styles.actionContainer}>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M23,20 L23,6 L12,15 L1,6 L1,20 L23,20 Z M12,12 L22,4 L2,4 L12,12 Z"
                  ></path>
                </svg>
                <span>info@fsk.unsa.ba</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className={styles.line} />
      <p className={`${styles.copyright}`}>
        © {currentYear} Fakultet za saobraćaj i komunikacije Univerziteta u
        Sarajevu | Sva prava zadržana
      </p>
    </div>
  );
};

export default Footer;
