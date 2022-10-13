import styles from "../styles/Navbar.module.css";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className={styles.nav_bar}>
      <Link href="/">
        <a className={styles.left_part}>
          <div>
            <Image
              className={styles.logo}
              src="/Logo.png"
              width="50px"
              height="50px"
            ></Image>
          </div>
          <div className={styles.headline}>
            <h2>FSK Biblioteka</h2>
          </div>
        </a>
      </Link>

      <div className={styles.middle_part}>
        <Link href="/">
          <a className={styles.home_link}>Početna</a>
        </Link>

        <Link href="/books">
          <a className={styles.books_link}>Knjige</a>
        </Link>

        <Link href="/contact">
          <a className={styles.contact_link}>Kontakt</a>
        </Link>
      </div>

      <div className={styles.right_part}>
        <button className={styles.btn_login}>Login / Register</button>
      </div>
    </nav>
  );
};

export default Navbar;
