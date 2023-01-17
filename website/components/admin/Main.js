import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import styles from "./../../styles/Admin.module.css";

const Main = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "messages");

    const unsub = onSnapshot(colRef, (colSnap) => {
      const temp = [];
      colSnap.forEach((msg) => {
        if (msg.exists()) temp.push(msg.data());
      });
      setMessages(temp);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <div className={styles.main}>
      <table className={styles.table} id="books">
        <thead>
          <tr>
            <th className={styles.th}>Ime i Prezime Studenta</th>
            <th className={`${styles.naziv_knjige} ${styles.th}`}>Email</th>
            <th className={styles.th}>ISBN</th>
            <th className={styles.th}>Trenutno Stanje</th>
            <th className={`${styles.sortable} ${styles.th}`}>Predmet</th>
            <th className={styles.th}>Poruka</th>
            <th className={styles.th}>Datum</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg, i) => (
            <tr>
              <td className={`${styles.td}`}>{}</td>
              <td className={`${styles.td}`}>{bookName}</td>
              <td className={`${styles.td}`}>{bookISBN}</td>
              <td className={`${styles.td}`}>{bookQuantity}</td>
              <td className={`${styles.td}`}>{requestAddedDate}.</td>
              <td className={`${styles.td}`}></td>
              <td className={`${styles.td} ${styles.options}`}>
                <button className={styles.allow_button} onClick={confirmLease}>
                  Odobri
                </button>
                <button className={styles.deny_button} onClick={denyRequest}>
                  Odbij
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <div className={styles.heading}>
        <h2>Dashboard - Admin</h2>
        <div>
          {
            messages.map((msg, i) => (
              <div key={i}>
                
              </div>
            ))
          }
        </div>
      </div> */}
    </div>
  );
};

export default Main;
