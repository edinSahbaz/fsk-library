import {
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { db } from "../lib/firebase";
import { useBooks } from "./Layout";

const Lease = ({ bookId, userId, id }) => {
  const { books } = useBooks();
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
    const book = books.filter((book) => book.id == bookId)[0];
    setBookName(book.name);
    setBookQuantity(book.quantity);
  }, [books]);

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
