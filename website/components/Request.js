import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { db } from "../lib/firebase";
import { useBooks } from "./Layout";

const Request = ({ bookId, userId, id }) => {
  const { books } = useBooks();
  const [bookName, setBookName] = useState("");

  useEffect(() => {
    const book = books.filter((book) => book.id == bookId)[0];
    setBookName(book.name);
  }, []);

  const confirmLease = () => {
    const leasesRef = collection(db, "leasedBooks");
    const reqRef = doc(db, "bookRequests", id);

    const loading = addDoc(leasesRef, {
      bookId,
      userId,
      addedTime: Timestamp.now(),
    }).then(() => {
      deleteDoc(reqRef);
    });

    toast.promise(loading, {
      loading: "Odobravanje zahtjeva...",
      success: "Zahtjev uspješno odobren!",
      error: "Greška...",
    });
  };

  return (
    <div>
      <label>
        {userId} - {bookName}
        <button onClick={confirmLease}>Odobri</button>
      </label>
    </div>
  );
};

export default Request;
