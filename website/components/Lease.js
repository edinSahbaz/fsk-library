import {
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
import styles from "../styles/Lease.module.css";

const Lease = ({ bookId, userId, id, addedTime, mustReturnBefore }) => {
  const [user, setUser] = useState("");
  const [bookName, setBookName] = useState("");
  const [bookQuantity, setBookQuantity] = useState(0);
  const [bookISBN, setBookISBN] = useState("");
  const [requestAddedDate, setRequestAddedDate] = useState();
  const [mustReturnBeforeDate, setMustReturnBeforeDate] = useState();

  const getUserName = async () => {
    const ref = doc(db, "users", userId);
    const res = await getDoc(ref);

    if (!res.exists()) return;
    const { name, surname } = res.data();
    if (name && surname) setUser(`${name} ${surname}`);
  };

  useEffect(() => {
    var t = new Date(mustReturnBefore.seconds * 1000);
    var date = t.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setMustReturnBeforeDate(date);
  }, []);

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
    const ordersRef = doc(db, "leasedBooks", id);

    const loading = deleteDoc(ordersRef, {
      bookId,
      userId,
      addedTime: Timestamp.now(),
    });

    toast
      .promise(loading, {
        loading: "Obrada...",
        success: "Uspješna obrada!",
        error: "Greška...",
      })
      .then(() => {
        const bookRef = doc(db, "books", bookId);
        updateDoc(bookRef, {
          quantity: bookQuantity + 1,
        });
      });
  };

  return (
    <tr>
      <td className={`${styles.td}`}>{user}</td>
      <td className={`${styles.td}`}>{bookName}</td>
      <td className={`${styles.td}`}>{bookISBN}</td>
      <td className={`${styles.td}`}>{bookQuantity}</td>
      <td className={`${styles.td}`}>{requestAddedDate}.</td>
      <td className={`${styles.td}`}>{mustReturnBeforeDate}</td>
      <td className={`${styles.td} ${styles.options}`}>
        <button className={styles.deny_button} onClick={confirmLease}>
          Obrisi
        </button>
      </td>
    </tr>
  );
};

export default Lease;
