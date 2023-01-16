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

const Lease = ({ bookId, userId, id }) => {
  const [user, setUser] = useState("");
  const [bookName, setBookName] = useState("");
  const [bookQuantity, setBookQuantity] = useState(0);

  const getUserName = async () => {
    const ref = doc(db, "users", userId);
    const res = await getDoc(ref);

    if (!res.exists()) return;
    const { name, surname } = res.data();
    if (name && surname) setUser(`${name} ${surname}`);
  };

  useEffect(() => {
    getUserName();
  }, []);

  useEffect(() => {
    if(!bookId) return;

    const bookRef = doc(db, 'books', bookId);
    const unsub = onSnapshot(bookRef, docSnap => {
      if(!docSnap.exists()) return;

      const data = docSnap.data();
      setBookName(data.name);
      setBookQuantity(data.quantity);
    })

    return () => {
      unsub()
    }
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
    <div>
      <label>
        {user} ({userId}) - {bookName}
        <button onClick={confirmLease}>Vraćeno</button>
      </label>
    </div>
  );
};

export default Lease;
