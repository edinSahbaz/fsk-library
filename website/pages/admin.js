import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddBook from "../components/AddBook";
import { useUser } from "../components/Layout";
import Lease from "../components/Lease";
import Request from "../components/Request";
import { db } from "../lib/firebase";
import styles from "./../styles/Admin.module.css";
import Image from "next/image";

const Admin = () => {
  const [showModal, setShowModal] = useState(false);
  const [newestReq, setNewestReq] = useState(false);
  const [newestLeases, setNewestLeases] = useState(false);
  const [requests, setRequest] = useState([]);
  const [leases, setLeases] = useState([]);
  const user = useUser();

  // Saving the current menu, and changing its opacity depending on the id
  const [activeMenu, setActiveMenu] = useState(0);
  const setVisible = (id) => {
    if (activeMenu != id) {
      setActiveMenu(id);
    }
  };

  useEffect(() => {
    const reqRef = collection(db, "bookRequests");
    const reqQ = query(reqRef, orderBy("addedTime"));

    const unsubRequests = onSnapshot(reqQ, (colSnap) => {
      const temp = [];
      colSnap.forEach((req) => {
        temp.push({ id: req.id, ...req.data() });
      });

      setRequest(temp);
    });

    return () => {
      unsubRequests();
    };
  }, []);

  useEffect(() => {
    const leasedRef = collection(db, "leasedBooks");
    const leasedQ = query(leasedRef, orderBy("addedTime"));

    const unsubLeases = onSnapshot(leasedQ, (colSnap) => {
      const temp = [];
      colSnap.forEach((lease) => {
        temp.push({ id: lease.id, ...lease.data() });
      });

      setLeases(temp);
    });

    return () => {
      unsubLeases();
    };
  }, []);

  const changeSortReq = () => {
    setNewestReq((prev) => !prev);
    let temp = requests.reverse();

    setRequest(temp);
  };

  const changeSortLeases = () => {
    setNewestLeases((prev) => !prev);
    let temp = leases.reverse();

    setLeases(temp);
  };

  return (
    <>
      {/* SIDEBAR MENU */}
      {user && user.user.email === "biblioteka@fsk.unsa.ba" ? (
        <div className={styles.container}>
          <div class={styles.sidebar}>
            <div class={styles.sidebar_header}>
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
            <div className={styles.heading}>
              <h1>Dashboard - Admin</h1>
              <button onClick={() => setShowModal(true)}>Dodaj knjigu</button>
              {showModal && <AddBook setShowModal={setShowModal} />}
            </div>

            <div>
              <div>
                <h2>Zahtjevi za knjige</h2>
                <div>
                  <label>
                    Sortiraj
                    <button onClick={changeSortReq}>
                      {newestReq ? "Najstariji prvo" : "Najnoviji prvo"}
                    </button>
                  </label>
                </div>
                <div>
                  {requests ? (
                    <>
                      {requests.length > 0 ? (
                        <>
                          {requests.map((req) => (
                            <Request key={req.id} {...req} />
                          ))}
                        </>
                      ) : (
                        <p>Nema novih zahtjeva za knjige.</p>
                      )}
                    </>
                  ) : (
                    <p>Nema novih zahtjeva za knjige.</p>
                  )}
                </div>
              </div>

              <div>
                <h2>Trenutno izdate knjige</h2>
                <div>
                  <label>
                    Sortiraj
                    <button onClick={changeSortLeases}>
                      {newestLeases ? "Najstariji prvo" : "Najnoviji prvo"}
                    </button>
                  </label>
                </div>
                <div>
                  {leases ? (
                    <>
                      {leases.length > 0 ? (
                        <>
                          {leases.map((req) => (
                            <Lease key={req.id} {...req} />
                          ))}
                        </>
                      ) : (
                        <p>Nema trenutno izdatih knjiga.</p>
                      )}
                    </>
                  ) : (
                    <p>Nema trenutno izdatih knjiga.</p>
                  )}
                </div>
              </div>
            </div>
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
