import { deleteDoc, doc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { db } from "../lib/firebase";
import { useBooks } from "./Layout";

const Lease = ({ bookId, userId, id }) => {
  const { books } = useBooks();
  const [bookName, setBookName] = useState("");

  useEffect(() => {
    const book = books.filter((book) => book.id == bookId)[0];
    setBookName(book.name);
  }, []);

  const confirmLease = () => {
    const ordersRef = doc(db, "leasedBooks", id);

    const loading = deleteDoc(ordersRef, {
      bookId,
      userId,
      addedTime: Timestamp.now(),
    });

    toast.promise(loading, {
      loading: "Obrada...",
      success: "Uspješna obrada!",
      error: "Greška...",
    });
  };

  return (
    <div>
      <label>
        {userId} - {bookName}
        <button onClick={confirmLease}>Vraćeno</button>
      </label>
    </div>
  );
};

export default Lease;
