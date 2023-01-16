import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useUser } from "../components/Layout";
import styles from "./../styles/Admin.module.css";
import Image from "next/image";
import Main from "../components/admin/Main";
import AddBook from "../components/admin/AddBook";
import BookRequests from "../components/admin/BookRequests";
import LeasedBooks from "../components/admin/LeasedBooks";
import Users from "../components/admin/Users";

const Admin = () => {

  const user = useUser();

  // Saving the current menu, and changing its opacity depending on the id
  const [activeMenu, setActiveMenu] = useState(0);
  
  const setVisible = (id) => {
    if (activeMenu != id) {
      setActiveMenu(id);
    }
  };

  return (
    <>
      {/* SIDEBAR MENU */}
      {user && user.user.email === "biblioteka@fsk.unsa.ba" ? (
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <div className={styles.sidebar_header}>
              <h3>Dashboard - Admin</h3>
            </div>
            <div
              className={`${styles.sidebar_items} ${
                activeMenu == 0 ? styles.opacity1 : styles.opacity05
              }`}
            >
              <button onClick={() => setVisible(0)}>
                <Image
                  className={styles.search_icon}
                  alt="search"
                  width="30px"
                  height="30px"
                  src="/Book.png"
                ></Image>
                Knjige
              </button>
            </div>

            <div
              className={`${styles.sidebar_items} ${
                activeMenu == 1 ? styles.opacity1 : styles.opacity05
              }`}
            >
              <button onClick={() => setVisible(1)}>
                <Image
                  className={styles.search_icon}
                  alt="search"
                  width="30px"
                  height="30px"
                  src="/AddBook.png"
                ></Image>
                Dodaj Knjigu
              </button>
            </div>

            <div
              className={`${styles.sidebar_items} ${
                activeMenu == 2 ? styles.opacity1 : styles.opacity05
              }`}
            >
              <button onClick={() => setVisible(2)}>
                <Image
                  className={styles.search_icon}
                  alt="search"
                  width="30px"
                  height="30px"
                  src="/Member.png"
                ></Image>
                Članovi Biblioteke
              </button>
            </div>

            <div
              className={`${styles.sidebar_items} ${
                activeMenu == 3 ? styles.opacity1 : styles.opacity05
              }`}
            >
              <button onClick={() => setVisible(3)}>
                <Image
                  className={styles.search_icon}
                  alt="search"
                  width="30px"
                  height="30px"
                  src="/RequestBook.png"
                ></Image>
                Zahtjevi Za Knjige
              </button>
            </div>

            <div
              className={`${styles.sidebar_items} ${
                activeMenu == 4 ? styles.opacity1 : styles.opacity05
              }`}
            >
              <button onClick={() => setVisible(4)}>
                <Image
                  className={styles.search_icon}
                  alt="search"
                  width="30px"
                  height="30px"
                  src="/LendedBook.png"
                ></Image>
                Izdate Knjige
              </button>
            </div>
          </div>

          {/* THINGS TO SHOW AND HIDE*/}
          <div className={styles.content}>
            {
              activeMenu === 0 && <Main />
            }
            {
              activeMenu === 1 && <AddBook />
            }
            {
              activeMenu === 2 && <Users />
            }
            {
              activeMenu === 3 && <BookRequests />
            }
            {
              activeMenu === 4 && <LeasedBooks />
            }
          </div>
        </div>
      ) : (
        <div className="unauthorized">
          <h2>Nedozvoljen pristup!</h2>
        </div>
      )}
    </>
  );
};

export default Admin;
