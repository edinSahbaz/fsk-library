import styles from "../styles/Navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import { useUser } from "./Layout";

const Navbar = () => {
  const router = useRouter();
  const user = useUser();

  const logout = () => {
    signOut(auth);
  };

  return (
    <nav
      className={`${styles.nav_bar} animate__animated animate__slideInDown animate__faster`}
    >
      <Link href="/">
        <a className={styles.left_part}>
          <div className={styles.logo}>
            <Image
              alt="logo"
              src="/Logo.png"
              width="50px"
              height="50px"
            ></Image>
          </div>
          <h2 className={styles.headline}>eBiblioteka - FSK UNSA</h2>
        </a>
      </Link>

      <div className={styles.middle_part}>
        <Link href="/">
          <span
            className={`${styles.link} ${
              router.pathname === "/" ? styles.active : ""
            }`}
          >
            Početna
          </span>
        </Link>

        <Link href="/kontakt">
          <span
            className={`${styles.link} ${
              router.pathname === "/kontakt" ? styles.active : ""
            }`}
          >
            Kontakt
          </span>
        </Link>

        {
          user && user.user.email === "biblioteka@fsk.unsa.ba" && (
            <Link href="/admin">
              <span
                className={`${styles.link} ${
                  router.pathname === "/admin" ? styles.active : ""
                }`}
              >
                Admin
              </span>
            </Link>
          )
        }
      </div>

      <div className={styles.right_part}>
        <button className={styles.btn} onClick={logout}>
          Odjavi se
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
