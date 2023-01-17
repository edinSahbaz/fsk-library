import Lease from "../Lease";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import styles from "../../styles/LeasedBooks.module.css";

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
    <div>
      <h2>Trenutno izdate knjige</h2>

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
    </div>
  );
};

export default LeasedBooks;
{
  /* <Lease key={req.id} {...req} /> */
}
