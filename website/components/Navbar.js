import styles from "../styles/Navbar.module.css";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className={styles.nav_bar}>
      <div className={styles.left_part}>
        <div>
          <Image
            className={styles.logo}
            src="/Logo.png"
            width="50px"
            height="50px"
          ></Image>
        </div>
        <div></div>
      </div>

      <div className={styles.middle_part}>
        <Link href="/">
          <a>Početna</a>
        </Link>

        <Link href="/books">
          <a>Knjige</a>
        </Link>

        <Link href="/contact">
          <a>Kontakt</a>
        </Link>
      </div>

      <div className={styles.right_part}>
        <button>Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
