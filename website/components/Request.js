import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { db } from "../lib/firebase";
import styles from "../styles/Request.module.css";

const Request = ({ bookId, userId, id, addedTime }) => {
  const [user, setUser] = useState("");
  const [bookName, setBookName] = useState("");
  const [bookQuantity, setBookQuantity] = useState(0);
  const [bookISBN, setBookISBN] = useState("");
  const [requestAddedDate, setRequestAddedDate] = useState();

  const getUserName = async () => {
    const ref = doc(db, "users", userId);
    const res = await getDoc(ref);

    if (!res.exists()) return;
    const { name, surname } = res.data();
    if (name && surname) setUser(`${name} ${surname}`);
  };

  useEffect(() => {
    var t = new Date(addedTime.seconds * 1000);
    var date = t.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setRequestAddedDate(date);
  }, []);

  useEffect(() => {
    getUserName();
  }, []);

  useEffect(() => {
    if (!bookId) return;

    const bookRef = doc(db, "books", bookId);
    const unsub = onSnapshot(bookRef, (docSnap) => {
      if (!docSnap.exists()) return;

      const data = docSnap.data();
      setBookName(data.name);
      setBookQuantity(data.quantity);
      setBookISBN(data.ISBN);
    });

    return () => {
      unsub();
    };
  }, []);

  const confirmLease = () => {
    const leasesRef = collection(db, "leasedBooks");
    const reqRef = doc(db, "bookRequests", id);

    const loading = addDoc(leasesRef, {
      bookId,
      userId,
      addedTime: Timestamp.now(),
    }).then(() => {
      if (bookQuantity > 0) {
        updateDoc(doc(db, "books", bookId), {
          quantity: bookQuantity - 1,
        });
      } else {
        toast.error(`Knjiga ${bookName} nije dostupna!`);
      }

      deleteDoc(reqRef);
    });

    toast.promise(loading, {
      loading: "Odobravanje zahtjeva...",
      success: "Zahtjev uspješno odobren!",
      error: "Greška...",
    });
  };

  return (
    <tr>
      <td className={`${styles.td}`}>{user}</td>
      <td className={`${styles.td}`}>{bookName}</td>
      <td className={`${styles.td}`}>{bookISBN}</td>
      <td className={`${styles.td}`}>{bookQuantity}</td>
      <td className={`${styles.td}`}>{requestAddedDate}.</td>
      <td className={`${styles.td}`}>
        <input type="date" />
      </td>
      <td className={`${styles.td} ${styles.options}`}>
        <button className={styles.allow_button} onClick={confirmLease}>
          Odobri
        </button>
        <button className={styles.deny_button}>Odbij</button>
      </td>

      {/* <label>
        {"test " + user} ({userId}) - {bookName}
        <button onClick={confirmLease}>Odobri</button>
      </label> */}
    </tr>
  );
};

export default Request;
