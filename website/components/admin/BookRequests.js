import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import Request from "../Request";
import styles from "../../styles/BookRequests.module.css";

const BookRequests = () => {
  const [newestReq, setNewestReq] = useState(false);
  const [requests, setRequest] = useState([]);

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

  const changeSortReq = () => {
    setNewestReq((prev) => !prev);
    let temp = requests.reverse();

    setRequest(temp);
  };

  return (
    <div>
      <h2>Zahtjevi za knjige</h2>

      <div>
        {requests ? (
          <>
            {requests.length > 0 ? (
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
                          onClick={changeSortReq}
                        >
                          Datum Zahtjeva
                          <span
                            className={
                              newestReq ? styles.arrow : styles.reversed_arrow
                            }
                          ></span>
                        </th>
                        <th className={styles.th}>Datum Vracanja</th>
                        <th className={styles.th}>Opcije</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => (
                        <Request key={req.id} {...req} />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/*  */}
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
  );
};

export default BookRequests;
