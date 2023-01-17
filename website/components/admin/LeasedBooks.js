import Lease from "../Lease";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import styles from "../../styles/LeasedBooks.module.css";
import Image from "next/image";

const LeasedBooks = () => {
  const [leases, setLeases] = useState([]);
  const [newestLeases, setNewestLeases] = useState(false);

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

  const changeSortLeases = () => {
    setNewestLeases((prev) => !prev);
    let temp = leases.reverse();

    setLeases(temp);
  };

  return (
    <div className={styles.main}>
      <h2>Trenutno izdate knjige</h2>

      <div className={styles.topDiv}>
        <div className={styles.numberOfRequestsDiv}>
          <p>Prikazi</p>
          <select
            defaultValue="5"
            onChange={(e) =>
              setNumberOfRequestsToShow(parseInt(e.target.value))
            }
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>{" "}
          <p>zahtjeva</p>
        </div>
        <div className={styles.searchBarDiv}>
          <input
            type="text"
            placeholder="Pretrazi studente..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.btn_search}>
            <Image
              className={styles.search_icon}
              alt="search"
              width="20px"
              height="20px"
              src="/Search.png"
            />
          </button>
        </div>
      </div>

      <div>
        {leases ? (
          <>
            {leases.length > 0 ? (
              <>
                {/*  */}
                <div>
                  <table className={styles.table} id="books">
                    <thead>
                      <tr>
                        <th className={styles.th}>Ime i Prezime Studenta</th>
                        <th className={`${styles.naziv_knjige} ${styles.th}`}>
                          Naziv Knjige
                        </th>
                        <th className={styles.th}>ISBN</th>
                        <th className={styles.th}>Trenutno Stanje</th>
                        <th
                          className={`${styles.sortable} ${styles.th}`}
                          onClick={changeSortLeases}
                        >
                          Datum Zahtjeva
                          <span
                            className={
                              newestLeases
                                ? styles.arrow
                                : styles.reversed_arrow
                            }
                          ></span>
                        </th>
                        <th className={styles.th}>Rok Vracanja</th>
                        <th className={styles.th}>Opcije</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leases.map((req) => (
                        <Lease key={req.id} {...req} />
                      ))}
                    </tbody>
                  </table>
                </div>
                {/*  */}
              </>
            ) : (
              <p>Nema trenutno izdatih knjiga.</p>
            )}
          </>
        ) : (
          <p>Nema trenutno izdatih knjiga.</p>
        )}
      </div>

      <div className={styles.bottomDiv}>
        <div className={styles.numberOfPagesDetails}>
          <p>
            Prikazano {1} do {2} od {3} zahtjeva.
          </p>
        </div>
        <div className={styles.pageButtons}>
          <button>Prva</button>
          <button>Prethodna</button>
          <p>{}</p>
          <button>Sljedeca</button>
          <button>Zadnja</button>
        </div>
      </div>
    </div>
  );
};

export default LeasedBooks;
{
  /* <Lease key={req.id} {...req} /> */
}
