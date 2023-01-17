import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { db } from "../../lib/firebase";
import styles from "./../../styles/Admin.module.css";

const Main = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "messages");

    const unsub = onSnapshot(colRef, (colSnap) => {
      const temp = [];
      colSnap.forEach((msg) => {
        if (msg.exists()) temp.push({...msg.data(), id: msg.id});
      });
      setMessages(temp);
    });

    return () => {
      unsub();
    };
  }, []);

  const answerMsg = (id) => {
    toast.error('Feature u implementaciji...')
  }

  const deleteMsg = (id) => {
    const docRef = doc(db, 'messages', id);

    const loading = deleteDoc(docRef);
    toast.promise(loading, {
      loading: "Brisanje poruke...",
      success: "Brisanje poruke...",
      error: "Brisanje poruke..."
    })
  }

  return (
    <div className={styles.main}>
      <h2>Inbox</h2>
      <table className={styles.table} id="books">
        <thead>
          <tr>
            <th className={`${styles.naziv_knjige} ${styles.th}`}>Email</th>
            <th className={styles.th}>Predmet</th>
            <th className={styles.th}>Poruka</th>
            <th className={styles.th}>Datum</th>
            <th className={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg, i) => (
            <tr key={i}>
              <td className={`${styles.td}`}>{msg.from}</td>
              <td className={`${styles.td}`}>{msg.message.subject}</td>
              <td className={`${styles.td}`}>{msg.message.text}</td>
              <td className={`${styles.td}`}>{msg.addedTime.toDate().toLocaleDateString()}</td>
              <td className={`${styles.td} ${styles.options}`}>
                <button className={styles.allow_button} onClick={() => answerMsg(msg.id)}>
                  Odgovori
                </button>
                <button className={styles.deny_button} onClick={() => deleteMsg(msg.id)}>
                  Obriši
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
