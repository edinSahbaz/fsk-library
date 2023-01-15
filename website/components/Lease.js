import { deleteDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { db } from "../lib/firebase";
import { useBooks } from "./Layout";

const Lease = ({ bookId, userId, id }) => {
  const { books } = useBooks();
  const [bookName, setBookName] = useState("");
  const [bookQuantity, setBookQuantity] = useState(0);

  useEffect(() => {
    const book = books.filter((book) => book.id == bookId)[0];
    setBookName(book.name);
    setBookQuantity(book.quantity);
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
    }).then(() => {
      const bookRef = doc(db, 'books', bookId);
      updateDoc(bookRef, {
        quantity: bookQuantity + 1
      });
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
